import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

let server;

const startServer = async () => {
  await connectDatabase();

  server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};

const shutdown = async (signal) => {
  logger.info(`${signal} received. Closing server.`);

  const closeServer = () =>
    new Promise((resolve) => {
      if (!server) {
        resolve();
        return;
      }

      server.close(resolve);
    });

  try {
    await closeServer();
    await disconnectDatabase();
    logger.info('Server closed.');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', { message: error.message });
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  logger.error('Failed to start server', { message: error.message });
  process.exit(1);
});
