'use strict';

module.exports = (sequelize, DataTypes) => {
  const PosSetting = sequelize.define('PosSetting', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    payment_methods: {
      type: DataTypes.JSON,
      allowNull: true
    },
    receipt: {
      type: DataTypes.JSON,
      allowNull: true
    },
    discount_rules: {
      type: DataTypes.JSON,
      allowNull: true
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
    tableName: 'pos_settings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PosSetting.associate = (models) => {
    PosSetting.belongsTo(models.BackendUser, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    PosSetting.belongsTo(models.BackendUser, {
      foreignKey: 'updated_by',
      as: 'updater'
    });
  };

  return PosSetting;
};
