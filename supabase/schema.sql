-- ==============================================================================
-- WORKZO Job Portal - Supabase PostgreSQL Schema
-- Order of creation:
-- 1. extensions & helper functions
-- 2. profiles (Unified user identity table)
-- 3. job_seekers (Dedicated separate table for Candidates / Job Seekers)
-- 4. employers (Dedicated separate table for Employers / Recruiters)
-- 5. companies (Employer company entities)
-- 6. jobs (Postings)
-- 7. applications (Candidate applications)
-- 8. saved_jobs (Bookmarks)
-- 9. interviews (Video/Technical calls)
-- 10. notifications (Platform alerts)
-- 11. verifications (Candidate badge verification)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE (Unified Identity & Role Reference)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'employer', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  headline TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ==============================================================================
-- 3. JOB_SEEKERS TABLE (Dedicated Table for Job Seekers / Candidates)
-- ==============================================================================
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

-- ==============================================================================
-- 4. COMPANIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  industry TEXT,
  size TEXT,
  website TEXT,
  location TEXT,
  contact_person TEXT,
  contact_email TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_owner ON public.companies(owner_id);

-- ==============================================================================
-- 5. EMPLOYERS TABLE (Dedicated Table for Employers & Recruiters)
-- ==============================================================================
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

-- ==============================================================================
-- 6. JOBS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  job_type TEXT NOT NULL DEFAULT 'Full-time', -- Full-time, Part-time, Contract, Internship
  work_mode TEXT NOT NULL DEFAULT 'Remote',    -- Remote, On-site, Hybrid
  location TEXT NOT NULL DEFAULT 'Remote',
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_display TEXT,                        -- e.g. "₹5–8 LPA" or "$130k - $155k"
  experience_level TEXT,                      -- e.g. "2–5 Years"
  skills TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Draft', 'Active', 'Paused', 'Closed', 'Expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON public.jobs(created_by);

-- ==============================================================================
-- 7. APPLICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected')),
  resume_url TEXT,
  cover_letter TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON public.applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- ==============================================================================
-- 8. SAVED JOBS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_jobs_candidate ON public.saved_jobs(candidate_id);

-- ==============================================================================
-- 9. INTERVIEWS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interview_date TIMESTAMPTZ NOT NULL,
  interview_type TEXT NOT NULL DEFAULT 'Technical System Round',
  meeting_link TEXT,
  interviewer_name TEXT,
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interviews_candidate ON public.interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_employer ON public.interviews(employer_id);

-- ==============================================================================
-- 10. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system', -- 'application', 'interview', 'system'
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ==============================================================================
-- 11. VERIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'identity', 'education', 'experience')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
  document_url TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

CREATE INDEX IF NOT EXISTS idx_verifications_user ON public.verifications(user_id);

-- ==============================================================================
-- 12. AUTOMATIC PROFILE, JOB SEEKER & EMPLOYER TRIGGER ON SIGNUP
-- ==============================================================================
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

  -- 1. Maintain profiles for shared authentication
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, user_name, user_role)
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    role = COALESCE(EXCLUDED.role, public.profiles.role);

  -- 2. Populate job_seekers table if candidate
  IF user_role = 'candidate' THEN
    INSERT INTO public.job_seekers (id, email, full_name)
    VALUES (new.id, new.email, COALESCE(user_name, 'Job Seeker'))
    ON CONFLICT (id) DO NOTHING;

  -- 3. Populate employers and companies table if employer
  ELSIF user_role = 'employer' THEN
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

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view basic profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Job Seekers: Authenticated users can view, owner can update
CREATE POLICY "Job seekers viewable by authenticated users" ON public.job_seekers FOR SELECT USING (true);
CREATE POLICY "Job seekers can update own profile" ON public.job_seekers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Job seekers can insert own profile" ON public.job_seekers FOR INSERT WITH CHECK (auth.uid() = id);

-- Employers: Authenticated users can view, owner can update
CREATE POLICY "Employers viewable by authenticated users" ON public.employers FOR SELECT USING (true);
CREATE POLICY "Employers can update own profile" ON public.employers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Employers can insert own profile" ON public.employers FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies: Public viewable, owner can update
CREATE POLICY "Companies viewable by all" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Employers can insert company" ON public.companies FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update company" ON public.companies FOR UPDATE USING (auth.uid() = owner_id);

-- Jobs: Active jobs viewable by all, employer can manage their jobs
CREATE POLICY "Active jobs viewable by all" ON public.jobs FOR SELECT USING (status = 'Active' OR auth.uid() = created_by);
CREATE POLICY "Employers can insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Employers can update their jobs" ON public.jobs FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Employers can delete their jobs" ON public.jobs FOR DELETE USING (auth.uid() = created_by);

-- Applications: Candidate can view their own, Employer can view applicants for their jobs
CREATE POLICY "Candidates view own applications" ON public.applications FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Employers view applications to their jobs" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE public.jobs.id = public.applications.job_id AND public.jobs.created_by = auth.uid())
);
CREATE POLICY "Candidates can apply" ON public.applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);
CREATE POLICY "Employers can update application status" ON public.applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE public.jobs.id = public.applications.job_id AND public.jobs.created_by = auth.uid())
);

-- Saved Jobs: Candidate manages their saved jobs
CREATE POLICY "Candidates manage saved jobs" ON public.saved_jobs FOR ALL USING (auth.uid() = candidate_id);

-- Interviews: Participants view their interviews
CREATE POLICY "Interviews viewable by candidate or employer" ON public.interviews FOR SELECT USING (
  auth.uid() = candidate_id OR auth.uid() = employer_id
);
CREATE POLICY "Employers can schedule interviews" ON public.interviews FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update interviews" ON public.interviews FOR UPDATE USING (auth.uid() = employer_id);

-- Notifications: Users manage own notifications
CREATE POLICY "Users view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Verifications: Users view own verifications
CREATE POLICY "Users view own verifications" ON public.verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own verifications" ON public.verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
