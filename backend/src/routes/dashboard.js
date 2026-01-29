const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { Report, User, Category, ActivityLog } = require('../models');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');

// All routes require authentication
router.use(protect);

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', checkPermission('dashboard.view'), async (req, res, next) => {
  try {
    // Total counts
    const [totalReports, totalUsers, totalCategories] = await Promise.all([
      Report.count({ where: { status: 'published' } }),
      User.count({ where: { status: 'active' } }),
      Category.count({ where: { active: true } })
    ]);

    // Today's downloads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDownloads = await ActivityLog.count({
      where: {
        action: 'report_downloaded',
        created_at: { [sequelize.Sequelize.Op.gte]: today }
      }
    });

    // Storage usage (sum of all file sizes)
    const storageResult = await Report.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('file_size')), 'total_size']
      ],
      raw: true
    });

    const storageUsed = storageResult.total_size || 0;

    res.status(200).json({
      success: true,
      data: {
        totalReports,
        totalUsers,
        totalCategories,
        todayDownloads,
        storageUsed,
        storageUsedGB: (storageUsed / (1024 * 1024 * 1024)).toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get popular reports
// @route   GET /api/dashboard/popular-reports
// @access  Private
router.get('/popular-reports', checkPermission('dashboard.view'), async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const reports = await Report.findAll({
      where: { status: 'published' },
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'first_name', 'last_name'] }
      ],
      order: [['download_count', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get recent reports
// @route   GET /api/dashboard/recent-reports
// @access  Private
router.get('/recent-reports', checkPermission('dashboard.view'), async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const reports = await Report.findAll({
      where: { status: 'published' },
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'first_name', 'last_name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private (Admin)
router.get('/activities', checkPermission('audit.view'), async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await ActivityLog.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'first_name', 'last_name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get reports by category
// @route   GET /api/dashboard/reports-by-category
// @access  Private
router.get('/reports-by-category', checkPermission('dashboard.statistics'), async (req, res, next) => {
  try {
    const stats = await Report.findAll({
      attributes: [
        'category_id',
        [sequelize.fn('COUNT', sequelize.col('Report.id')), 'count']
      ],
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'color'] }
      ],
      where: { status: 'published' },
      group: ['category_id', 'category.id'],
      raw: false
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get download statistics
// @route   GET /api/dashboard/download-stats
// @access  Private (Admin)
router.get('/download-stats', checkPermission('dashboard.statistics'), async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await ActivityLog.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        action: 'report_downloaded',
        created_at: { [sequelize.Sequelize.Op.gte]: startDate }
      },
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;