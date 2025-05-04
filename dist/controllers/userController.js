"use strict";

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  sendVerificationEmail
} = require('../utils/emailService');

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user
const register = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      email
    });
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered'
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + process.env.VERIFICATION_CODE_EXPIRY * 1000);

    // Create new user
    const user = new User({
      email,
      password,
      verificationCode,
      verificationCodeExpiry
    });
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);
    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.'
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const {
      email,
      verificationCode
    } = req.body;
    const user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    if (user.isVerified) {
      return res.status(400).json({
        error: 'Email already verified'
      });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        error: 'Invalid verification code'
      });
    }
    if (user.verificationCodeExpiry < new Date()) {
      return res.status(400).json({
        error: 'Verification code expired'
      });
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();
    res.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        error: 'Please verify your email first'
      });
    }
    const token = jwt.sign({
      userId: user._id
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    res.json({
      token
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};
module.exports = {
  register,
  verifyEmail,
  login
};