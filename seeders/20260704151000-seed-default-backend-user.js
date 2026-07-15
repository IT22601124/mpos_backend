'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('password', 10);

    await queryInterface.sequelize.query(
      `
      INSERT INTO roles (id, name, created_at, updated_at)
      VALUES (1, 'Admin', :now, :now)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        updated_at = VALUES(updated_at)
      `,
      { replacements: { now } }
    );

    await queryInterface.sequelize.query(
      `
      INSERT INTO branches (id, name, created_at, updated_at)
      VALUES (1, 'Main Branch', :now, :now)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        updated_at = VALUES(updated_at)
      `,
      { replacements: { now } }
    );

    await queryInterface.sequelize.query(
      `
      INSERT INTO backend_users (
        name,
        email,
        phone,
        password_hash,
        role_id,
        branch_id,
        status,
        created_at,
        updated_at
      )
      VALUES (
        'tahrindu',
        'tahrindu@mpos.local',
        '0787450360',
        :passwordHash,
        1,
        1,
        'active',
        :now,
        :now
      )
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        phone = VALUES(phone),
        password_hash = VALUES(password_hash),
        role_id = VALUES(role_id),
        branch_id = VALUES(branch_id),
        status = VALUES(status),
        updated_at = VALUES(updated_at)
      `,
      { replacements: { passwordHash, now } }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('backend_users', {
      email: 'tahrindu@mpos.local'
    });
  }
};
