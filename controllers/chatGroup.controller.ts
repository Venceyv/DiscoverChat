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
  getFriendNotInGroupPageJson,
  getGroupMemberPageJson,
} from "../services/group.service";
import { retriveFriendList } from "../services/friendList.service";
import { getUserChatList } from "../services/chatList.service";
import { getUserData } from "../services/chatMq.service";
import { CreateGroupPage, FriendNotInGroupPageJson, GroupMemberPageJson } from "../interfaces/group.interface";

export const getMakeGroupPage = async (req: Request, res: Response) => {
  try {
    const chatListEP = `../chatList`;
    const friendListAPI = `../group/friendList`;
    const createGroupPage: CreateGroupPage = getCreateGroupJson(chatListEP, friendListAPI);
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
    const chatListApi = `../chatList/page`;
    const groupMemberApi = `../group/member/${group!._id.toString()}`;
    const groupMessageApi = `../group/message/${group!._id.toString()}`;
    const disCoverApi = `../discover/discoverPage`;
    const selfProfileAPI = `${vars.userServer.url}/${req.body.user._id}`;
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
      name: groupName,
    };
    const newGroup = await new Group(group).save();
    await Promise.all(
      nameList.map(async (user: String) => {
        const groupMember = groupMemberSchema.parse({ user: user, group: newGroup._id.toString() });
        new GroupMember(groupMember).save();
      })
    );
    const chatListApi = `../chatList/page`;
    const groupMemberApi = `../group/member/${newGroup._id.toString()}`;
    const groupMessageApi = `../group/message/${newGroup._id.toString()}`;
    const disCoverApi = `../discover/discoverPage`;
    const selfProfileAPI = `${vars.userServer.url}/${req.body.user._id}`;
    const groupChatJson = getGroupPageJson(
      chatListApi,
      groupName,
      groupMemberApi,
      groupMessageApi,
      disCoverApi,
      selfProfileAPI,
      newGroup._id.toString()
    );
    return res.status(200).json(groupChatJson);
  } catch (error) {
    groupLogger.error(error);
    res.json({ error: error });
  }
};
export const groupMember = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user._id.toString();
    const groupId = req.params.groupId;
    const users = await GroupMember.find({ group: groupId }, { user: 1, _id: 0 }).lean();
    let dbBack: Array<string> = [userId];
    const otherGroupMemberUid = users
      .filter((e) => e.user != userId)
      .map((userData) => {
        return userData.user;
      }) as string[];
    dbBack = dbBack.concat(otherGroupMemberUid);
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: userId,
      others: dbBack,
    };
    const groupMember = await getUserData(request);
    const groupMemberListJson = getGroupMemberListJson(groupMember as user[], groupId);
    return res.status(200).json(groupMemberListJson);
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
    const msg = groupMessageSchema.parse({ content: req.query.message, sender: userId, group: groupId });
    const [message, group] = await Promise.all([
      new GroupMessage(msg).save(),
      Group.findById(groupId),
      Group.findByIdAndUpdate(groupId, { lastActivity: timeNow }),
    ]);
    const chatListApi = `../chatList/page`;
    const disCoverApi = `../discover/discoverPage`;
    const groupMemberApi = `../group/member/${group!._id.toString()}`;
    const groupMessageApi = `../group/message/${group!._id.toString()}`;
    const selfProfileAPI = `${vars.userServer.url}/${req.body.user._id}`;
    await saveMessage(groupId, message);
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
    const requesterId = requester._id?.toString();
    await GroupMember.findOneAndDelete({ user: userId, group: groupId });
    const groupMemberDbBack = await GroupMember.find({ group: groupId }).lean();
    let groupMember: Array<string> = [requesterId as string];
    const otherGroupMemberUid = groupMemberDbBack
      .filter((e) => e.user != requesterId)
      .map((userData) => {
        return userData.user;
      }) as string[];
    groupMember = groupMember.concat(otherGroupMemberUid);
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: requesterId as string,
      others: groupMember,
    };
    const updatedGroupMember: user[] = (await getUserData(request)) as user[];
    const groupMemberListJson = getGroupMemberListJson(updatedGroupMember, groupId);
    return res.status(200).json(groupMemberListJson);
  } catch (error) {
    res.json({ error: error });
  }
};
export const inviteToGroup = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    const requester = req.body.user;
    delete req.body.nameList;
    const exist = await GroupMember.findOne({ user: userId, group: groupId }).lean();
    if (exist) {
      const error = new APIError(401, "user is already in the group!");
      throw error;
    }
    await new GroupMember({ user: userId, group: groupId }).save();
    const [friendUIDs, groupMember] = await Promise.all([
      retriveFriendList(requester._id.toString()),
      GroupMember.find({ group: groupId }).lean(),
    ]);
    const groupMemberUIDs = groupMember.map((e) => e.user);
    const friendUIDsNotInGroup: string[] = friendUIDs?.filter(
      (friendUID) => !groupMemberUIDs.includes(friendUID)
    ) as string[];
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: requester._id.toString(),
      others: friendUIDsNotInGroup,
    };
    const friendNotInGroup = await getUserData(request);
    const friendNotInGroupJson = getFriendNotInGroupJson(friendNotInGroup as user[], groupId);
    return res.status(200).json(friendNotInGroupJson);
  } catch (error) {
    errorHandler(error, req, res, null);
  }
};
export const leaveGroup = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.user._id.toString();
    await GroupMember.findOneAndDelete({ user: req.body.requester, group: groupId });
    const chatListJson = await getUserChatList(userId, "byTime", null);
    return res.status(200).json(chatListJson);
  } catch (error) {
    errorHandler(error, req, res, null);
  }
};

