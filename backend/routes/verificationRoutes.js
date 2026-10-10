const express = require('express');
const router = express.Router();
const {
  sendVerificationCode,
  verifyCode,
  getVerificationStatus
} = require('../controllers/verificationController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

// Route 1: Dispatch 6-digit real-time SMS code
router.post('/send-code', optionalAuth, sendVerificationCode);

// Route 2: Verify submitted 6-digit code
router.post('/verify-code', optionalAuth, verifyCode);

// Route 3: Check verification status
router.get('/status', protect, getVerificationStatus);

module.exports = router;
