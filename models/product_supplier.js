'use strict';

module.exports = (sequelize, DataTypes) => {
  const ProductSupplier = sequelize.define('ProductSupplier', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    supplier_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    supplier_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'product_suppliers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  ProductSupplier.associate = (models) => {
    ProductSupplier.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });

    ProductSupplier.belongsTo(models.Supplier, {
      foreignKey: 'supplier_id',
      as: 'supplier'
    });
  };

  return ProductSupplier;
};
