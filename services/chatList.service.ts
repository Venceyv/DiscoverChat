import { globalLogger } from "../configs/logger.config";
import { redisGroup, redisRoom } from "../configs/redis.config";
import { Group, GroupMember } from "../models/index.model";
import {  getUserData } from "../services/chatMq.service";
import { makeKey } from "../services/userKey.service";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { user, DiaLogue, roomMessage, groupMessage } from "../interfaces/data.Interface";
import { retriveFriendList } from "../services/friendList.service";
import { ChatListContent } from "../interfaces/chat.interfaces";
import { ChatListPageJson } from "../interfaces/chatList.interface";
import { Divider } from "../interfaces/divider.interface";
import { ToolBar } from "../interfaces/toolBar.interface";
import { ButtonGroup } from "../interfaces/buttonGroup.interface";
export const getUserChatList = async (
  userId: string,
  operation: "byTime" | "bySearch",
  keyword: string | null = null
): Promise<ChatListContent[] | undefined> => {
  try {
    let chats: DiaLogue[] = [];
    let [friendList, groupList] = await Promise.all([
      retriveFriendList(userId),
      GroupMember.find({ user: userId }, { group: 1 }).lean(),
    ]);
    if (friendList?.length == 0 && groupList.length == 0) return undefined;
    if (friendList?.length != 0) {
      const request: UserResourceRequestType = {
        resource: "users",
        type: "notSearch",
        fulFill: false,
        userId: userId,
        others: friendList as string[],
      };
      const friends: user[] = (await getUserData(request)) as user[];
      const timeNow = new Date();
      await Promise.all(
        friends?.map(async (friend) => {
          const key = makeKey(userId, friend._id as string);
          const lastMessageData = await redisRoom.lindex(key, -1);
          let lastMessage: roomMessage | null = null;
          if (lastMessageData) lastMessage = JSON.parse(lastMessageData);
          const dialogue: DiaLogue = {
            type: "room",
            id: friend._id as string,
            name: friend.firstName + " " + friend.lastName,
            avatar: friend.profilePic,
            messageContent: lastMessage?.content as string,
            timeStamp: lastMessage ? new Date(lastMessage.timeStamp) : timeNow,
          };
          chats.push(dialogue);
        })
      );
    }
    if (groupList.length != 0) {
      await Promise.all(
        groupList.map(async (groupData) => {
          const group = await Group.findById(groupData.group).lean();
          const lastMessageData = await redisGroup.lindex(groupData.group, -1);
          let lastMessage: groupMessage | null = null;
          if (lastMessageData) lastMessage = JSON.parse(lastMessageData);
          const dialogue: DiaLogue = {
            type: "group",
            id: group!._id.toString(),
            name: group?.name as string,
            avatar: group?.avatar as string,
            messageContent: lastMessage?.content as string,
            timeStamp: group?.lastActivity as Date,
          };
          chats.push(dialogue);
        })
      );
    }
    switch (operation) {
      case "byTime":
        chats = chats.sort((a, b) => b.timeStamp!.getTime() - a.timeStamp!.getTime());
        break;
      default:
        chats = chats.filter((e) => {
          const chatName = e.name.toLowerCase();
          return chatName.includes(keyword!.toLowerCase());
        });
        break;
    }
    const chatListJson = getChatListJson(chats);
    return chatListJson;
  } catch (error) {
    globalLogger.error(error);
  }
};
export const getChatListJson = (chatList: DiaLogue[]): ChatListContent[] => {
  let chatListArrayJson: ChatListContent[] = [];
  chatListArrayJson = chatList.map((chat) => {
    const chatJson: ChatListContent = {
      elementType: "nameTag",
      id: "standard",
      name: chat.name,
      link: {
        relativePath: `../${chat.type}/${chat.id}`,
      },
      description: chat.messageContent,
      image: {
        url: chat.avatar,
        alt: chat.type + " chat image",
      },
    };
    return chatJson;
  });
  return chatListArrayJson;
};
export const getChatListPageJson = (
  frindListToAddGroupApi: string,
  chatListJson: ChatListContent[],
  getDiscoverPageApi: string,
  getSelfProfileApi: string,
  getChatListPageApi: string
) => {
  const divider: Divider = {
    borderColor: "transparent",
    elementType: "divider",
  };
  const toolBar: ToolBar = {
    elementType: "toolbar",
    toolbarStyle: "unpadded",
    middle: [
      {
        elementType: "toolbarForm",
        relativePath: `../chatList`, //放这里
        items: [
          {
            elementType: "toolbarInput",
            inputType: "text",
            name: "q",
          },
          {
            elementType: "buttonContainer",
            buttons: [
              {
                elementType: "formButton",
                title: "Search",
                buttonType: "submit",
                actionType: "search",
              },
            ],
          },
        ],
      },
    ],
    right: [
      {
        elementType: "linkButton",
        accessoryIcon: "button_add",
        backgroundColor: "#ffffff",
        borderRadius: "loose",
        size: "large",
        borderWidth: "2px",
        link: {
          relativePath: frindListToAddGroupApi, //@groupchat添加朋友的list
        },
      },
    ],
  };
  const buttonGroup: ButtonGroup = {
    elementType: "buttonGroup",
    fullWidth: true,
    buttons: [
      {
        elementType: "linkButton",
        size: "large",
        borderColor: "#FFFFFF",
        marginTop: "responsive",
        title: "discover",
        link: {
          relativePath: getDiscoverPageApi,
          //@discover page的框架，button点击直接转到discover那页
        },
      },
      {
        elementType: "linkButton",
        size: "large",
        borderColor: "#FFFFFF",
        marginTop: "responsive",
        title: "profile",
        link: {
          relativePath: getSelfProfileApi,
          //@看自己的profile（bar的button）
        },
      },
      {
        elementType: "linkButton",
        size: "large",
        borderColor: "#FFFFFF",
        marginTop: "responsive",
        title: "Chat",
        link: {
          relativePath: getChatListPageApi,
          //@下面bar的button连接直接转到chatpage页面
        },
      },
    ],
  };
  const content: (Divider | ToolBar | ChatListContent | ButtonGroup)[] = [];
  content.push(divider);
  content.push(toolBar);
  chatListJson.map((chat) => content.push(chat));
  content.push(buttonGroup);
  const chatListPageJson: ChatListPageJson = {
    content: content,
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "narrow",
  };
  return chatListPageJson;
};
