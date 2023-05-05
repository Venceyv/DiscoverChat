<<<<<<< HEAD
/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-05-03 03:12:28
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 16:55:06
 * @FilePath: \discoveryChat(V1)\controllers\chatGroup.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Group, GroupMember, GroupMessage } from "../models/index.model";
import { saveMessage } from "../services/groupQueue.service";
import { Request, Response } from "express";
import { groupMemberSchema } from "../validators/groupMember.validator";
import { groupMessageSchema } from "../validators/groupMessage.validator";
import { groupLogger } from "../configs/logger.config";
import vars from "../configs/vars.config";
import { APIError, errorHandler } from "../middlewares/error.middleware";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { groupData, user } from "../interfaces/data.Interface";

import {
  GetAddFriendToGroupJson,
  getCreateGroupJson,
  getFriendNotInGroupJson,
  getGroupPageJson,
  getGroupMemberListJson,
  getGroupMessageJson,
  getGroupMemberPageJson,
  getGroupMemberStatus,
  getFriendListJson,
} from "../services/group.service";
import { retriveFriendList } from "../services/friendList.service";
import { getUserData } from "../services/chatMq.service";
import { GroupMemberPageJson } from "../interfaces/group.interface";
import { stringOperator } from "../services/stringOperator";
import { DiscoverPageJson } from "../interfaces/discover.interface";
import { getChatListPageJson, getUserChatList } from "../services/chatList.service";
import { ChatListContent } from "../interfaces/chat.interfaces";
import { UserMap } from "../services/userMap";

export const getMakeGroupPage = async (req: Request, res: Response) => {
  try {    
    const requesterId = req.body.user._id;
    const chatListApi = `../chatList`;
    const disCoverApi = `../discover/discoverPage`;
    const selfProfileAPI = `../user/${requesterId}`;
    const friendList = await retriveFriendList(requesterId);
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: requesterId,
      others: friendList as string[],
    };
    const friendListUserData = await getUserData(request);
    const friendListJson = getFriendListJson(friendListUserData as user[]);
    const createGroupPage: DiscoverPageJson = getCreateGroupJson(
      friendListJson,
      disCoverApi,
      chatListApi,
      selfProfileAPI
    );
    res.status(200).json(createGroupPage);
  } catch (error) {
    groupLogger.error(error);
  }
};

export const getFriendListToMakeGroup = async (req: Request, res: Response) => {
  try {
    const requester = req.body.user;
    const friendUIDS = await retriveFriendList(requester._id);
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: requester._id,
      others: friendUIDS as string[],
    };
    const friendList = await getUserData(request);
    const friendToAddGroupJson = GetAddFriendToGroupJson(friendList as user[]);
    return res.status(200).json(friendToAddGroupJson);
  } catch (error) {
    groupLogger.error(error);
  }
};

export const getGroupPage = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).lean();
    const chatListApi = `../chatList`;
    const groupMemberApi = `../group/memberPage/${group!._id.toString()}`;
    const groupMessageApi = `../group/message/${group!._id.toString()}`;
    const disCoverApi = `../discover/discoverPage`;
    const selfProfileAPI = `../user/${req.body.user._id}`;
    const groupChatJson = getGroupPageJson(
      chatListApi,
      group?.name as string,
      groupMemberApi,
      groupMessageApi,
      disCoverApi,
      selfProfileAPI,
      groupId
    );
    return res.status(200).json(groupChatJson);
  } catch (error) {
    groupLogger.error(error);
  }
};
export const newGroup = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user._id;
    const invitedUser = req.params.userId;
    const nameList = [userId, invitedUser];
    if (!userId || !invitedUser) {
      const error = new APIError(400, "bad request");
      return errorHandler(error, req, res);
    }
    const request: UserResourceRequestType = {
      resource: "users",
      fulFill: false,
      type: "notSearch",
      userId: userId,
      others: nameList,
    };
    const userList: user[] = (await getUserData(request)) as user[];
    let groupName: string = "";
    userList.map((user) => {
      groupName = groupName.concat(user.firstName + ",");
    });
    groupName = groupName.substring(0, groupName.length - 1);
    let group: groupData = {
      avatar:vars.group.picUrl,
      name: groupName
    };
    const newGroup = await new Group(group).save();
    await Promise.all(
      nameList.map(async (user: String) => {
        const groupMember = groupMemberSchema.parse({ user: user, group: newGroup._id.toString() });
        new GroupMember(groupMember).save();
      })
    );
    return res.status(200).json({
      metadata: {
          "version": "2.0"
      },
      elementFields: {
          accessoryButton: {
              title: "Invited"
          }
      }
  });
