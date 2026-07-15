'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('store_profiles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      store_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      legal_name: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      address_line1: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      address_line2: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      tax_number: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      currency_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'LKR'
      },
      logo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      receipt_footer: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('store_profiles');
  }
};
