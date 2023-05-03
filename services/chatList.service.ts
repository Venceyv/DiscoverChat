import { globalLogger } from "../configs/logger.config";
import { redisGroup, redisRoom } from "../configs/redis.config";
import { Group, GroupMember } from "../models/index.model";
import { createConsumer } from "../services/chatMq.service";
import { makeKey } from "../services/userKey.service";
import vars from "../configs/vars.config";
import { retrieveGlobalData, saveGlobalData } from "../services/globalData.service";
import { UserResponseType } from "../interfaces/response.interface";
import { sendRequest } from "../services/request.service";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { user, DiaLogue, roomMessage, groupMessage } from "../interfaces/data.Interface";
import { retriveFriendList } from "../services/friendList.service";
import { ChatContent, ChatListContent } from "../interfaces/chat.interfaces";
import { ChatListPageJson } from "../interfaces/chatList.interface";
export const getUserChatList = async (
  userId: string,
  operation: "byTime" | "bySearch",
  keyword: string | null = null
): Promise<ChatContent | undefined> => {
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
      await sendRequest(request);
      const key = makeKey(userId, "getChatList");
      await createConsumer(
        vars.rabbitMq.userRMQKey,
        async (msg: UserResponseType) => {
          await saveGlobalData(key, msg.data as user[]);
        },
        request
      );
      const friendData = await retrieveGlobalData(key);
      if (friendData) {
        const friends: user[] = JSON.parse(friendData);
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
              name: friend.lastName,
              avatar: friend.profilePic,
              messageContent: lastMessage?.content as string,
              timeStamp: lastMessage ? new Date(lastMessage.timeStamp) : timeNow,
            };
            chats.push(dialogue);
          })
        );
      }
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
        chats = chats.filter((e) => e.name.includes(keyword!));
        break;
    }
    const chatListJson = getChatListJson(chats);
    return chatListJson;
  } catch (error) {
    globalLogger.error(error);
  }
};
export const getChatListJson = (chatList: DiaLogue[]): ChatContent => {
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
  const chatListJson: ChatContent = {
    metadata: {
      version: "2.0",
    },
    regionContent: chatListArrayJson,
  };
  return chatListJson;
};
export const getChatListPageJson = (
  frindListToAddGroupApi: string,
  getChatListApi: string,
  getDiscoverPageApi: string,
  getSelfProfileApi: string,
  getChatListPageApi: string
) => {
  const chatListPageJson: ChatListPageJson = {
    content: [
      {
        borderColor: "transparent",
        elementType: "divider",
      },
      {
        elementType: "toolbar",
        toolbarStyle: "unpadded",
        middle: [
          {
            elementType: "toolbarForm",
            relativePath: `../chatList/search?q=`, //放这里
            items: [
              {
                elementType: "toolbarInput",
                inputType: "text",
                name: "search_input",
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
      },
      {
        elementType: "container",
        content: {
          ajaxRelativePath: getChatListApi,
          // @chat的list内容（好友列表）
        },
      },
      {
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
      },
    ],
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "narrow",
  };
  return chatListPageJson;
};
