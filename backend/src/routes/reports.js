const express = require('express');
const router = express.Router();
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  downloadReport
} = require('../controllers/reportController');
const { protect, optionalAuth } = require('../middleware/auth');
const { checkPermission } = require('../middleware/rbac');
const { validate, validators } = require('../utils/validator');
const { upload } = require('../config/upload');

// Public routes with optional auth
router.get('/', optionalAuth, validators.pagination, validate, getReports);
router.get('/:id', optionalAuth, validators.idParam, validate, getReport);
router.get('/:id/download', optionalAuth, validators.idParam, validate, downloadReport);

// Protected routes
router.use(protect);

router.post('/',
  checkPermission('report.upload'),
  upload.single('file'),
  validators.createReport,
  validate,
  createReport
);

router.put('/:id',
  checkPermission('report.update'),
  validators.idParam,
  validators.updateReport,
  validate,
  updateReport
);

router.delete('/:id',
  checkPermission('report.delete'),
  validators.idParam,
  validate,
  deleteReport
);

module.exports = router;