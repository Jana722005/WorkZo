const { supabaseAdmin } = require('../config/supabase');

/**
 * @desc    Upload candidate/employer profile picture
 * @route   POST /api/upload/avatar
 * @access  Private (Bearer token)
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const userId = req.user.id;
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

    const client = req.supabase || supabaseAdmin;

    // Update avatar_url in the database
    const { data: updatedProfile, error } = await client
      .from('profiles')
      .update({
        avatar_url: fileUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating avatar in DB:', error);
    }

    // Also update in job_seekers or employers table
    const role = (req.user?.user_metadata?.role || updatedProfile?.role || 'candidate').toLowerCase();
    if (role === 'candidate') {
      try {
        await supabaseAdmin
          .from('job_seekers')
          .update({ avatar_url: fileUrl, updated_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (_) {}
    } else if (role === 'employer') {
      try {
        await supabaseAdmin
          .from('employers')
          .update({ avatar_url: fileUrl, updated_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      avatar_url: fileUrl,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('uploadAvatar exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload profile image: ' + error.message
    });
  }
};

/**
 * @desc    Upload candidate resume document (PDF / DOC / DOCX)
 * @route   POST /api/upload/resume
 * @access  Private (Bearer token)
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume document (PDF, DOC, or DOCX)'
      });
    }

    const userId = req.user.id;
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;

    const client = req.supabase || supabaseAdmin;

    // Update resume_url in the database
    const { data: updatedProfile, error } = await client
      .from('profiles')
      .update({
        resume_url: fileUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating resume in DB:', error);
    }

    // Also update in job_seekers table
    try {
      await supabaseAdmin
        .from('job_seekers')
        .update({ resume_url: fileUrl, updated_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (_) {}

    return res.status(200).json({
      success: true,
      message: 'Resume document uploaded successfully',
      resume_url: fileUrl,
      filename: req.file.originalname,
      size: req.file.size,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('uploadResume exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload resume: ' + error.message
    });
  }
};

module.exports = {
  uploadAvatar,
  uploadResume
};
