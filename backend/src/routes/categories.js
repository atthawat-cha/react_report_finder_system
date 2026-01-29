const express = require('express');
const router = express.Router();
const { Category, Report } = require('../models');
const { protect, optionalAuth } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');
const { validate, validators } = require('../utils/validator');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { active: true },
      include: [{
        model: Category,
        as: 'children'
      }],
      order: [
        ['sort_order', 'ASC'],
        ['name', 'ASC']
      ]
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', validators.idParam, validate, async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'children' },
        { model: Category, as: 'parent' }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.use(protect);

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
router.post('/',
  checkPermission('category.create'),
  validators.createCategory,
  validate,
  async (req, res, next) => {
    try {
      const category = await Category.create(req.body);

      res.status(201).json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
router.put('/:id',
  checkPermission('category.update'),
  validators.idParam,
  validate,
  async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      await category.update(req.body);

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      next(error);
    }
  }
);

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
router.delete('/:id',
  checkPermission('category.delete'),
  validators.idParam,
  validate,
  async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Check if category has reports
      const reportCount = await Report.count({ where: { category_id: category.id } });
      if (reportCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category with ${reportCount} reports. Please reassign reports first.`
        });
      }

      await category.destroy();

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;