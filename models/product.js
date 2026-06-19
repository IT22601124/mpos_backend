'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    product_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    brand_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    unit_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    wholesale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    stock_quantity: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0
    },
    minimum_stock: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      defaultValue: 0
    },
    tax_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    discount_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    weight: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true
    },
    is_weighted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });

    Product.belongsTo(models.Brand, {
      foreignKey: 'brand_id',
      as: 'brand'
    });

    Product.belongsTo(models.Unit, {
      foreignKey: 'unit_id',
      as: 'unit'
    });

    Product.belongsTo(models.BackendUser, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Product.belongsToMany(models.Supplier, {
      through: models.ProductSupplier,
      foreignKey: 'product_id',
      otherKey: 'supplier_id',
      as: 'suppliers'
    });

    Product.hasMany(models.ProductSupplier, {
      foreignKey: 'product_id',
      as: 'product_suppliers'
    });

    Product.hasMany(models.StockMovement, {
      foreignKey: 'product_id',
      as: 'stock_movements'
    });

    Product.hasMany(models.ProductBatch, {
      foreignKey: 'product_id',
      as: 'batches'
    });

    Product.hasMany(models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images'
    });

    Product.hasMany(models.ProductVariant, {
      foreignKey: 'product_id',
      as: 'variants'
    });
  };

  return Product;
};
