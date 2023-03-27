import dotenv from 'dotenv';

dotenv.config();

export default {
  serverPort: parseInt(process.env.PORT || '3000'),
  mongoUrl: process.env.MONGODB_CONNECTION_URL || '',
  nodeEnvironment: process.env.NODE_ENVIRONMENT,
  nodeMailer: {
    email: process.env.NODEMAILER_EMAIL || '',
    password: process.env.NODEMAILER_PASSWORD || '',
  },
  googleCloud: {
    bucketName: process.env.GCS_BUCKET_NAME || '',
    projectId: process.env.GCLOUD_PROJECT_ID || '',
    email: process.env.GCLOUD_CLIENT_EMAIL || '',
    key: process.env.GCLOUD_PRIVATE_KEY || '',
  },
  jwt: {
    key: process.env.SECRET_KEY || '',
  },
  domain: process.env.DOMAIN_URL || '',
};
