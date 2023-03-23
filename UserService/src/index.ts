import app from './app';
import dotenv from 'dotenv';
import http from 'http';
import mongoInit from './config/mongoose';
import vars from './config/vars';
import mongoose from 'mongoose';
import logger from './config/logger';

dotenv.config();

let server: http.Server;

mongoInit().then(() => {
  serverInit()
    .then(() => {
      logger.info('Server is running...');
    })
    .catch((err) => {
      exitErrorHandler(err);
    });
});

process.on('uncaughtException', exitErrorHandler);
process.on('unhandledRejection', exitErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close();
  mongoose.connection.close();
  process.exit(1);
});

function serverInit(): Promise<void> {
  return new Promise((resolve, reject) => {
    server = app.listen(vars.serverPort, () => {
      logger.info(`Listening on port: ${vars.serverPort}`);
    });
    server ? resolve() : reject();
  });
}

function exitErrorHandler(error?: Error) {
  logger.error(error);
  if (server) {
    server.close((err) => {
      logger.error(err);
    });
  }

  mongoose.connection.close();
  process.exit(1);
}
