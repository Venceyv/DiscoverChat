import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || '';

function mongoInit(): Promise<void> {
  return new Promise((resolve, reject) =>
    mongoose
      .connect(MONGODB_URL)
      .then(() => {
        console.log('MongoDB connection established.');
        resolve();
      })
      .catch((err) => {
        console.log(`MongoDB connection error: ${err}`);
        reject();
        process.exit();
      })
  );
}

export default mongoInit;
