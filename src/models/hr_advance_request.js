module.exports = (sequelize, DataTypes) => {
  const HRAdvanceRequest = sequelize.define('HRAdvanceRequest', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    requestDate: { type: DataTypes.STRING(50), allowNull: false, field: 'request_date' },
    status: { type: DataTypes.ENUM('Approved', 'Pending', 'Rejected'), defaultValue: 'Pending' },
    reason: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'hr_advance_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  HRAdvanceRequest.associate = (models) => {
    HRAdvanceRequest.belongsTo(models.BackendUser, { foreignKey: 'userId', as: 'user' });
  };

  return HRAdvanceRequest;
};
