/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-06 17:52:52
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-02 22:27:01
 * @FilePath: \discoveryChat(V1)\controllers\chatRoom.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { RoomMessage } from "../models/index.model";
import { deleteFromFriendList, isFriends, saveToFriendList } from "../services/friendList.service";
import { saveMessage } from "../services/roomQueue.service";
import { Request, Response } from "express";
import { roomMessageSchema } from "../validators/roomMessage.validator";
import { roomLogger } from "../configs/logger.config";
import { redisRoom } from "../configs/redis.config";
import { makeKey } from "../services/userKey.service";
import { APIError, errorHandler } from "../middlewares/error.middleware";
import { getRoomMessageJson, getRoomPageJson } from "../services/room.service";
import vars from "../configs/vars.config";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { getUserData } from "../services/chatMq.service";
import { user } from "../interfaces/data.Interface";

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
    return res.status(200).json(["Add friend successfully!"]);
  } catch (error) {
    errorHandler(error, req, res, null);
  }
};
export const getRoomPage =async (req:Request,res:Response) => {
  try {
    const userId = req.params.userId;
    const requester = req.body.user;
    const chatListAPI = `../chatList/page`;
    const getRoomMessageAPI = `../room/${userId}`;
    const disCoverApI = `../discover/discoverPage`;
    const selfProfileAPI = `${vars.userServer.url}/${userId}`;
    const request:UserResourceRequestType={
      resource:"users",
      type:'notSearch',
      userId:requester._id,
      fulFill:false,
      others:[userId]
    }
    const friend = await getUserData(request);
    const friendData = (friend as user[])[0];
    const friendName = friendData.firstName +' '+friendData.lastName;
    const roomPageJson = getRoomPageJson(chatListAPI,friendName,getRoomMessageAPI,disCoverApI,selfProfileAPI,friendData._id as string);
    return res.status(200).json(roomPageJson);
  } catch (error) {
    roomLogger.error(error);
  }
}
export const sentToRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const requesterId = req.body.user._id;
    const roomId = makeKey(requesterId, userId);
    const msg = roomMessageSchema.parse({ content: req.query.message, sender: requesterId, room: roomId });
    const dbBack = await new RoomMessage(msg).save();
    await Promise.all([saveMessage(roomId, dbBack), saveMessage(userId + ":" + requesterId, dbBack)]);
    const chatListAPI = `../chatList/page`;
    const getRoomMessageAPI = `../room/${userId}`;
    const disCoverApI = `../discover/discoverPage`;
    const selfProfileAPI = `${vars.userServer.url}/${userId}`;
    const request:UserResourceRequestType={
      resource:"users",
      type:'notSearch',
      userId:requesterId,
      fulFill:false,
      others:[userId]
    }
    const friend = await getUserData(request);
    const friendData = (friend as user[])[0];
    const friendName = friendData.firstName +' '+friendData.lastName;
    const roomPageJson = getRoomPageJson(chatListAPI,friendName,getRoomMessageAPI,disCoverApI,selfProfileAPI,friendData._id as string);
    return res.status(200).json(roomPageJson);
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
    const roomMessageJson = await getRoomMessageJson(requesterId, userId);
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
    await Promise.all([
      deleteFromFriendList(requesterId, userId),
      deleteFromFriendList(userId, requesterId),
      redisRoom.del(requesterId + ":" + userId),
      redisRoom.del(userId + ":" + requesterId),
    ]);
    await RoomMessage.deleteMany({ room: roomId });
    return res.status(200).json(["delete friend successfully"]);
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
