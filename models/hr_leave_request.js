module.exports = (sequelize, DataTypes) => {
  const HRLeaveRequest = sequelize.define('HRLeaveRequest', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    leaveType: { type: DataTypes.STRING, allowNull: false, field: 'leave_type' },
    startDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'start_date' },
    endDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'end_date' },
    status: { type: DataTypes.ENUM('Approved', 'Pending', 'Rejected'), defaultValue: 'Pending' },
    reason: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'hr_leave_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  HRLeaveRequest.associate = (models) => {
    HRLeaveRequest.belongsTo(models.BackendUser, { foreignKey: 'userId', as: 'user' });
  };

  return HRLeaveRequest;
};
