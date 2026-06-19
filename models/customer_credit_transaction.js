'use strict';

module.exports = (sequelize, DataTypes) => {
  const CustomerCreditTransaction = sequelize.define('CustomerCreditTransaction', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('credit_sale', 'payment', 'adjustment'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    reference_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'customer_credit_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  CustomerCreditTransaction.associate = (models) => {
    CustomerCreditTransaction.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
  };

  return CustomerCreditTransaction;
};
