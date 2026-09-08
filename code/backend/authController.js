const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('./user');

const generateToken = (user) => {

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};


// REGISTER

exports.register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      rollNumber,
      department
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message:
          'Missing required fields'
      });
    }

    if (
      !['student', 'teacher'].includes(role)
    ) {
      return res.status(400).json({
        message: 'Invalid role'
      });
    }

    const existing =
      await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message:
          'Email already registered'
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        rollNumber,
        department
      });

    res.status(201).json({

      message: 'User registered',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};


// LOGIN

exports.login = async (req, res) => {

  try {

    const {
      email,
      password,
      role
    } = req.body;

    if (
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message:
          'Email, password and role are required'
      });
    }

    const user =
      await User.findOne({
        email,
        role
      });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const token =
      generateToken(user);

    res.json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};


// FORGOT PASSWORD

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message:
          'No user with that email'
      });
    }

    const resetToken =
      crypto
        .randomBytes(32)
        .toString('hex');

    user.resetPasswordToken =
      crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    user.resetPasswordExpires =
      Date.now() +
      15 * 60 * 1000;

    await user.save();

    res.json({
      message: 'Reset token generated',
      resetToken
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};


// RESET PASSWORD

exports.resetPassword = async (req, res) => {

  try {

    const { token } = req.params;

    const { newPassword } =
      req.body;

    const hashedToken =
      crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user =
      await User.findOne({

        resetPasswordToken:
          hashedToken,

        resetPasswordExpires: {
          $gt: Date.now()
        }

      });

    if (!user) {
      return res.status(400).json({
        message:
          'Token invalid or expired'
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpires =
      undefined;

    await user.save();

    res.json({
      message:
        'Password reset successful'
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};


// CHANGE PASSWORD

exports.changePassword = async (req, res) => {

  try {

    const {
      oldPassword,
      newPassword
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isMatch =
      await bcrypt.compare(
        oldPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message:
          'Old password incorrect'
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

    await user.save();

    res.json({
      message:
        'Password changed successfully'
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};


// GET CURRENT USER

exports.getMe = async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};