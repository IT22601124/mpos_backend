'use strict';

module.exports = (sequelize, DataTypes) => {
  const PosRegisterSession = sequelize.define('PosRegisterSession', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    register_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    shift_no: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    opened_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    closed_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    opening_cash: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    closing_cash: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    expected_cash: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    cash_difference: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'open'
    },
    opened_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'pos_register_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PosRegisterSession.associate = (models) => {
    PosRegisterSession.belongsTo(models.BackendUser, {
      foreignKey: 'opened_by',
      as: 'opened_by_user'
    });

    PosRegisterSession.belongsTo(models.BackendUser, {
      foreignKey: 'closed_by',
      as: 'closed_by_user'
    });

    PosRegisterSession.hasMany(models.PosSale, {
      foreignKey: 'register_session_id',
      as: 'sales'
    });
  };

  return PosRegisterSession;
};
