import dotenv from 'dotenv';

dotenv.config();

export default {
  serverPort: parseInt(process.env.PORT || '3000'),
  mongoUrl: process.env.MONGODB_CONNECTION_URL || '',
};
