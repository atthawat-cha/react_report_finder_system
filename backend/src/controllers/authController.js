const jwt = require('jsonwebtoken');
const { User, Role, Permission, ActivityLog } = require('../models');
const authConfig = require('../config/auth');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user.id);

  const options = {
    expires: new Date(Date.now() + authConfig.jwt.cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: user.toJSON()
    });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: Role,
        as: 'roles',
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incrementFailedAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset failed attempts
    await user.resetFailedAttempts();

    // Update last login
    user.last_login = new Date();
    user.last_login_ip = req.ip;
    await user.save();

    // Log activity
    await ActivityLog.log({
      userId: user.id,
      action: 'login',
      description: 'User logged in',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Log activity
    await ActivityLog.log({
      userId: req.user.id,
      action: 'logout',
      description: 'User logged out',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Role,
        as: 'roles',
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    // Check current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password_hash = newPassword;
    await user.save();

    // Log activity
    await ActivityLog.log({
      userId: user.id,
      action: 'password_changed',
      description: 'User changed password',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate reset token (implement token generation and email sending)
    // This is a placeholder - you should implement proper password reset with email

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public (if enabled)
exports.register = async (req, res, next) => {
  try {
    // Check if registration is enabled
    if (process.env.ENABLE_REGISTRATION !== 'true') {
      return res.status(403).json({
        success: false,
        message: 'Registration is currently disabled'
      });
    }

    const { username, email, password, first_name, last_name } = req.body;

    // Create user
    const user = await User.create({
      username,
      email,
      password_hash: password,
      first_name,
      last_name
    });

    // Assign default role
    const defaultRole = await Role.findOne({ where: { name: 'User' } });
    if (defaultRole) {
      await user.addRole(defaultRole);
    }

    // Reload user with roles
    await user.reload({
      include: [{
        model: Role,
        as: 'roles',
        include: [{
          model: Permission,
          as: 'permissions'
        }]
      }]
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};