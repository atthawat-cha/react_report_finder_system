const { sequelize } = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const Report = require('./Report');
const Category = require('./Category');
const Department = require('./Department');
const Tag = require('./Tag');
const ActivityLog = require('./ActivityLog');

// Define associations

// User - Role (Many-to-Many)
User.belongsToMany(Role, { 
  through: 'user_roles',
  foreignKey: 'user_id',
  otherKey: 'role_id',
  as: 'roles'
});

Role.belongsToMany(User, { 
  through: 'user_roles',
  foreignKey: 'role_id',
  otherKey: 'user_id',
  as: 'users'
});

// Role - Permission (Many-to-Many)
Role.belongsToMany(Permission, { 
  through: 'role_permissions',
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions'
});

Permission.belongsToMany(Role, { 
  through: 'role_permissions',
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles'
});

// User - Department
User.belongsTo(Department, { 
  foreignKey: 'department_id',
  as: 'department'
});

Department.hasMany(User, { 
  foreignKey: 'department_id',
  as: 'users'
});

// Report - Category
Report.belongsTo(Category, { 
  foreignKey: 'category_id',
  as: 'category'
});

Category.hasMany(Report, { 
  foreignKey: 'category_id',
  as: 'reports'
});

// Report - Department
Report.belongsTo(Department, { 
  foreignKey: 'department_id',
  as: 'department'
});

Department.hasMany(Report, { 
  foreignKey: 'department_id',
  as: 'reports'
});

// Report - User (created_by)
Report.belongsTo(User, { 
  foreignKey: 'created_by',
  as: 'creator'
});

User.hasMany(Report, { 
  foreignKey: 'created_by',
  as: 'createdReports'
});

// Report - User (updated_by)
Report.belongsTo(User, { 
  foreignKey: 'updated_by',
  as: 'updater'
});

// Report - Tag (Many-to-Many)
Report.belongsToMany(Tag, { 
  through: 'report_tags',
  foreignKey: 'report_id',
  otherKey: 'tag_id',
  as: 'tags'
});

Tag.belongsToMany(Report, { 
  through: 'report_tags',
  foreignKey: 'tag_id',
  otherKey: 'report_id',
  as: 'reports'
});

// Category - Category (self-referencing for parent)
Category.hasMany(Category, { 
  foreignKey: 'parent_id',
  as: 'children'
});

Category.belongsTo(Category, { 
  foreignKey: 'parent_id',
  as: 'parent'
});

// Activity Log - User
ActivityLog.belongsTo(User, { 
  foreignKey: 'user_id',
  as: 'user'
});

User.hasMany(ActivityLog, { 
  foreignKey: 'user_id',
  as: 'activityLogs'
});

module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  Report,
  Category,
  Department,
  Tag,
  ActivityLog
};