'use strict';

module.exports = (sequelize, DataTypes) => {
  const StoreProfile = sequelize.define('StoreProfile', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    store_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    legal_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    address_line1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address_line2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    tax_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    currency_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'LKR'
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    receipt_footer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'store_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  StoreProfile.associate = (models) => {
    StoreProfile.belongsTo(models.BackendUser, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    StoreProfile.belongsTo(models.BackendUser, {
      foreignKey: 'updated_by',
      as: 'updater'
    });
  };

  return StoreProfile;
};
