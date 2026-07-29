module.exports = (sequelize, DataTypes) => {
  const HRPayroll = sequelize.define('HRPayroll', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
    month: { type: DataTypes.STRING(7), allowNull: false },
    leaveCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'leave_count' },
    workHours: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 160, field: 'work_hours' },
    advancePay: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0, field: 'advance_pay' },
    netSalary: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'net_salary' },
    paymentStatus: { type: DataTypes.ENUM('Paid', 'Unpaid', 'Pending'), defaultValue: 'Unpaid', field: 'payment_status' },
    paidAt: { type: DataTypes.STRING, allowNull: true, field: 'paid_at' }
  }, {
    tableName: 'hr_payrolls',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  HRPayroll.associate = (models) => {
    HRPayroll.belongsTo(models.BackendUser, { foreignKey: 'userId', as: 'user' });
  };

  return HRPayroll;
};
