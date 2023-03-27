import { Storage } from '@google-cloud/storage';
import vars from './vars.config';

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY,
  },
});
const bucket = storage.bucket(vars.googleCloud.bucketName);

export default { bucket };