=======
import { redisGroup } from "../configs/redis.config";
import { Group, GroupMember, GroupMessage } from "../models/index.model";
import { removeFromList, retriveMessage, saveMessage, updateToList } from "../services/groupQueue.service";
import { makeKey } from "../services/userKey.service";
import { Request,Response } from "express";
import { groupSchema } from "../validators/groupSchema.validator";
import { groupMemberSchema } from "../validators/groupMember.validator";
import { groupMessageSchema, messageContent } from "../validators/groupMessage.validator";
import { groupLogger } from "../configs/logger.config";
class Welcome{
    content:String;
    timeStamp:Date;
    constructor(message:String,date:Date){
        this.content = message;
        this.timeStamp = date;
    }
}
interface Message{
    content:String,
    timeStamp:Date
}

export const newGroup = async (req:Request, res:Response) => {
  try {
    const nameList = req.body.nameList.split(",");
    delete req.body.nameList;
    nameList.push(req.body.requester);
    const group = groupSchema.parse(req.body);
    const newGroup = await new Group(group).save();
    const time = newGroup.lastActivity;
    const welcomeWord = "welcome to group "+newGroup.name;
    await Promise.all(
      nameList.map((user:String) => {
        const key = makeKey(user,newGroup._id.toString());
        const groupMember = groupMemberSchema.parse({ user: user, group: newGroup._id });
        new GroupMember(groupMember).save();
        const welcome = new Welcome(welcomeWord,time);
        saveMessage(key,welcome);
      })
    );
    return res.status(200).json(newGroup);
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
<<<<<<< HEAD

export const sentToGroup = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.user._id;
    const date = new Date();
    const timeNow = date.toISOString();
    const sender = req.query.sender;
    let Msender;
    if(sender) {
      Msender = UserMap.get(sender as string);
    }
    const msg = groupMessageSchema.parse({ content: req.body.message, sender: sender?Msender:userId, group: groupId });
    const [message] = await Promise.all([
      new GroupMessage(msg).save(),
      Group.findById(groupId),
      Group.findByIdAndUpdate(groupId, { lastActivity: timeNow }),
    ]);
    await saveMessage(groupId, message);
    return res.status(200).json(["message sent!"]);
=======
export const groupMember = async(req:Request, res:Response)=>{
  try {
    const users = await GroupMember.find({group:req.params.groupId},{user:1,_id:0}).lean();
    const dbBack:Array<String> = [];
    users.forEach((userId,index,userIds)=>{
      dbBack.push(userId.user);
    })
    return res.status(200).json({dbBack});
  } catch (error) {
    groupLogger.error(error);
    res.json({error:error});
  }
}
export const sentToGroup = async (req:Request, res:Response) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.requester;
    const msg = groupMessageSchema.parse({ content: req.body.content, sender: userId, group: groupId });
    const [dbBack, groupMember] = await Promise.all([new GroupMessage(msg).save(), GroupMember.find({ group: groupId })]);
    await Group.findByIdAndUpdate(groupId,{lastActivity:dbBack.timeStamp});
    await Promise.all(
      groupMember.map(async (member) => {
        const uid = member.user;
        const key = makeKey(uid, groupId);
        await saveMessage(key, dbBack);
      })
    );
    return res.status(200).json(dbBack);
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
export const getGroupMessage = async (req:Request, res:Response) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.requester;
    const key = makeKey(userId, groupId);
    let messages;
    messages = await retriveMessage(key);
    messages?.forEach((message, index, messages) => {
      messages[index] = JSON.parse(message);
    });
    return res.status(200).json({ messages });
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
export const recallGroupMessage = async (req:Request, res:Response)=> {
  try {
    const groupId = req.params.groupId;
    const messageId = req.params.messageId;
    const groupMember = await GroupMember.find({ group: groupId });
    await Promise.all(
      groupMember.map(async (member) => {
        const key = makeKey(member.user, groupId);
        await removeFromList(key, req.body.message);
      })
    );
    await GroupMessage.findByIdAndDelete(messageId);
    res.status(200).json("recall successfully");
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
export const editGroupMessage = async (req:Request, res:Response) => {
  try {
    const groupId = req.params.groupId;
    const messageId = req.params.messageId;
    const content = messageContent.parse(req.body.content);
    const [groupMember, message] = await Promise.all([
      GroupMember.find({ group: groupId }),
      GroupMessage.findByIdAndUpdate(messageId, { content: req.body.content }),
    ]);
    await Promise.all(
      groupMember.map(async (member) => {
        const key = makeKey(member.user, groupId);
        await updateToList(key, message, content);
      })
    );
    res.status(200).json("update successfully");
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
<<<<<<< HEAD
export const getGroupMessage = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.user._id;
    const groupChatJson = await getGroupMessageJson(groupId, userId);
    return res.status(200).json(groupChatJson);
=======
export const editGroup = async(req:Request, res:Response)=>{
  try {
    const group = groupSchema.parse(req.body);
    const dbBack = await Group.findByIdAndUpdate(req.params.groupId,group,{new:true});
    return res.status(200).json({dbBack});
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
<<<<<<< HEAD
};

//if in the same group

export const removeFromGroup = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const requester: user = req.body.user;
    const userId: string = req.params.userId;
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      userId: requester._id as string,
      fulFill: false,
      others: [userId],
    };
    const [group, user] = await Promise.all([
      Group.findById(groupId).lean(),
      getUserData(request),
      GroupMember.findOneAndDelete({ user: userId, group: groupId }),
    ]);
    const newGroupName = stringOperator(group?.name as string, (user as user[])[0].firstName, "remove");
    const [groupMemberStatus] = await Promise.all([
      getGroupMemberStatus(userId, groupId, requester._id as string),
      Group.findByIdAndUpdate(groupId, { name: newGroupName }),
    ]);
    return res.status(200).json(groupMemberStatus);
  } catch (error) {
    res.json({ error: error });
  }
};
export const inviteToGroup = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    const requester = req.body.user;
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      userId: requester._id,
      fulFill: false,
      others: [userId],
    };
    const [exist, group, user] = await Promise.all([
      GroupMember.findOne({ user: userId, group: groupId }).lean(),
      Group.findById(groupId).lean(),
      getUserData(request),
    ]);
    if (exist) {
      const error = new APIError(401, "user is already in the group!");
      throw error;
    }
    await Promise.all([
      new GroupMember({ user: userId, group: groupId }).save(),
      Group.findByIdAndUpdate(groupId, { name: group?.name + "," + (user as user[])[0].firstName }),
    ]);
    const groupMemberStatus = await getGroupMemberStatus(userId, groupId, requester._id as string);
    return res.status(200).json(groupMemberStatus);
  } catch (error) {
    errorHandler(error, req, res, null);
  }
};
export const leaveGroup = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.user._id.toString();
    await GroupMember.findOneAndDelete({ user: userId, group: groupId });
    const member = (await GroupMember.find({group:groupId}).lean());
    if(member.length==0) await Group.findByIdAndDelete(groupId);
    res.status(200).json({
      metadata: {
          "version": "2.0"
      },
      elementFields: {
          accessoryButton: {
              "title": "quitted",
          }
      }
  });
  } catch (error) {
    errorHandler(error, req, res, null);
  }
};
export const getLeaveGroup = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.user._id.toString();
    await GroupMember.findOneAndDelete({ user: userId, group: groupId });
    const member = (await GroupMember.find({group:groupId}).lean());
    if(member.length==0) await Group.findByIdAndDelete(groupId);
    const requester = req.body.user;
    const query = req.body.q;
    const friendListAddGroupApi = `../group/makeGroupPage`;
    const getDiscoverPageApi = `../discover/discoverPage`;
    const getSelfProfileApi = `../user/${requester._id}`;
    const getChatListPageApi = `../chatList`;
    let chats;
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
    errorHandler(error, req, res, null);
  }
};
export const getGroupMemberPage = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).lean();
    const getGroupPageApi = `../group/${groupId}`;
    const userId = req.body.user._id.toString();
    const users = await GroupMember.find({ group: groupId }, { user: 1, _id: 0 }).lean();
    let dbBack: Array<string> = [userId];
    const otherGroupMemberUid = users
      .filter((e) => e.user != userId)
      .map((userData) => {
        return userData.user;
      }) as string[];
    dbBack = dbBack.concat(otherGroupMemberUid);
    let request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: userId,
      others: dbBack,
    };
    const groupMember = await getUserData(request);
    const [friendUIDs, groupMembers] = await Promise.all([
      retriveFriendList(userId.toString()),
      GroupMember.find({ group: groupId }).lean(),
    ]);
    const groupMemberUIDs: string[] = groupMembers.map((member) => {
      return member.user;
    });
    const friendNotInGroupUIDs = friendUIDs?.filter((friendUID) => !groupMemberUIDs.includes(friendUID));
    request = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: userId,
      others: friendNotInGroupUIDs as string[],
    };
    const groupMemberListJson = getGroupMemberListJson(groupMember as user[], groupId, userId);
    const friendNotInGroup = await getUserData(request);
    const friendNotInGroupJson = getFriendNotInGroupJson(friendNotInGroup as user[], groupId);
    const groupMemberPageJson: GroupMemberPageJson = getGroupMemberPageJson(
      group?.name as string,
      getGroupPageApi,
      friendNotInGroupJson,
      groupMemberListJson
    );
    res.status(200).json(groupMemberPageJson);
  } catch (error) {
    groupLogger.error(error);
  }
};
=======
}
//if in the same group


