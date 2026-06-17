'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'roles',
    timestamps: false
  });

  Role.associate = (models) => {
    Role.hasMany(models.BackendUser, {
      foreignKey: 'role_id',
      as: 'backend_users'
    });
  };

  return Role;
};
