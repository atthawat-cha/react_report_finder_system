const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  getMe,
  updatePassword,
  forgotPassword,
  register
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, validators } = require('../utils/validator');

// Public routes
router.post('/login', validators.login, validate, login);
router.post('/register', validators.register, validate, register);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/password', validators.changePassword, validate, updatePassword);

module.exports = router;