/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-25 18:57:46
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-12 23:36:19
 * @FilePath: \discoverChat\services\processIMG.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { bucket } from "../configs/googleCloud.config";
import stream from "stream";
import crypto from "crypto";
//upload file to google cloud
interface Message {
  content: String;
}
export const uploadB64File = function (base64Image: String) {
  try {
    const bufferStream = new stream.PassThrough();
    const imgString = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const fileName = crypto.randomUUID();
    bufferStream.end(Buffer.from(imgString, "base64"));
    const file = bucket.file(fileName);
    bufferStream
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: "image/jpeg",
          },
          validation: "md5",
        })
      )
      .on("error", function (err) {
        console.log(err);
        return null;
      })
      .on("finish", function () {
        console.log("success");
      });
    const head = "<img src=";
    const fileUrl = '"' + "https://storage.googleapis.com/brainleak/" + fileName + '"';
    const Tag = head + fileUrl + ">";
    return Tag;
  } catch (error) {
    console.log(error);
  }
};

export const ConvertB64Files = function (files: Array<String>) {
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  if(srcReg){
    files.forEach((file:String, index) => {
        let fileSrc = file?.match(srcReg)?.at(0)?.substring(4);
        fileSrc = fileSrc!.replace(/^\"|\"$/g, "");
        if (fileSrc!.includes("data:image")) {
          const fileURL = uploadB64File(fileSrc);
          if (fileURL) {
            files[index] = fileURL;
          }
        }
      });
  }
  return files;
};
export const processImg = function (Message: Message) {
  const imgReg = /<img.*?(?:>|\/>)/gi;
  const replacement = Message.content.match(imgReg);
  const images = Message.content.match(imgReg);
  if (replacement) {
    ConvertB64Files(replacement);
    images!.forEach((image, index) => {
      Message.content = Message.content.replace(image, replacement[index]);
    });
  }
  return Message;
};
export const uploadFile = function (req: any) {
  try {
    if (req.file) {
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();
      blobStream.on("finish", () => {
        console.log("success");
      });
      blobStream.end(req.file.buffer);
      const fileUrl = "https://storage.googleapis.com/discover_chat/" + req.file.originalname;
      return fileUrl;
    }
    return null;
  } catch (error) {
    console.log({ error: error });
  }
};
