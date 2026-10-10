const express = require('express');
const router = express.Router();
const { uploadAvatar, uploadResume } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { 
  uploadAvatar: uploadAvatarMiddleware, 
  uploadResume: uploadResumeMiddleware 
} = require('../middleware/uploadMiddleware');

// Protected file upload endpoints
router.post('/avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);
router.post('/resume', protect, uploadResumeMiddleware.single('resume'), uploadResume);

module.exports = router;
