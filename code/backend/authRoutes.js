const express = require('express');

const router =
  express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe
} = require('./authController');

const {
  protect
} = require('./auth');

router.post(
  '/register',
  register
);

router.post(
  '/login',
  login
);

router.post(
  '/forgot-password',
  forgotPassword
);

router.post(
  '/reset-password/:token',
  resetPassword
);

router.put(
  '/change-password',
  protect,
  changePassword
);

router.get(
  '/me',
  protect,
  getMe
);

module.exports = router;