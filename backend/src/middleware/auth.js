const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');
const authConfig = require('../config/auth');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, authConfig.jwt.secret);

      // Get user from token
      const user = await User.findByPk(decoded.id, {
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
          message: 'User no longer exists'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated'
        });
      }

      // Check if user is locked
      if (user.isLocked()) {
        return res.status(401).json({
          success: false,
          message: 'Your account is temporarily locked due to multiple failed login attempts'
        });
      }

      // Check if password was changed after token was issued
      if (user.password_changed_at && decoded.iat < user.password_changed_at.getTime() / 1000) {
        return res.status(401).json({
          success: false,
          message: 'Password was recently changed. Please log in again'
        });
      }

      // Grant access to protected route
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, authConfig.jwt.secret);
        const user = await User.findByPk(decoded.id, {
          include: [{
            model: Role,
            as: 'roles',
            include: [{
              model: Permission,
              as: 'permissions'
            }]
          }]
        });

        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (err) {
        // Token invalid, continue without user
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  optionalAuth
};