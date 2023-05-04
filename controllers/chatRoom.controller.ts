/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-06 17:52:52
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 11:28:06
 * @FilePath: \discoveryChat(V1)\controllers\chatRoom.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { RoomMessage, User } from "../models/index.model";
import { deleteFromFriendList, isFriends, saveToFriendList } from "../services/friendList.service";
import { saveMessage } from "../services/roomQueue.service";
import { Request, Response } from "express";
import { roomMessageSchema } from "../validators/roomMessage.validator";
import { roomLogger } from "../configs/logger.config";
import { redisRoom } from "../configs/redis.config";
import { makeKey } from "../services/userKey.service";
import { APIError, errorHandler } from "../middlewares/error.middleware";
import { getCurrentFriendStatus, getRoomMessageJson, getRoomPageJson } from "../services/room.service";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { getUserData } from "../services/chatMq.service";
import { user } from "../interfaces/data.Interface";
import { UserProfileTypeWithID, userProfileNotFound, userProfileOther } from "../services/profile";

export const newRoom = async (req: Request, res: Response) => {
  try {
    const user1 = req.body.user._id;
    const user2 = req.params.userId;
    const record = await isFriends(user1, user2);
    if (record) {
      const error = new APIError(401, "you guys are friends already!");
      throw error;
    }
    await Promise.all([saveToFriendList(user1, user2), saveToFriendList(user2, user1)]);
    const friendStatus = await getCurrentFriendStatus(user2, user1);
    return res.status(200).json(friendStatus);
  } catch (error) {
    errorHandler(error, req, res, null);
  }
};
export const getRoomPage = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const requester = req.body.user;
    const chatListAPI = `../chatList`;
    const getRoomMessageAPI = `../room/message/${userId}`;
    const disCoverApI = `../discover/discoverPage`;
    const selfProfileAPI = `../user/${userId}`;
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      userId: requester._id,
      fulFill: false,
      others: [userId],
    };
    const friend = await getUserData(request);
    const friendData = (friend as user[])[0];
    const friendName = friendData.firstName + " " + friendData.lastName;
    const roomPageJson = getRoomPageJson(
      chatListAPI,
      friendName,
      getRoomMessageAPI,
      disCoverApI,
      selfProfileAPI,
      userId
    );

    return res.status(200).json(roomPageJson);
  } catch (error) {
    roomLogger.error(error);
  }
};
export const sentToRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const requesterId = req.body.user._id;
    const roomId = makeKey(requesterId, userId);
    const friendRoomId = makeKey(userId, requesterId);
    const msg = roomMessageSchema.parse({ content: req.body.message, sender: requesterId, room: roomId });
    const friendMsg = roomMessageSchema.parse({ content: req.body.message, sender: requesterId, room: friendRoomId });
    const [dbBack, frindDbBack] = await Promise.all([new RoomMessage(msg).save(), new RoomMessage(friendMsg).save()]);
    await Promise.all([saveMessage(roomId, dbBack), saveMessage(friendRoomId, frindDbBack)]);
    return res.status(200).json(["message sent!"]);
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
export const getRoomMessage = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const requester = req.body.user;
    const requesterId = requester._id;
    const roomMessageJson = await getRoomMessageJson(userId, requesterId);
    res.status(200).json(roomMessageJson);
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const requesterId = req.body.user._id;
    const userId = req.params.userId;
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
    const friendStatus = await getCurrentFriendStatus(userId, requesterId);
    return res.status(200).json(friendStatus);
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
export const getDeleteRoom = async (req: Request, res: Response) => {
  try {
    const requesterId = req.body.user._id;
    const userId = req.params.userId;
    const roomId = makeKey(requesterId, userId);
    const user = await User.findById(userId);
    if (!user) {
      res.json(userProfileNotFound());
      return;
    }
    await Promise.all([
      deleteFromFriendList(requesterId, userId),
      deleteFromFriendList(userId, requesterId),
      redisRoom.del(requesterId + ":" + userId),
      redisRoom.del(userId + ":" + requesterId),
    ]);
    await RoomMessage.deleteMany({ room: roomId });
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
      isBlock: false, //! TODO: determine if is blocked
    };
    return res.status(200).json(userProfileOther(data, requesterId));
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
export const getNewRoom = async (req: Request, res: Response) => {
  try {
    const user1 = req.body.user._id;
    const user2 = req.params.userId;
    const user = await User.findById(user2);
    if (!user) {
      res.json(userProfileNotFound());
      return;
    }
    const record = await isFriends(user1, user2);
    if (record) {
      const error = new APIError(401, "you guys are friends already!");
      throw error;
    }
    await Promise.all([saveToFriendList(user1, user2), saveToFriendList(user2, user1)]);
    const data: UserProfileTypeWithID = {
      _id: user.id,
      userImageUrl: user.profilePic,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      major: user.majorList,
      birthday: user.birthday,
      description: user.description,
      isFriend: true, //! TODO: determine if is friend
      isBlock: false, //! TODO: determine if is blocked
    };
    return res.status(200).json(userProfileOther(data, user1));
  } catch (error) {
    errorHandler(error, req, res, null);
  }
};
