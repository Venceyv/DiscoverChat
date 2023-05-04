import { Request, Response } from "express";
import { globalLogger } from "../configs/logger.config";
import { addToList, inList, removeFromList } from "../services/blockList.service";
import { APIError, errorHandler } from "../middlewares/error.middleware";
import { UserProfileTypeWithID, userProfileInBlock, userProfileOther } from "../services/profile";
import { redisRoom } from "../configs/redis.config";
import { deleteFromFriendList, isFriends } from "../services/friendList.service";
import { RoomMessage } from "../models/index.model";
import { makeKey } from "../services/userKey.service";
import { getCurrentFriendStatus } from "../services/room.service";

/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-05-04 10:59:36
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 12:36:36
 * @FilePath: \discoveryChat(V1)\controllers\blockList.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const blockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const requesterId = req.body.user._id;
    const user = req.body.paramUser;
    const exist = await inList(requesterId, userId);
    if (exist) {
      const error = new APIError(401, "User is already in your blockList");
      throw error;
    }
    await addToList(requesterId, userId);
    const isFriend = await isFriends(requesterId, userId);

    if (isFriend) {
      const roomId = makeKey(requesterId, userId);
      const friendRoomId = makeKey(userId, requesterId);
      await Promise.all([
        deleteFromFriendList(requesterId, userId),
        deleteFromFriendList(userId, requesterId),
        redisRoom.del(requesterId + ":" + userId),
        redisRoom.del(userId + ":" + requesterId),
        RoomMessage.deleteMany({ room: roomId }),
        RoomMessage.deleteMany({ room: friendRoomId }),
      ]);
    }
    const data: UserProfileTypeWithID = {
      _id: user.id,
      userImageUrl: user.profilePic,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      major: user.majorList,
      birthday: user.birthday,
      description: user.description,
      isFriend: false, //! TODO: determine if is friend
      isBlock: true, //! TODO: determine if is blocked
    };
    return res.status(200).json(userProfileInBlock(data, requesterId));
  } catch (error) {
    errorHandler(error,req,res);
    globalLogger.error(error);
  }
};
export const unBlockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const requesterId = req.body.user._id;
    const user = req.body.paramUser;
    const exist = await inList(requesterId, userId);
    if (!exist) {
      const error = new APIError(401, "User is not in your blockList");
      throw error;
    }
    await removeFromList(requesterId, userId);
    const data: UserProfileTypeWithID = {
      _id: user.id,
      userImageUrl: user.profilePic,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      major: user.majorList,
      birthday: user.birthday,
      description: user.description,
      isFriend: false, 
      isBlock: false, 
    };
    return res.status(200).json(userProfileOther(data, requesterId));
  } catch (error) {
    errorHandler(error,req,res);
    globalLogger.error(error);
  }
};
export const removeFromBlockList = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const requesterId = req.body.user._id;
      const user = req.body.paramUser;
      const exist = await inList(requesterId, userId);
      if (!exist) {
        const error = new APIError(401, "User is not in your blockList");
        throw error;
      }
      await removeFromList(requesterId, userId);
      const friendStatus = await getCurrentFriendStatus(userId, requesterId);
      return res.status(200).json(friendStatus);
    } catch (error) {
      errorHandler(error,req,res);
      globalLogger.error(error);
    }
  };