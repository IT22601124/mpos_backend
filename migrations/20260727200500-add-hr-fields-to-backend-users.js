'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('backend_users', 'designation', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('backend_users', 'department', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('backend_users', 'salary', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('backend_users', 'shift', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('backend_users', 'emergency_contact', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('backend_users', 'arrival_time', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('backend_users', 'leave_time', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('backend_users', 'salary_paid', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('backend_users', 'salary_paid');
    await queryInterface.removeColumn('backend_users', 'leave_time');
    await queryInterface.removeColumn('backend_users', 'arrival_time');
    await queryInterface.removeColumn('backend_users', 'emergency_contact');
    await queryInterface.removeColumn('backend_users', 'shift');
    await queryInterface.removeColumn('backend_users', 'salary');
    await queryInterface.removeColumn('backend_users', 'department');
    await queryInterface.removeColumn('backend_users', 'designation');
  }
};
