/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-26 01:34:27
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 00:45:53
 * @FilePath: \discoveryChat(V1)\services\jwt.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { globalLogger } from "../configs/logger.config";
import { NextFunction, Response, Request } from "express";
import { APIError, errorHandler } from "../middlewares/error.middleware";
import DeviceDetector from "node-device-detector";

const STATIC_TEST_USERS = {
  yafking: {
    _id: "64489c677c6a8b213d7a0c5e",
    email: "yafking@gmail.com",
    firstName: "Mingkuan",
    lastName: "Liu",
    birthday: null,
    profilePic:
      "https://thumbs.dreamstime.com/b/male-avatar-icon-flat-style-male-user-icon-cartoon-man-avatar-hipster-vector-stock-91462914.jpg",
    majorList: [],
    description: "This is cheese description",
    gender: "male",
    isDeactivated: false,
    createdAt: "2023-04-26T03:37:11.622Z",
    updatedAt: "2023-04-26T03:37:11.622Z",
    __v: 0,
  },
  ming: {
    _id: "642142a53e303ea396af46e8",
    email: "steammingliu1@gmail.com",
    firstName: "Ming",
    lastName: "Liu",
    birthday: null,
    profilePic: "https://nextluxury.com/wp-content/uploads/funny-profile-pictures-2.jpg",
    majorList: ["Computer Science"],
    description: "Yoooo, is ya boi Ming",
    gender: "male",
    isDeactivated: false,
    createdAt: "2023-03-27T07:15:49.730Z",
    updatedAt: "2023-03-27T07:15:49.730Z",
    __v: 0,
  },
  dray: {
    _id: "64489caa7c6a8b213d7a0c60",
    email: "dray@gmail.com",
    firstName: "Yilong",
    lastName: "Wang",
    birthday: null,
    profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHlz5NiRstGSRBzdUP7uWuGuCnMM1o9lqWrQ&usqp=CAU",
    majorList: [],
    description: "This is cheese description",
    gender: "male",
    isDeactivated: false,
    createdAt: "2023-04-26T03:38:18.992Z",
    updatedAt: "2023-04-26T03:38:18.992Z",
    __v: 0,
  },
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  /*
    !DEMO REMOVE
    */
  try {
    let userName: string | undefined = "yafking";
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const userAgent =
      "Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36";
    const result = detector.detect(userAgent);
    if (userName) {
      switch (userName) {
        case "yafking":
          req.body.user = STATIC_TEST_USERS.yafking;
          break;
        case "dray":
          req.body.user = STATIC_TEST_USERS.dray;
          break;
        case "ming":
          req.body.user = STATIC_TEST_USERS.ming;
          break;
        default:
          const error = new APIError(401, "invalid token");
          throw error;
      }
      return next();
    }
    const error = new APIError(401, "invalid token");
    throw error;
  } catch (error) {
    errorHandler(error, req, res, next);
    globalLogger.error(error);
  }
};

export default {
  verifyUser,
};
