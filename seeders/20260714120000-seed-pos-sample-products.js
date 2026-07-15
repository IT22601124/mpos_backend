'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.sequelize.query(
      `
      INSERT INTO categories (name, description, status, created_at, updated_at)
      VALUES
        ('Grocery', 'Daily grocery and packaged goods', 1, :now, :now),
        ('Beverages', 'Soft drinks, juices, and bottled beverages', 1, :now, :now),
        ('Bakery', 'Bread, buns, and bakery items', 1, :now, :now)
      ON DUPLICATE KEY UPDATE
        description = VALUES(description),
        status = VALUES(status),
        updated_at = VALUES(updated_at)
      `,
      { replacements: { now } }
    );

    await queryInterface.sequelize.query(
      `
      INSERT INTO brands (name, description, status, created_at, updated_at)
      VALUES
        ('FreshMart', 'FreshMart house brand', 1, :now, :now),
        ('CoolSip', 'CoolSip beverage products', 1, :now, :now),
        ('BakeHouse', 'BakeHouse bakery products', 1, :now, :now)
      ON DUPLICATE KEY UPDATE
        description = VALUES(description),
        status = VALUES(status),
        updated_at = VALUES(updated_at)
      `,
      { replacements: { now } }
    );

    await queryInterface.sequelize.query(
      `
      INSERT INTO units (name, short_name, status, created_at, updated_at)
      VALUES
        ('Piece', 'pcs', 1, :now, :now),
        ('Bottle', 'btl', 1, :now, :now),
        ('Pack', 'pkt', 1, :now, :now)
      ON DUPLICATE KEY UPDATE
        short_name = VALUES(short_name),
        status = VALUES(status),
        updated_at = VALUES(updated_at)
      `,
      { replacements: { now } }
    );

    await queryInterface.sequelize.query(
      `
      INSERT INTO products (
        product_code,
        barcode,
        name,
        description,
        category_id,
        brand_id,
        unit_id,
        cost_price,
        selling_price,
        wholesale_price,
        stock_quantity,
        minimum_stock,
        tax_rate,
        discount_rate,
        image,
        weight,
        is_weighted,
        status,
        created_by,
        created_at,
        updated_at
      )
      SELECT
        product_code,
        barcode,
        product_name,
        product_description,
        category_id,
        brand_id,
        unit_id,
        cost_price,
        selling_price,
        wholesale_price,
        stock_quantity,
        minimum_stock,
        tax_rate,
        discount_rate,
        NULL,
        weight,
        is_weighted,
        1,
        NULL,
        :now,
        :now
      FROM (
        SELECT
          'PRD-001' AS product_code,
          '4791000000011' AS barcode,
          'FreshMart Rice 5kg' AS product_name,
          'Premium white rice pack' AS product_description,
          (SELECT id FROM categories WHERE name = 'Grocery' LIMIT 1) AS category_id,
          (SELECT id FROM brands WHERE name = 'FreshMart' LIMIT 1) AS brand_id,
          (SELECT id FROM units WHERE short_name = 'pkt' LIMIT 1) AS unit_id,
          1800.00 AS cost_price,
          2150.00 AS selling_price,
          2050.00 AS wholesale_price,
          40.000 AS stock_quantity,
          5.000 AS minimum_stock,
          0.00 AS tax_rate,
          0.00 AS discount_rate,
          5.000 AS weight,
          0 AS is_weighted
        UNION ALL
        SELECT
          'PRD-002',
          '4791000000028',
          'CoolSip Orange Drink 1L',
          'Orange flavored bottled drink',
          (SELECT id FROM categories WHERE name = 'Beverages' LIMIT 1),
          (SELECT id FROM brands WHERE name = 'CoolSip' LIMIT 1),
          (SELECT id FROM units WHERE short_name = 'btl' LIMIT 1),
          220.00,
          300.00,
          280.00,
          75.000,
          10.000,
          0.00,
          0.00,
          1.000,
          0
        UNION ALL
        SELECT
          'PRD-003',
          '4791000000035',
          'BakeHouse Sandwich Bread',
          'Fresh sliced sandwich bread',
          (SELECT id FROM categories WHERE name = 'Bakery' LIMIT 1),
          (SELECT id FROM brands WHERE name = 'BakeHouse' LIMIT 1),
          (SELECT id FROM units WHERE short_name = 'pcs' LIMIT 1),
          260.00,
          380.00,
          350.00,
          30.000,
          6.000,
          0.00,
          0.00,
          0.450,
          0
      ) AS sample_products
      ON DUPLICATE KEY UPDATE
        barcode = VALUES(barcode),
        name = VALUES(name),
        description = VALUES(description),
        category_id = VALUES(category_id),
        brand_id = VALUES(brand_id),
        unit_id = VALUES(unit_id),
        cost_price = VALUES(cost_price),
        selling_price = VALUES(selling_price),
        wholesale_price = VALUES(wholesale_price),
        stock_quantity = VALUES(stock_quantity),
        minimum_stock = VALUES(minimum_stock),
        tax_rate = VALUES(tax_rate),
        discount_rate = VALUES(discount_rate),
        weight = VALUES(weight),
        is_weighted = VALUES(is_weighted),
        status = VALUES(status),
        updated_at = VALUES(updated_at)
      `,
      { replacements: { now } }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', {
      product_code: ['PRD-001', 'PRD-002', 'PRD-003']
    });

    await queryInterface.bulkDelete('categories', {
      name: ['Grocery', 'Beverages', 'Bakery']
    });

    await queryInterface.bulkDelete('brands', {
      name: ['FreshMart', 'CoolSip', 'BakeHouse']
    });

    await queryInterface.bulkDelete('units', {
      short_name: ['pcs', 'btl', 'pkt']
    });
  }
};
