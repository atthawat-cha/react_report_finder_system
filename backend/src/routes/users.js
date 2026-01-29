const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize, checkPermission } = require('../middleware/rbac');
const { validate, validators } = require('../utils/validator');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(checkPermission('user.read'), validators.pagination, validate, getUsers)
  .post(checkPermission('user.create'), validators.createUser, validate, createUser);

router.route('/:id')
  .get(checkPermission('user.read'), validators.idParam, validate, getUser)
  .put(checkPermission('user.update'), validators.idParam, validators.updateUser, validate, updateUser)
  .delete(checkPermission('user.delete'), validators.idParam, validate, deleteUser);

router.patch('/:id/status', 
  checkPermission('user.update'), 
  validators.idParam, 
  validate, 
  updateUserStatus
);

module.exports = router;