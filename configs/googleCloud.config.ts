/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-25 18:53:19
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 05:26:28
 * @FilePath: \discoverChat\configs\googleCloud.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Storage } from "@google-cloud/storage";
import multer from "multer";
import vars from '../configs/vars.config';
const storage = new Storage({
  projectId: vars.googleCloud.projectId,
  credentials: {
    client_email: vars.googleCloud.email,
    private_key: vars.googleCloud.key,
  },
});
const bucketName = vars.googleCloud.bucketName;
const bucket = storage.bucket(bucketName);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export { bucket, upload };