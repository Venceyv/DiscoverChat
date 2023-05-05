/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-06 17:52:38
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @LastEditTime: 2023-05-04 16:43:24
=======
 * @LastEditTime: 2023-04-13 17:33:18
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
 * @FilePath: \discoveryChat(ts)\controllers\chatList.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { chatListLogger } from "../configs/logger.config";
<<<<<<< HEAD
import { Request, Response } from "express";
import dotenv from "dotenv";
import { getChatListPageJson, getUserChatList } from "../services/chatList.service";
import { ChatListContent } from "../interfaces/chat.interfaces";
import { User } from "../models/index.model";
dotenv.config();
export const getChatList = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user._id;    
    let chats = (await getUserChatList(userId, "byTime"));
    return res.status(200).json(chats);
  } catch (error) {
    chatListLogger.error(error);
  }
};
export const searchChat = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user._id;
    const query = req.body.q;
    const chats = (await getUserChatList(userId, "bySearch", query as string));
    res.status(200).json(chats);
  } catch (error) {
    chatListLogger.error(error);
  }
};
export const ChatListPageJson = async (req: Request, res: Response) => {
  try {
    const requester = req.body.user;
    const query = req.body.q;
    const friendListAddGroupApi = `../group/makeGroupPage`;
    const getDiscoverPageApi = `../discover/discoverPage`;
    const getSelfProfileApi = `../user/${requester._id}`;
    const getChatListPageApi = `../chatList`;
    let chats;
    await new User({
      "email": "Erick@gmail.com",
      "firstName": "Eric",
      "lastName": "Yang",
      "gender": "male",
      "major": "Computer Science",
      "description": "Cheese description"
  }).save();
    if(query)
       chats = (await getUserChatList(requester._id, "bySearch", query as string));
    else chats = (await getUserChatList(requester._id, "byTime"));
    if(chats == undefined) chats= [] as ChatListContent[];
    const chatlistPageJson = getChatListPageJson(
      friendListAddGroupApi,
      chats as ChatListContent[],
      getDiscoverPageApi,
      getSelfProfileApi,
      getChatListPageApi
    );
    res.status(200).json(chatlistPageJson);
  } catch (error) {
    chatListLogger.error(error);
  }
};
=======
import { redisGroup, redisRoom } from "../configs/redis.config";
import {  GroupMember, RoomMember } from "../models/index.model"
import { createProducer } from "../services/chatMq.service";
import { makeKey } from "../services/userKey.service";
import { Request,Response } from "express";
interface Message{
    content:String;
    timeStamp:any;
}
class DiaLogue{
    type:String;
    id:String;
    lastMessage:Message|null;
    constructor(type:string,id:String,message:Message|null){
        this.type = type;
        this.id = id;
        this.lastMessage = message;
    }
}
export const getChatList = async (req:Request,res:Response)=>{
    try {
        const userId = req.body.requester;
        let [groupList,roomList] = await Promise.all([
            GroupMember.find({user:userId},{_id:0,user:0}).lean(),
            RoomMember.find({user:userId},{_id:0,user:0}).lean()
        ]);
        
        const groupDialogue: Array<DiaLogue> = [];
        const roomDialogue: Array<DiaLogue> = [];

        await Promise.all(groupList.map(async (data)=>{
            const key = makeKey(userId,data.group.toString());
            const message = await redisGroup.lindex(key,-1);
            const lastMessage:Message = JSON.parse(message!);
            const group = new DiaLogue('group',data.group,lastMessage);
            groupDialogue.push(group);
        }));
        await Promise.all(roomList.map(async (data)=>{
            const key = makeKey(userId,data.room.toString());
            const message = await redisRoom.lindex(key,-1);
            const lastMessage:Message = JSON.parse(message!);
            const room = new DiaLogue('room',data.room,lastMessage);
            roomDialogue.push(room);
        }));
        let dbBack = groupDialogue.concat(roomDialogue);
        dbBack.sort((a,b)=>{
            return Date.parse(b.lastMessage?.timeStamp)-Date.parse(a.lastMessage?.timeStamp);
        })
        return res.status(200).json(dbBack);
    } catch (error) {
        chatListLogger.error(error);
        res.json(error);
    }
}
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
