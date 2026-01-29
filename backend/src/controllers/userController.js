const { User, Role, Department, ActivityLog } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status, department_id, role_id } = req.query;
    
    const offset = (page - 1) * limit;
    const where = {};

    // Search
    if (search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by department
    if (department_id) {
      where.department_id = department_id;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [
        { model: Role, as: 'roles' },
        { model: Department, as: 'department' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Role, as: 'roles' },
        { model: Department, as: 'department' }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = async (req, res, next) => {
  try {
    const { role_ids, ...userData } = req.body;

    // Create user
    const user = await User.create({
      ...userData,
      password_hash: userData.password || 'ChangeMe@123'
    });

    // Assign roles
    if (role_ids && role_ids.length > 0) {
      const roles = await Role.findAll({ where: { id: role_ids } });
      await user.setRoles(roles);
    }

    // Reload with associations
    await user.reload({
      include: [
        { model: Role, as: 'roles' },
        { model: Department, as: 'department' }
      ]
    });

    // Log activity
    await ActivityLog.log({
      userId: req.user.id,
      action: 'user_created',
      entityType: 'User',
      entityId: user.id,
      description: `Created user: ${user.username}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or Owner)
exports.updateUser = async (req, res, next) => {
  try {
    const { role_ids, password, ...userData } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user data
    await user.update(userData);

    // Update password if provided
    if (password) {
      user.password_hash = password;
      await user.save();
    }

    // Update roles if provided
    if (role_ids) {
      const roles = await Role.findAll({ where: { id: role_ids } });
      await user.setRoles(roles);
    }

    // Reload with associations
    await user.reload({
      include: [
        { model: Role, as: 'roles' },
        { model: Department, as: 'department' }
      ]
    });

    // Log activity
    await ActivityLog.log({
      userId: req.user.id,
      action: 'user_updated',
      entityType: 'User',
      entityId: user.id,
      description: `Updated user: ${user.username}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      changes: userData
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Soft delete
    await user.destroy();

    // Log activity
    await ActivityLog.log({
      userId: req.user.id,
      action: 'user_deleted',
      entityType: 'User',
      entityId: user.id,
      description: `Deleted user: ${user.username}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PATCH /api/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = status;
    await user.save();

    // Log activity
    await ActivityLog.log({
      userId: req.user.id,
      action: 'user_status_changed',
      entityType: 'User',
      entityId: user.id,
      description: `Changed user status to: ${status}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};