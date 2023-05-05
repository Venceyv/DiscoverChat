import { redisFriendList, redisRoom } from "../configs/redis.config";
import { RoomMessage } from "../models/index.model";
import { isFriends } from "../services/friendList.service";
import { Request, Response, NextFunction } from "express";
import { APIError, errorHandler } from "./error.middleware";
import { makeKey } from "../services/userKey.service";
/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-21 16:37:52
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-28 17:26:49
 * @FilePath: \discoverChat\middlewares\room.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEche
 */


export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await RoomMessage.findById(req.params.messageId);
    if (!message) {
      const error = new APIError(404, "roomService:user not in the chat room");
      throw error;
    } else if (message.sender == req.body.user._id) {
      req.body.message = message;
      return next();
    } else {
      const error = new APIError(401, "roomService:user is not the sender");
      throw error;
    }
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};
export const checkIfFriends = async (req: Request, res: Response, next: NextFunction) => {
  try {    
    const record = await isFriends(req.body.user._id, req.params.userId);
    if (!record) {
      const error = new APIError(401, "roomService:you guys are not friend yet!");
      throw error;
    }
    return next();
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};
