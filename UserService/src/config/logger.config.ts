import winston from 'winston';
import vars from './vars.config';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    // level <= 'error' => 'error.log'
    new winston.transports.File({ filename: 'error.log', level: 'error' }),

    // level <= 'info' => 'combined.log'
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// log to console in development
if (vars.nodeEnvironment !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
