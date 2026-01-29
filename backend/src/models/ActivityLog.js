const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  entity_type: {
    type: DataTypes.STRING(50)
  },
  entity_id: {
    type: DataTypes.INTEGER
  },
  description: {
    type: DataTypes.TEXT
  },
  ip_address: {
    type: DataTypes.STRING(45)
  },
  user_agent: {
    type: DataTypes.TEXT
  },
  changes: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'activity_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Static method to log activity
ActivityLog.log = async function(data) {
  return await this.create({
    user_id: data.userId,
    action: data.action,
    entity_type: data.entityType,
    entity_id: data.entityId,
    description: data.description,
    ip_address: data.ipAddress,
    user_agent: data.userAgent,
    changes: data.changes
  });
};

module.exports = ActivityLog;