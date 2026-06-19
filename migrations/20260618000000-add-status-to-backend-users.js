'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('backend_users', 'status', {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
      after: 'access_token'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('backend_users', 'status');
  }
};
