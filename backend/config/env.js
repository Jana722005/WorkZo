const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  isSupabaseConfigured: () => {
    return (
      Boolean(process.env.SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_ANON_KEY) &&
      !process.env.SUPABASE_URL.includes('your-supabase-project')
    );
  }
};

module.exports = env;
