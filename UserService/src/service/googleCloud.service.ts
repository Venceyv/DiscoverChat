import googleCloud from '../config/googleCloud.config';

function fileUpload(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = googleCloud.bucket.file(originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on('finish', () => {
        const url = `https://storage.googleapis.com/${googleCloud.bucket.name}/${blob.name}`;
        resolve(url);
      })
      .on('error', (err) => {
        reject(`Unable to upload image due to an error ${err}.`);
      })
      .end(buffer);
  });
}
export default { fileUpload };
