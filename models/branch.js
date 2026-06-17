'use strict';

module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define('Branch', {
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
    tableName: 'branches',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Branch.associate = (models) => {
    Branch.hasMany(models.BackendUser, {
      foreignKey: 'branch_id',
      as: 'backend_users'
    });
  };

  return Branch;
};
