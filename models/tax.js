'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tax = sequelize.define('Tax', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'taxes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Tax;
};
