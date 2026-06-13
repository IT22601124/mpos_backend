import { getPool } from '../config/database.js';
import { mapUserRow, userTable } from '../models/userModel.js';

export const userRepository = {
  async findAll() {
    const [rows] = await getPool().query(
      `SELECT id, name, email, created_at, updated_at FROM ${userTable} ORDER BY created_at DESC`
    );

    return rows.map(mapUserRow);
  },

  async findById(id) {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      return null;
    }

    const [rows] = await getPool().execute(
      `SELECT id, name, email, created_at, updated_at FROM ${userTable} WHERE id = ? LIMIT 1`,
      [numericId]
    );

    return rows.length ? mapUserRow(rows[0]) : null;
  },

  async create(payload) {
    const [result] = await getPool().execute(
      `INSERT INTO ${userTable} (name, email) VALUES (?, ?)`,
      [payload.name, payload.email]
    );

    return this.findById(result.insertId);
  }
};
