'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create hr_payrolls Table
    await queryInterface.createTable('hr_payrolls', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'backend_users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      month: {
        type: Sequelize.STRING(7),
        allowNull: false,
      },
      leave_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      work_hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 160,
      },
      advance_pay: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      net_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM('Paid', 'Unpaid', 'Pending'),
        allowNull: false,
        defaultValue: 'Unpaid',
      },
      paid_at: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    }, {
      engine: 'InnoDB',
    });

    // 2. Create hr_advance_requests Table
    await queryInterface.createTable('hr_advance_requests', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'backend_users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      request_date: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Approved', 'Pending', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    }, {
      engine: 'InnoDB',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('hr_advance_requests');
    await queryInterface.dropTable('hr_payrolls');
  }
};
