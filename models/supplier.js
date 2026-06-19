'use strict';

module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'suppliers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Supplier.associate = (models) => {
    Supplier.belongsToMany(models.Product, {
      through: models.ProductSupplier,
      foreignKey: 'supplier_id',
      otherKey: 'product_id',
      as: 'products'
    });

    Supplier.hasMany(models.ProductSupplier, {
      foreignKey: 'supplier_id',
      as: 'product_suppliers'
    });
  };

  return Supplier;
};
