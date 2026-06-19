'use strict';

module.exports = (sequelize, DataTypes) => {
  const PosSale = sequelize.define('PosSale', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    sale_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    customer_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    cashier_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    register_session_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    register_no: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    shift_no: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    discount_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    tax_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    grand_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    paid_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    balance_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('held', 'completed', 'voided', 'refunded'),
      allowNull: false,
      defaultValue: 'completed'
    },
    sold_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pos_sales',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PosSale.associate = (models) => {
    PosSale.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });

    PosSale.belongsTo(models.BackendUser, {
      foreignKey: 'cashier_id',
      as: 'cashier'
    });

    PosSale.belongsTo(models.PosRegisterSession, {
      foreignKey: 'register_session_id',
      as: 'register_session'
    });

    PosSale.hasMany(models.PosSaleItem, {
      foreignKey: 'sale_id',
      as: 'items'
    });

    PosSale.hasMany(models.PosSalePayment, {
      foreignKey: 'sale_id',
      as: 'payments'
    });
  };

  return PosSale;
};
