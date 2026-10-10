const { supabase, supabaseAdmin, getUserClient } = require('../config/supabase');

/**
 * Authentication Middleware:
 * Validates Supabase JWT from Authorization: Bearer <token>
 * Attaches req.user and req.profile
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: No authentication token provided'
      });
    }

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session'
      });
    }

    // Fetch user profile & role from the database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile in authMiddleware:', profileError);
    }

    req.user = user;
    req.token = token;
    req.supabase = getUserClient(token);
    req.profile = profile || {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'candidate',
      full_name: user.user_metadata?.full_name || ''
    };

    next();
  } catch (error) {
    console.error('Auth middleware exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication processing'
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware:
 * Example: authorize('employer'), authorize('admin'), authorize('employer', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.profile || !roles.includes(req.profile.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.profile?.role || 'unknown'}' cannot access this resource`
      });
    }
    next();
  };
};

/**
 * Optional Auth Middleware:
 * If a valid Bearer token is provided, populates req.user; otherwise continues
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        req.user = user;
        req.token = token;
      }
    }
  } catch (_) {}
  next();
};

module.exports = {
  protect,
  authorize,
  optionalAuth
};
