const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
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
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50)
  },
  last_name: {
    type: DataTypes.STRING(50)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  profile_image: {
    type: DataTypes.STRING(255)
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  position: {
    type: DataTypes.STRING(100)
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  two_factor_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  two_factor_secret: {
    type: DataTypes.STRING(255)
  },
  password_changed_at: {
    type: DataTypes.DATE
  },
  last_login: {
    type: DataTypes.DATE
  },
  last_login_ip: {
    type: DataTypes.STRING(45)
  },
  failed_login_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  locked_until: {
    type: DataTypes.DATE
  },
  deleted_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
        user.password_changed_at = new Date();
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

User.prototype.isLocked = function() {
  return this.locked_until && this.locked_until > new Date();
};

User.prototype.incrementFailedAttempts = async function() {
  this.failed_login_attempts += 1;
  if (this.failed_login_attempts >= 5) {
    this.locked_until = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
  }
  await this.save();
};

User.prototype.resetFailedAttempts = async function() {
  this.failed_login_attempts = 0;
  this.locked_until = null;
  await this.save();
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password_hash;
  delete values.two_factor_secret;
  return values;
};

module.exports = User;