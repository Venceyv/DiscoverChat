/*
 * @Author: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @Date: 2023-04-06 17:52:52
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 13:58:54
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
import { UserMap } from "../services/userMap";

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
    const sender = req.query.sender;
    let Msender;
    if(sender) {
      Msender = UserMap.get(sender as string);
    }
    const msg = roomMessageSchema.parse({ content: req.body.message, sender: sender?Msender:requesterId, room: roomId });
    const friendMsg = roomMessageSchema.parse({ content: req.body.message, sender: sender?Msender:requesterId, room: friendRoomId });
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
=======
 * @Date: 2023-03-19 07:26:08
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 02:27:00
 * @FilePath: \discoverChat\controllers\chat.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { redisRoom } from "../configs/redis.config";
import { RoomMessage, Room, RoomMember } from "../models/index.model";
import { deleteFromFriendList, saveToFriendList } from "../services/friendList.service";
import { removeFromList, retriveMessage, saveMessage, updateToList } from "../services/roomQueue.service";
import { makeKey } from "../services/userKey.service";
import { Request,Response } from "express";
import { messageContent, roomSchema } from "../validators/roomSchema.validator";
import { roomMemberSchema } from "../validators/roomMember.validator";
import { roomMessageSchema } from "../validators/roomMessage.validator";
import { roomLogger } from "../configs/logger.config";
class Welcome{
    content:String;
    timeStamp:Date;
    constructor(message:String,date:Date){
        this.content = message;
        this.timeStamp = date;
    }
}

export const newRoom = async (req:Request, res:Response) => {
  try {
    const room = roomSchema.parse(req.body);
    const newRoom = await new Room(room).save();
    const user1 = req.body.requester;
    const user2 = req.params.userId;
    const roomMember = [ user1,user2];
    const welcomeWord = "welcome to room " + newRoom.name;
    const time = newRoom.lastActivity;
    await Promise.all(
      roomMember.map((member) => {
        const key = makeKey(member, newRoom._id.toString());
        const roomMember = roomMemberSchema.parse({ user: member, room: newRoom._id });
        new RoomMember(roomMember).save();
        let welcome = new Welcome(welcomeWord,time);
        saveMessage(key, welcome);
      })
    );
    await Promise.all([
      saveToFriendList(user1,user2),
      saveToFriendList(user2,user1)
    ])
    return res.status(200).json({ newRoom });
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
export const sentToRoom = async (req:Request, res:Response)  => {
  try {
    const roomId = req.params.roomId;
    const userId = req.body.requester;
    const msg = roomMessageSchema.parse({ content: req.body.content, sender: userId, room: roomId });
    const [dbBack, roomMember] = await Promise.all([new RoomMessage(msg).save(), RoomMember.find({ room: roomId })]);
    await Room.findByIdAndUpdate(roomId,{lastActivity:dbBack.timeStamp});
    await Promise.all(
      roomMember.map(async (member) => {
        const uid = member.user;
        const key = makeKey(uid, roomId);
        await saveMessage(key, dbBack);
      })
    );
    return res.status(200).json(dbBack);
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
export const getRoomMessage = async (req:Request, res:Response)  => {
  try {
    const roomId = req.params.roomId;
    const userId = req.body.requester;
    const key = makeKey(userId, roomId);
    let messages;
    messages = await retriveMessage(key);
    messages!.forEach((message, index, messages) => {
      messages[index] = JSON.parse(message);
    });
    return res.status(200).json({ messages });
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
export const recallRoomMessage = async (req:Request, res:Response)  => {
  try {
    const roomId = req.params.roomId;
    const messageId = req.params.messageId;
    const roomMember = await RoomMember.find({ room: roomId });
    await Promise.all(
      roomMember.map(async (member) => {
        const key = makeKey(member.user, roomId);
        await removeFromList(key, req.body.message);
      })
    );
    await RoomMessage.findByIdAndDelete(messageId);
    res.status(200).json("recall successfully");
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
export const editRoomMessage = async (req:Request, res:Response)  => {
  try {
    const roomId = req.params.roomId;
    const messageId = req.params.messageId;
    const content = messageContent.parse(req.body.content);
    const [roomMember, message] = await Promise.all([
      RoomMember.find({ room: roomId }),
      RoomMessage.findByIdAndUpdate(messageId, { content: req.body.content }),
    ]);
    await Promise.all(
      roomMember.map(async (member) => {
        const key = makeKey(member.user, roomId);
        await updateToList(key, message, content);
      })
    );
    res.status(200).json("update successfully");
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
export const deleteRoom = async (req:Request, res:Response) => {
  try {
    const roomId = req.params.roomId;
    const roomMember = await RoomMember.find({ room: roomId }).lean();
    await Promise.all(
      roomMember.map((member) => {
        if(member!=req.body.requester){
          deleteFromFriendList(req.body.requester,member.user);
          deleteFromFriendList(member.user,req.body.requester);
        }
        const key = makeKey(member.user, roomId);
        redisRoom.del(key);
      })
    );
    await Promise.all([
      Room.findByIdAndDelete(roomId),
      RoomMember.deleteMany({ room: roomId }),
      RoomMessage.deleteMany({ room: roomId }),
    ]);
    return res.status(200).json("delete room successfully");
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  } catch (error) {
    roomLogger.error(error);
    res.json({ error: error });
  }
};
<<<<<<< HEAD
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
=======
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
