'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.sequelize.query(
      `
      INSERT INTO store_profiles (
        id,
        store_name,
        legal_name,
        address_line1,
        address_line2,
        city,
        phone,
        email,
        tax_number,
        currency_code,
        logo,
        receipt_footer,
        status,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      VALUES (
        1,
        'MPOS Store',
        'MPOS Store',
        'No 01, Main Street',
        NULL,
        'Colombo',
        '0787450360',
        'store@mpos.local',
        NULL,
        'LKR',
        NULL,
        'Thank you. Come again.',
        1,
        NULL,
        NULL,
        :now,
        :now
      )
      ON DUPLICATE KEY UPDATE
        store_name = VALUES(store_name),
        legal_name = VALUES(legal_name),
        address_line1 = VALUES(address_line1),
        address_line2 = VALUES(address_line2),
        city = VALUES(city),
        phone = VALUES(phone),
        email = VALUES(email),
        tax_number = VALUES(tax_number),
        currency_code = VALUES(currency_code),
        logo = VALUES(logo),
        receipt_footer = VALUES(receipt_footer),
        status = VALUES(status),
        updated_at = VALUES(updated_at)
      `,
      { replacements: { now } }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('store_profiles', {
      id: 1
    });
  }
};
