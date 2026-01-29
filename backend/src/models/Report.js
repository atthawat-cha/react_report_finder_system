const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true
  },
  code: {
    type: DataTypes.STRING(50),
    unique: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  title_en: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  file_size: {
    type: DataTypes.BIGINT
  },
  file_type: {
    type: DataTypes.STRING(50)
  },
  mime_type: {
    type: DataTypes.STRING(100)
  },
  thumbnail_path: {
    type: DataTypes.STRING(500)
  },
  version: {
    type: DataTypes.STRING(20),
    defaultValue: '1.0'
  },
  author: {
    type: DataTypes.STRING(100)
  },
  report_date: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'published'
  },
  access_level: {
    type: DataTypes.ENUM('public', 'restricted', 'private'),
    defaultValue: 'public'
  },
  download_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  published_at: {
    type: DataTypes.DATE
  },
  archived_at: {
    type: DataTypes.DATE
  },
  deleted_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'reports',
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeCreate: async (report) => {
      if (!report.code) {
        const year = new Date().getFullYear();
        const count = await Report.count({ 
          where: sequelize.where(
            sequelize.fn('YEAR', sequelize.col('created_at')), 
            year
          )
        });
        report.code = `RPT-${year}-${String(count + 1).padStart(4, '0')}`;
      }
    }
  }
});

// Instance methods
Report.prototype.incrementDownloadCount = async function() {
  this.download_count += 1;
  await this.save();
};

Report.prototype.incrementViewCount = async function() {
  this.view_count += 1;
  await this.save();
};

module.exports = Report;