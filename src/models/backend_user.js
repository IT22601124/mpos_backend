'use strict';

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
  }, {
    tableName: 'backend_users',
    timestamps: true,
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

  return BackendUser;
};