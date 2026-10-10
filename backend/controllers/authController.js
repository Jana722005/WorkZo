const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * @desc    Register a new user (Candidate or Employer)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { email, password, role = 'candidate', fullName, companyName } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const assignedRole = role === 'employer' ? 'employer' : 'candidate';
    const displayName = assignedRole === 'employer' 
      ? (companyName || fullName || 'Company Admin') 
      : (fullName || 'Job Seeker');

    // 2. Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: assignedRole,
          full_name: displayName,
          company_name: assignedRole === 'employer' ? (companyName || displayName) : null
        }
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    const user = authData.user;
    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Registration failed: user object not returned'
      });
    }

    // 3. Ensure profile record is created in profiles table for shared identity
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        role: assignedRole,
        full_name: displayName
      })
      .select()
      .single();

    if (profileError) {
      console.warn('Profile upsert warning:', profileError.message);
    }

    // 4. Populate separate tables: job_seekers for candidates, employers for employers
    if (assignedRole === 'candidate') {
      try {
        await supabaseAdmin
          .from('job_seekers')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: displayName,
            created_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('job_seekers table insert notice:', err.message);
      }
    } else if (assignedRole === 'employer') {
      let createdCompanyId = null;
      try {
        const { data: companyData, error: companyError } = await supabaseAdmin
          .from('companies')
          .insert({
            owner_id: user.id,
            name: companyName || displayName || 'My Company',
            contact_email: user.email,
            contact_person: displayName
          })
          .select('id')
          .single();

        if (companyError) {
          console.warn('Company creation warning:', companyError.message);
        } else {
          createdCompanyId = companyData?.id || null;
        }
      } catch (err) {
        console.warn('Company creation exception:', err.message);
      }

      try {
        await supabaseAdmin
          .from('employers')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: displayName,
            company_name: companyName || displayName || 'My Company',
            company_id: createdCompanyId,
            created_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn('employers table insert notice:', err.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered',
      session: authData.session,
      user: {
        id: user.id,
        email: user.email,
        role: assignedRole,
        fullName: displayName
      },
      profile: profile || {
        id: user.id,
        email: user.email,
        role: assignedRole,
        full_name: displayName
      }
    });
  } catch (error) {
    console.error('Registration exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: error.message
    });
  }
};

/**
 * @desc    Authenticate user & get session
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({
        success: false,
        message: authError.message
      });
    }

    const user = authData.user;

    // Fetch user profile from database to get authoritative role
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fallback if profile row is missing in profiles table
    if (!profile) {
      const fallbackRole = user.user_metadata?.role || role || 'candidate';
      const fallbackName = user.user_metadata?.full_name || '';
      
      const { data: createdProfile } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          role: fallbackRole,
          full_name: fallbackName
        })
        .select()
        .single();

      profile = createdProfile || {
        id: user.id,
        email: user.email,
        role: fallbackRole,
        full_name: fallbackName
      };
    }

    const registeredRole = (profile?.role || user.user_metadata?.role || 'candidate').toLowerCase();
    const requestedRole = (role || '').toLowerCase();

    // STRICT ROLE VERIFICATION:
    // If client specified a target login role (e.g. 'employer' or 'candidate'),
    // ensure the registered user profile matches this role.
    if (requestedRole && registeredRole !== requestedRole) {
      // Invalidate the session on mismatch to prevent session leak
      try {
        await supabase.auth.signOut();
      } catch (_) {}

      const requestedLabel = requestedRole === 'employer' ? 'Employer' : 'Job Seeker';
      const registeredLabel = registeredRole === 'employer' ? 'Employer' : 'Job Seeker';

      console.warn(`⚠️ [Auth Role Mismatch]: User ${email} attempted to log in as '${requestedLabel}' but is registered as '${registeredLabel}'`);

      return res.status(403).json({
        success: false,
        code: 'ROLE_MISMATCH',
        actualRole: registeredRole,
        requestedRole: requestedRole,
        message: `Account type mismatch: This account is registered as a ${registeredLabel}, not an ${requestedLabel}. Please switch to the ${registeredLabel} login tab.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      session: authData.session,
      user: {
        id: user.id,
        email: user.email,
        role: profile.role,
        fullName: profile.full_name
      },
      profile
    });
  } catch (error) {
    console.error('Login exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    });
  }
};

/**
 * @desc    Get currently logged-in user profile & role
 * @route   GET /api/auth/me
 * @access  Private (Bearer Token required)
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
      profile: req.profile
    });
  } catch (error) {
    console.error('getMe exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching profile',
      error: error.message
    });
  }
};

/**
 * @desc    Sign out user session
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Supabase signOut warning:', error.message);
    }
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during logout',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
