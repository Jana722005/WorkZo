const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * @desc    Get current user profile (with company details if employer)
 * @route   GET /api/users/me
 * @access  Private (Bearer token)
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error in getProfile:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user profile'
      });
    }

    const currentProfile = profile || {
      id: req.user.id,
      email: req.user.email,
      role: req.user.user_metadata?.role || 'candidate',
      full_name: req.user.user_metadata?.full_name || ''
    };

    // Enrich from separate role-specific tables:
    if (currentProfile.role === 'candidate') {
      try {
        const { data: jsData } = await supabaseAdmin
          .from('job_seekers')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (jsData) {
          Object.assign(currentProfile, jsData);
        }
      } catch (_) {}
    } else if (currentProfile.role === 'employer') {
      try {
        const { data: empData } = await supabaseAdmin
          .from('employers')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (empData) {
          Object.assign(currentProfile, empData);
        }
      } catch (_) {}
    }

    let company = null;
    // If the user is an employer, attach their associated company
    if (currentProfile.role === 'employer') {
      const { data: companyData, error: companyError } = await supabaseAdmin
        .from('companies')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!companyError && companyData) {
        company = companyData;
      }
    }

    return res.status(200).json({
      success: true,
      profile: currentProfile,
      company
    });
  } catch (error) {
    console.error('getProfile exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile',
      error: error.message
    });
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/me
 * @access  Private (Bearer token)
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      phone,
      location,
      headline,
      bio,
      skills,
      avatar_url,
      resume_url
    } = req.body;

    const updates = {
      updated_at: new Date().toISOString()
    };

    if (full_name !== undefined) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (headline !== undefined) updates.headline = headline;
    if (bio !== undefined) updates.bio = bio;
    if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : [];
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (resume_url !== undefined) updates.resume_url = resume_url;

    const client = req.supabase || supabaseAdmin;

    const { data: updatedProfile, error: updateError } = await client
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return res.status(400).json({
        success: false,
        message: 'Failed to update profile: ' + updateError.message
      });
    }

    // Also update the respective dedicated table (job_seekers or employers)
    const userRole = (req.user.user_metadata?.role || updatedProfile?.role || 'candidate').toLowerCase();
    if (userRole === 'candidate') {
      try {
        await supabaseAdmin
          .from('job_seekers')
          .update(updates)
          .eq('id', userId);
      } catch (err) {
        console.warn('job_seekers table update notice:', err.message);
      }
    } else if (userRole === 'employer') {
      try {
        await supabaseAdmin
          .from('employers')
          .update(updates)
          .eq('id', userId);
      } catch (err) {
        console.warn('employers table update notice:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('updateProfile exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
};

/**
 * @desc    Get another user's public profile by ID (e.g. employer viewing candidate applicant)
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role, avatar_url, location, headline, bio, skills, resume_url, created_at')
      .eq('id', id)
      .single();

    if (error || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    if (profile.role === 'candidate') {
      try {
        const { data: jsData } = await supabaseAdmin
          .from('job_seekers')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (jsData) Object.assign(profile, jsData);
      } catch (_) {}
    } else if (profile.role === 'employer') {
      try {
        const { data: empData } = await supabaseAdmin
          .from('employers')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (empData) Object.assign(profile, empData);
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('getUserById exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById
};
