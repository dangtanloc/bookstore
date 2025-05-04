"use strict";

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - Bookstore',
    html: `
      <h1>Welcome to Bookstore!</h1>
      <p>Please use the following verification code to verify your email address:</p>
      <h2>${verificationCode}</h2>
      <p>This code will expire in 1 hour.</p>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};
module.exports = {
  sendVerificationEmail
};