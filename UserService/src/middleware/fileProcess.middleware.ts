import multer from 'multer';

const fileProcess = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export default {
  fileProcess,
};
