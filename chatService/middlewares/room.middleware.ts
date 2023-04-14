import { redisRoom } from "../configs/redis.config";
import { RoomMessage, Room, RoomMember } from "../models/index.model";
import { isFriends } from "../services/friendList.service";
import { makeKey } from "../services/userKey.service";
import { Request, Response, NextFunction } from "express";
import { APIError, errorHandler } from "./error.middleware";
/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-21 16:37:52
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 06:41:17
 * @FilePath: \discoverChat\middlewares\room.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEche
 */
export const checkRoomExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      const error = new APIError(404,"roomService:chat room does not exist");
      throw error;
    }
    req.body.room = room;
    return next();
  } catch (error) {
    errorHandler(error,req,res,next);
  }
};
export const checkIfInTheRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.requester;
    const roomId = req.params.roomId;
    const key = makeKey(userId, roomId);
    const exist = await redisRoom.exists(key);
    if (exist) return next();
    else {
      const dbBack = await RoomMember.findOne({ user: userId, roomId: roomId });
      if (dbBack) return next();
      const error = new APIError(401,"roomService:user not in the chat room");
      throw error;
    }
  } catch (error) {
    errorHandler(error,req,res,next);
  }
};
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await RoomMessage.findById(req.params.messageId);
    if (!message) {
      res.status(404);
      throw "roomService:message does not exist";
    } else if (message.sender == req.body.requester) {
      req.body.message = message;
      return next();
    } else {
      const error = new APIError(401,"roomService:user is not the sender");
      throw error
    }
  } catch (error) {
    errorHandler(error,req,res,next);
  }
};
export const checkIfFriends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await isFriends(req.body.requester, req.params.userId);
    if (record) {
      res.status(404);
      throw "roomService:You guys are friend already!";
    }
    return next();
  } catch (error) {
  }
};
