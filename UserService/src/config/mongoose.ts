import mongoose from 'mongoose';
import vars from './vars';

function mongoInit(): Promise<void> {
  return new Promise((resolve, reject) =>
    mongoose
      .connect(vars.mongoUrl)
      .then(() => {
        // todo logger
        console.log('MongoDB connection established.');
        resolve();
      })
      .catch((err) => {
        // todo logger
        console.log(`MongoDB connection error: \n${err}`);
        reject();
      })
  );
}

export default mongoInit;
