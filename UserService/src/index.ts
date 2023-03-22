import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import mongoInit from './config/mongoose';

dotenv.config();
const app = express();

const port = process.env.PORT || 3001;

let server: http.Server;

mongoInit().then(() => {
  serverInit()
    .then((serv) => {
      server = serv;
      console.log('Server running...');
    })
    .catch(() => {
      exitHandler();
    });
});

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  // logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

function serverInit(): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
    resolve(server);
  });
}

function exitHandler() {
  if (server) {
    server.close(() => {
      // logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

function unexpectedErrorHandler(error: Error) {
  // logger.error(error);
  exitHandler();
}
