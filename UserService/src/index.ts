import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import mongoInit from './config/mongoose';
import vars from './config/vars';

dotenv.config();
const app = express();

let server: http.Server;

// mongoInit().then(() => {
//   serverInit()
//     .then((serv) => {
//       server = serv;
//       console.log('Server running...');
//     })
//     .catch(() => {
//       exitHandler();
//     });
// });

serverInit()
  .then(() => {
    console.log('Server running...');
  })
  .catch(() => {
    exitHandler();
  });

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  // logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
  process.exit(1);
});

function serverInit(): Promise<void> {
  return new Promise((resolve, reject) => {
    server = app.listen(vars.serverPort, () => {
      console.log(`Listening on port: ${vars.serverPort}`);
    });
    server ? resolve() : reject();
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
