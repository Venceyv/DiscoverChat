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
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
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
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
export const editGroup = async(req:Request, res:Response)=>{
  try {
    const group = groupSchema.parse(req.body);
    const dbBack = await Group.findByIdAndUpdate(req.params.groupId,group,{new:true});
    return res.status(200).json({dbBack});
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
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