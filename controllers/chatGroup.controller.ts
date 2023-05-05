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
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};

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
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
export const getGroupMessage = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.user._id;
    const groupChatJson = await getGroupMessageJson(groupId, userId);
    return res.status(200).json(groupChatJson);
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
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
