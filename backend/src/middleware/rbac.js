// Role-Based Access Control Middleware

// Check if user has specific role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    const userRoles = req.user.roles.map(role => role.name);
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `User role is not authorized to access this route. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Check if user has specific permission
const checkPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Super Admin has all permissions
    const userRoles = req.user.roles.map(role => role.name);
    if (userRoles.includes('Super Admin')) {
      return next();
    }

    // Get all user permissions from all roles
    const userPermissions = [];
    req.user.roles.forEach(role => {
      if (role.permissions) {
        role.permissions.forEach(permission => {
          if (!userPermissions.includes(permission.name)) {
            userPermissions.push(permission.name);
          }
        });
      }
    });

    // Check if user has at least one of the required permissions
    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to perform this action. Required permissions: ${permissions.join(', ')}`
      });
    }

    next();
  };
};

// Check if user owns the resource
const checkOwnership = (modelName, userIdField = 'created_by') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Super Admin can access everything
    const userRoles = req.user.roles.map(role => role.name);
    if (userRoles.includes('Super Admin') || userRoles.includes('Admin')) {
      return next();
    }

    try {
      const Model = require(`../models/${modelName}`);
      const resourceId = req.params.id;
      const resource = await Model.findByPk(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      if (resource[userIdField] !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to access this resource'
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authorize,
  checkPermission,
  checkOwnership
};