const express = require('express');
const router = express.Router();
const { register, verifyEmail, login } = require('../controllers/userController');
const { body } = require('express-validator');

// Register route
router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], register);

// Verify email route
router.post('/verify-email', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('verificationCode').isLength({ min: 6, max: 6 }).withMessage('Verification code must be 6 digits')
], verifyEmail);

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], login);

module.exports = router; 