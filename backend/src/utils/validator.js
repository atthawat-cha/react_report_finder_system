const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Common validation rules
const validators = {
  // Auth validators
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],

  register: [
    body('username')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
      .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number and special character'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required')
  ],

  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number and special character'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage('Passwords do not match')
  ],

  // User validators
  createUser: [
    body('username')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
      .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('role_ids').optional().isArray().withMessage('Role IDs must be an array')
  ],

  updateUser: [
    body('username').optional()
      .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
    body('last_name').optional().notEmpty().withMessage('Last name cannot be empty')
  ],

  // Report validators
  createReport: [
    body('title').notEmpty().withMessage('Title is required')
      .isLength({ max: 255 }).withMessage('Title is too long'),
    body('description').optional(),
    body('category_id').optional().isInt().withMessage('Category ID must be a number'),
    body('department_id').optional().isInt().withMessage('Department ID must be a number'),
    body('access_level').optional()
      .isIn(['public', 'restricted', 'private']).withMessage('Invalid access level'),
    body('tags').optional().isArray().withMessage('Tags must be an array')
  ],

  updateReport: [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category_id').optional().isInt().withMessage('Category ID must be a number'),
    body('department_id').optional().isInt().withMessage('Department ID must be a number')
  ],

  // Category validators
  createCategory: [
    body('name').notEmpty().withMessage('Category name is required'),
    body('slug').optional().matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers and hyphens'),
    body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Invalid color format')
  ],

  // ID parameter validator
  idParam: [
    param('id').isInt().withMessage('ID must be a number')
  ],

  // Pagination validators
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive number'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ]
};

module.exports = {
  validate,
  validators
};