export const getFriendNotInGroup = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const requester = req.body.user;
    const [friendUIDs, groupMembers] = await Promise.all([
      retriveFriendList(requester._id.toString()),
      GroupMember.find({ group: groupId }).lean(),
    ]);
    const groupMemberUIDs: string[] = groupMembers.map((member) => {
      return member.user;
    });
    const friendNotInGroupUIDs = friendUIDs?.filter((friendUID) => !groupMemberUIDs.includes(friendUID));
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: requester._id.toString(),
      others: friendNotInGroupUIDs as string[],
    };
    const friendNotInGroup = await getUserData(request);
    const friendNotInGroupJson = getFriendNotInGroupJson(friendNotInGroup as user[], groupId);
    res.status(200).json(friendNotInGroupJson);
  } catch (error) {
    groupLogger.error(error);
  }
};
export const getFriendNotInGroupPage = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).lean();
    const getGroupMemberPageApi = `../group/memberPage/${groupId}`;
    const getGroupPageApi = `../group/${groupId}`;
    const getFriendNotInGroupApi = `../group/notInGroup/${groupId}`;
    const friendNotInGroupPageJson: FriendNotInGroupPageJson = getFriendNotInGroupPageJson(
      group?.name as string,
      getGroupMemberPageApi,
      getGroupPageApi,
      getFriendNotInGroupApi
    );
    res.status(200).json(friendNotInGroupPageJson);
  } catch (error) {
    groupLogger.error(error);
  }
};
export const getGroupMemberPage = async (req: Request, res: Response) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).lean();
    const getGroupPageApi = `../group/${groupId}`;
    const getFriendNotInGroupPageApi = `../group/notInGroupPage/${groupId}`;
    const getGroupMemberApi = `../group/member/${groupId}`;
    const groupMemberPageJson: GroupMemberPageJson = getGroupMemberPageJson(
      group?.name as string,
      getGroupPageApi,
      getFriendNotInGroupPageApi,
      getGroupMemberApi
    );
    res.status(200).json(groupMemberPageJson);
  } catch (error) {
    groupLogger.error(error);
  }
};
