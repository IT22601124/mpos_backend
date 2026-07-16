'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pos_settings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      payment_methods: {
        type: Sequelize.JSON,
        allowNull: true
      },
      receipt: {
        type: Sequelize.JSON,
        allowNull: true
      },
      discount_rules: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'backend_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'backend_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, { engine: 'InnoDB' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pos_settings');
  }
};
