const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All profile routes require authentication
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.get('/:id', protect, getUserById);

module.exports = router;
