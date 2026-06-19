'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProductBatch = sequelize.define('ProductBatch', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    batch_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0
    },
    manufacture_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'product_batches',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  ProductBatch.associate = (models) => {
    ProductBatch.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return ProductBatch;
};
