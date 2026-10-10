-- ==============================================================================
-- MIGRATION: SEPARATE TABLES FOR EMPLOYERS AND JOB SEEKERS
-- ==============================================================================

-- 1. JOB SEEKERS TABLE (Dedicated table for Candidates / Job Seekers)
CREATE TABLE IF NOT EXISTS public.job_seekers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  headline TEXT,
  bio TEXT,
  location TEXT,
  experience_level TEXT DEFAULT '0–2 Years',
  skills TEXT[] DEFAULT '{}',
  resume_url TEXT,
  avatar_url TEXT,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  is_email_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_seekers_email ON public.job_seekers(email);
CREATE INDEX IF NOT EXISTS idx_job_seekers_phone ON public.job_seekers(phone);
CREATE INDEX IF NOT EXISTS idx_job_seekers_location ON public.job_seekers(location);

-- 2. EMPLOYERS TABLE (Dedicated table for Employers & Recruiters)
CREATE TABLE IF NOT EXISTS public.employers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  company_name TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  designation TEXT DEFAULT 'Hiring Manager',
  department TEXT,
  location TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employers_email ON public.employers(email);
CREATE INDEX IF NOT EXISTS idx_employers_company ON public.employers(company_id);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

-- Job Seekers RLS:
CREATE POLICY "Job seekers viewable by authenticated users" ON public.job_seekers FOR SELECT USING (true);
CREATE POLICY "Job seekers can update own profile" ON public.job_seekers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Job seekers can insert own profile" ON public.job_seekers FOR INSERT WITH CHECK (auth.uid() = id);

-- Employers RLS:
CREATE POLICY "Employers viewable by authenticated users" ON public.employers FOR SELECT USING (true);
CREATE POLICY "Employers can update own profile" ON public.employers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Employers can insert own profile" ON public.employers FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. BACKFILL DATA FROM EXISTING PROFILES (IF ANY)
INSERT INTO public.job_seekers (id, email, full_name, phone, location, headline, bio, skills, resume_url, avatar_url, created_at, updated_at)
SELECT 
  id, 
  email, 
  COALESCE(full_name, 'Job Seeker'), 
  phone, 
  location, 
  headline, 
  bio, 
  COALESCE(skills, '{}'), 
  resume_url, 
  avatar_url, 
  created_at, 
  updated_at
FROM public.profiles
WHERE role = 'candidate'
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = COALESCE(EXCLUDED.phone, public.job_seekers.phone),
  updated_at = NOW();

INSERT INTO public.employers (id, email, full_name, phone, company_name, company_id, location, avatar_url, created_at, updated_at)
SELECT 
  p.id, 
  p.email, 
  COALESCE(p.full_name, c.contact_person, 'Employer Admin'), 
  COALESCE(p.phone, c.contact_email), 
  COALESCE(c.name, 'My Company'), 
  c.id, 
  COALESCE(p.location, c.location), 
  p.avatar_url, 
  p.created_at, 
  p.updated_at
FROM public.profiles p
LEFT JOIN public.companies c ON c.owner_id = p.id
WHERE p.role = 'employer'
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  company_id = COALESCE(EXCLUDED.company_id, public.employers.company_id),
  updated_at = NOW();

-- 5. AUTOMATIC TRIGGER FOR FUTURE SIGNUPS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
  comp_name TEXT;
  new_comp_id UUID;
BEGIN
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'candidate');
  user_name := COALESCE(new.raw_user_meta_data->>'full_name', '');
  comp_name := COALESCE(new.raw_user_meta_data->>'company_name', user_name);

  -- Always maintain profiles for backwards compatibility and foreign keys
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, user_name, user_role)
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    role = COALESCE(EXCLUDED.role, public.profiles.role);

  -- Dedicated Candidate/Job Seeker Table Insert
  IF user_role = 'candidate' THEN
    INSERT INTO public.job_seekers (id, email, full_name)
    VALUES (new.id, new.email, COALESCE(user_name, 'Job Seeker'))
    ON CONFLICT (id) DO NOTHING;

  -- Dedicated Employer Table Insert
  ELSIF user_role = 'employer' THEN
    -- Ensure Company record exists
    INSERT INTO public.companies (owner_id, name, contact_email, contact_person)
    VALUES (new.id, COALESCE(comp_name, 'My Company'), new.email, user_name)
    RETURNING id INTO new_comp_id;

    INSERT INTO public.employers (id, email, full_name, company_name, company_id)
    VALUES (new.id, new.email, COALESCE(user_name, 'Employer Admin'), COALESCE(comp_name, 'My Company'), new_comp_id)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
