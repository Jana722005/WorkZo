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

// Admin service-role client for backend privileged operations (bypassing RLS when necessary)
const supabaseAdmin = createClient(
  env.SUPABASE_URL || 'https://placeholder.supabase.co',
  env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = {
  supabase,
  supabaseAdmin,
  isConfigured
};
