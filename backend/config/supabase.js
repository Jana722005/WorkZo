const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

const isConfigured = env.isSupabaseConfigured();

if (!isConfigured) {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '⚠️  [Supabase] Note: SUPABASE_URL / SUPABASE_ANON_KEY are not configured yet with real project credentials in backend/.env.'
  );
}

// Standard public/anon client for user session actions
const supabase = createClient(
  env.SUPABASE_URL || 'https://placeholder.supabase.co',
  env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const adminKey = (
  env.SUPABASE_SERVICE_ROLE_KEY &&
  !env.SUPABASE_SERVICE_ROLE_KEY.includes('your-supabase-service-role') &&
  !env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')
) ? env.SUPABASE_SERVICE_ROLE_KEY : (env.SUPABASE_ANON_KEY || 'placeholder-anon-key');

// Admin service-role client for backend operations
const supabaseAdmin = createClient(
  env.SUPABASE_URL || 'https://placeholder.supabase.co',
  adminKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Factory function to create a user-scoped Supabase client that respects RLS policies
const getUserClient = (token) => {
  if (!token) return supabase;
  return createClient(
    env.SUPABASE_URL || 'https://placeholder.supabase.co',
    env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );
};

module.exports = {
  supabase,
  supabaseAdmin,
  getUserClient,
  isConfigured
};
