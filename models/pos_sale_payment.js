'use strict';

module.exports = (sequelize, DataTypes) => {
  const PosSalePayment = sequelize.define('PosSalePayment', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    sale_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM('cash', 'card', 'bank_transfer', 'credit', 'mobile', 'voucher', 'mixed'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    reference_no: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'pos_sale_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PosSalePayment.associate = (models) => {
    PosSalePayment.belongsTo(models.PosSale, {
      foreignKey: 'sale_id',
      as: 'sale'
    });
  };

  return PosSalePayment;
};
