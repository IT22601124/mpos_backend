'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const BackendUser = sequelize.define('BackendUser', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
  }, {
    tableName: 'backend_users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // ✅ RELATIONS HERE (IMPORTANT)
  BackendUser.associate = function (models) {
    BackendUser.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role',
    });

    BackendUser.belongsTo(models.Branch, {
      foreignKey: 'branch_id',
      as: 'branch',
    });
  };

  BackendUser.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  BackendUser.prototype.generateAccessToken = async function () {
    return jwt.sign(
      {
        id: this.id,
        phone: this.phone,
        role_id: this.role_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  };

  return BackendUser;
};
