import mysql from 'mysql2/promise';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let pool;

export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      ...env.db,
      waitForConnections: true,
      namedPlaceholders: true
    });
  }

  return pool;
};

export const connectDatabase = async () => {
  const connection = await getPool().getConnection();

  try {
    await connection.ping();
    logger.info('MySQL connected');
  } catch (error) {
    logger.error('MySQL connection failed', { message: error.message });
    throw error;
  } finally {
    connection.release();
  }
};

export const disconnectDatabase = async () => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};
