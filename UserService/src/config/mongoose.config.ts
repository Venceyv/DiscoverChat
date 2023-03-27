import mongoose from 'mongoose';
import logger from './logger.config';
import vars from './vars.config';

function mongoInit(): Promise<void> {
  return new Promise((resolve, reject) =>
    mongoose
      .connect(vars.mongoUrl)
      .then(() => {
        logger.info('MongoDB connection established.');
        resolve();
      })
      .catch((err) => {
        logger.error(`MongoDB connection error: \n${err}`);
        reject();
      })
  );
}

export default mongoInit;
