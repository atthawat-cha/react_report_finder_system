const { Report, Category, Tag, User, Department, ActivityLog } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');
const { reportsDir, getMimeType, getFileCategory } = require('../config/upload');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public/Private
exports.getReports = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      category_id, 
      department_id,
      status,
      access_level,
      tags,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    const where = { deleted_at: null };

    // Filter by access level based on user
    if (!req.user) {
      where.access_level = 'public';
    } else {
      const userRoles = req.user.roles.map(r => r.name);
      if (!userRoles.includes('Super Admin') && !userRoles.includes('Admin')) {
        where[Op.or] = [
          { access_level: 'public' },
          { access_level: 'restricted' },
          { created_by: req.user.id }
        ];
      }
    }

    // Search
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { title_en: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filters
    if (category_id) where.category_id = category_id;
    if (department_id) where.department_id = department_id;
    if (status) where.status = status;
    if (access_level) where.access_level = access_level;

    const includeOptions = [
      { model: Category, as: 'category' },
      { model: Department, as: 'department' },
      { model: Tag, as: 'tags' },
      { model: User, as: 'creator', attributes: ['id', 'username', 'first_name', 'last_name'] }
    ];

    const { count, rows } = await Report.findAndCountAll({
      where,
      include: includeOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_order.toUpperCase()]],
      distinct: true
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

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public/Private
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Department, as: 'department' },
        { model: Tag, as: 'tags' },
        { model: User, as: 'creator', attributes: ['id', 'username', 'first_name', 'last_name'] },
        { model: User, as: 'updater', attributes: ['id', 'username', 'first_name', 'last_name'] }
      ]
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check access permission
    if (report.access_level === 'private' && (!req.user || report.created_by !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this report'
      });
    }

    // Increment view count
    await report.incrementViewCount();

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { title, title_en, description, category_id, department_id, access_level, tags, author, report_date } = req.body;

    // Move file from temp to reports directory
    const fileName = req.file.filename;
    const tempPath = req.file.path;
    const finalPath = path.join(reportsDir, fileName);
    
    await fs.rename(tempPath, finalPath);

    // Create report
    const report = await Report.create({
      title,
      title_en,
      description,
      category_id,
      department_id: department_id || req.user.department_id,
      file_name: req.file.originalname,
      file_path: `/uploads/reports/${fileName}`,
      file_size: req.file.size,
      file_type: path.extname(req.file.originalname).toLowerCase().replace('.', ''),
      mime_type: getMimeType(req.file.originalname),
      author,
      report_date,
      access_level: access_level || 'public',
      status: 'published',
      created_by: req.user.id,
      published_at: new Date()
    });

    // Add tags
    if (tags) {
      const tagIds = JSON.parse(tags);
      const tagInstances = await Tag.findAll({ where: { id: tagIds } });
      await report.setTags(tagInstances);
    }

    // Reload with associations
    await report.reload({
      include: [
        { model: Category, as: 'category' },
        { model: Department, as: 'department' },
        { model: Tag, as: 'tags' },
        { model: User, as: 'creator' }
      ]
    });

    // Log activity
    await ActivityLog.log({
      userId: req.user.id,
      action: 'report_uploaded',
      entityType: 'Report',
      entityId: report.id,
      description: `Uploaded report: ${report.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    // Clean up file if error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {}
    }
    next(error);
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
exports.updateReport = async (req, res, next) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check permission
    const userRoles = req.user.roles.map(r => r.name);
    if (!userRoles.includes('Super Admin') && !userRoles.includes('Admin') && report.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this report'
      });
    }

    const { tags, ...updateData } = req.body;
    updateData.updated_by = req.user.id;

    await report.update(updateData);

    // Update tags if provided
    if (tags) {
      const tagInstances = await Tag.findAll({ where: { id: tags } });
      await report.setTags(tagInstances);
    }

    // Reload with associations
    await report.reload({
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });

    // Log activity
    await ActivityLog.log({
      userId: req.user.id,
      action: 'report_updated',
      entityType: 'Report',
      entityId: report.id,
      description: `Updated report: ${report.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      changes: updateData
    });

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (Admin or Owner)
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check permission
    const userRoles = req.user.roles.map(r => r.name);
    if (!userRoles.includes('Super Admin') && !userRoles.includes('Admin') && report.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report'
      });
    }

    // Delete file
    const filePath = path.join(__dirname, '../../', report.file_path);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Soft delete
    await report.destroy();

    // Log activity
    await ActivityLog.log({
      userId: req.user.id,
      action: 'report_deleted',
      entityType: 'Report',
      entityId: report.id,
      description: `Deleted report: ${report.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Public/Private
exports.downloadReport = async (req, res, next) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check access permission
    if (report.access_level === 'private' && (!req.user || report.created_by !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to download this report'
      });
    }

    const filePath = path.join(__dirname, '../../', report.file_path);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Increment download count
    await report.incrementDownloadCount();

    // Log download
    await ActivityLog.log({
      userId: req.user?.id,
      action: 'report_downloaded',
      entityType: 'Report',
      entityId: report.id,
      description: `Downloaded report: ${report.title}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Send file
    res.download(filePath, report.file_name);
  } catch (error) {
    next(error);
  }
};