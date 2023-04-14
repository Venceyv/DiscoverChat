import { redisGroup } from "../configs/redis.config";
import { Group, GroupMember, GroupMessage } from "../models/index.model";
import { makeKey } from "../services/userKey.service";
import { Request,Response,NextFunction } from "express";
import { APIError, errorHandler } from "./error.middleware";
/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-21 16:37:52
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 05:46:06
 * @FilePath: \discoverChat\middlewares\room.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEche
 */
export const checkGroupExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      const error = new APIError(404,'groupService:Group does not exist!');
      throw error;
    }
    return next();
  } catch (error) {
    errorHandler(error,req,res,next);
  }
};
export const checkIfInTheGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.requester;
    const groupId = req.params.groupId;
    const key = makeKey(userId, groupId);
    const exist = await redisGroup.exists(key);
    if (exist) return next();
    else {
      const dbBack = await GroupMember.findOne({ user: userId, group: groupId });
      if (dbBack) return next();
      const error = new APIError(401,"groupService:unauthorized");
      throw error;
    }
  } catch (error) {
    errorHandler(error,req,res,next);
  }
};
export const checkIfGroupOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.requester;
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (group) {
      if (group.groupOwner == userId) return next();
      else {
        const error = new APIError(401,"groupService:unauthorized");
        throw error;
      }
    } else {
      const error = new APIError(404,"groupService:user not found");
      throw error;
    }
  } catch (error) {
    errorHandler(error,req,res,next);
  }
};
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await GroupMessage.findById(req.params.messageId);
    if (!message) {
      const error = new APIError(404,"groupService:message does not exist");
      throw error;
    } else if (message.sender == req.body.requester) {
      req.body.message = message;
      return next();
    } else {
      const error = new APIError(401,"groupService:unauthorized");
      throw error;
    }
  } catch (error) {
    errorHandler(error,req,res,next);
  }
};
