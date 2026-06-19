'use strict';

module.exports = (sequelize, DataTypes) => {
  const StockMovement = sequelize.define('StockMovement', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('purchase', 'sale', 'adjustment', 'return'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false
    },
    reference_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'stock_movements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  StockMovement.associate = (models) => {
    StockMovement.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });

    StockMovement.belongsTo(models.BackendUser, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  };

  return StockMovement;
};
