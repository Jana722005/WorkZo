const app = require('./app');
const env = require('./config/env');

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 WORKZO Backend Server running on port ${PORT}`);
  console.log(`🌐 Health check:  http://localhost:${PORT}/api/health`);
  console.log(`🔑 Auth Register: http://localhost:${PORT}/api/auth/register`);
  console.log(`🔑 Auth Login:    http://localhost:${PORT}/api/auth/login`);
  console.log(`🔑 Auth Me:       http://localhost:${PORT}/api/auth/me`);
  console.log(`📦 Environment:   ${env.NODE_ENV}`);
  console.log(`⚡ Supabase:      ${env.isSupabaseConfigured() ? 'Connected' : 'Pending configuration in .env'}`);
  console.log('====================================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});