export const removeFromGroup = async(req:Request, res:Response)=>{
  try {
    const groupId = req.params.groupId;
    const key = makeKey(req.params.userId,req.params.groupId);
    await Promise.all([
      GroupMember.findOneAndDelete({user:req.params.userId,group:req.params.groupId}),
      redisGroup.del(key)
    ]);
    const numberOfPeople = await Group.findById(groupId).lean();
    await Group.findByIdAndUpdate(req.params.groupId,{numberPeople:numberOfPeople!.numberPeople-1});
    return res.status(200).json('remove successfully');
  } catch (error) {
    res.json({ error: error });
  }
}
export const inviteToGroup = async(req:Request, res:Response)=>{
  try {
    const nameList = req.body.nameList.split(",");
    const groupId = req.params.groupId;
    delete req.body.nameList;
    const group = await Group.findByIdAndUpdate(req.params.groupId,{numberPeople:nameList.length},{new:true}).lean();
    const time = group?.lastActivity;
    const welcomeWord = "welcome to group "+group?.name;
    await Promise.all(
      nameList.map(async(userId:String) => {
        const key = makeKey(userId,groupId);
        const exist =  await redisGroup.exists(key);
        if(exist){
          res.status(401);
          throw 'user is already in the group';
        }
        new GroupMember({ user: userId, group: groupId }).save();
        let welcome = new Welcome(welcomeWord,time!);
        saveMessage(key,welcome);
      })
    );
    return res.status(200).json('add people successfully');
  } catch (error) {
    res.json({ error: error });
  }
}
export const leaveGroup = async(req:Request, res:Response)=>{
  try {
    const groupId = req.params.groupId;
    await GroupMember.findOneAndDelete({user:req.body.requester,group:groupId});
    const dbBack = await Group.findById(groupId).lean();
    const key = makeKey(req.body.requester,groupId);
    await Promise.all([
      Group.findByIdAndUpdate(req.params.groupId,{numberPeople:dbBack!.numberPeople-1}),
      redisGroup.del(key),
    ]);
    return res.status(200).json('leave group successfully');
  } catch (error) {
    res.json({ error: error });
  }
}
export const deleteGroup = async(req:Request, res:Response)=>{
  try {
    const groupId = req.params.groupId;
    const groupMember = await GroupMember.find({group:groupId});
    await Promise.all(groupMember.map( (member)=>{
      const key = makeKey(member.user,groupId);
      redisGroup.del(key);
    }));
    await Promise.all([
      Group.findByIdAndDelete(groupId),
      GroupMember.deleteMany({group:groupId}),
      GroupMessage.deleteMany({group:groupId}),
    ]);
    return res.status(200).json('delete group successfully');
  } catch (error) {
    res.json({ error: error });
  }
}
export const chatHistory = async(req:Request, res:Response)=>{
  try {
    const groupId = req.params.groupId;
    const userId = req.body.requester;
    const key = makeKey(userId,groupId);
    let messageList:Array<string>|undefined = await retriveMessage(key);
    const messages:Array<Message> = [];
    messageList?.map((message)=>{
        messages.push(JSON.parse(message));
      return message;
    });
    const firstMessage = messages?.at(1);
    if(!firstMessage)return res.status(200).json([]);
    const time = firstMessage?.timeStamp;
    const dbBack = await GroupMessage.find({group:groupId,timeStamp:{$lt:time}}).limit(20).sort({timeStamp:1}).lean();
    return res.status(200).json(dbBack);
  } catch (error) {
    res.json({ error: error });
  }
}
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
