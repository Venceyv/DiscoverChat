import { globalLogger } from "../configs/logger.config";
import vars from "../configs/vars.config";
import { ChatContent, UserChatContent } from "../interfaces/chat.interfaces";
import { user } from "../interfaces/data.Interface";
import { groupMessage, roomMessage } from "../interfaces/data.Interface";
import { Divider } from "../interfaces/divider.interface";
import {
  AddGroupMemberList,
  CreateGroupPage,
  GroupMemberContent,
  GroupMemberList,
  GroupMemberPageJson,
  GroupPage,
} from "../interfaces/group.interface";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { UserResponseType } from "../interfaces/response.interface";
import { createConsumer } from "./chatMq.service";
import { retrieveGlobalData, saveGlobalData } from "./globalData.service";
import { retriveMessage } from "./groupQueue.service";
import { sendRequest } from "./request.service";
import { makeKey } from "./userKey.service";

/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-26 10:10:02
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-26 12:26:19
 * @FilePath: \discoveryChat(V1)\services\group.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export const editGroupName = (groupName: string, operation: string, userName: string): string => {
  let newGroupName: string;
  switch (operation) {
    case "add":
      newGroupName = groupName + "," + userName;
      break;
    default:
      const groupNameArray = groupName.split(",");
      const index = groupNameArray.indexOf(userName);
      groupNameArray.splice(index, 1);
      newGroupName = groupNameArray.toString();
      break;
  }
  return newGroupName;
};
export const getGroupMessageJson = async (groupId: string, userId: string): Promise<ChatContent | undefined> => {
  try {
    const userList: Array<string> = [];
    let messages: Array<string> | undefined = [];
    let messagesObj: Array<roomMessage> = [];
    let chatContent = {
      metadata: {
        version: "2.0",
      },
    } as ChatContent;
    messages = await retriveMessage(groupId);
    if (messages?.length == 0) {
      chatContent.regionContent = [];
    } else {
      messages?.map((message) => {
        const messegeOBj: roomMessage = JSON.parse(message);
        messagesObj?.push(messegeOBj);
        userList.push(messegeOBj.sender as string);
      });
      const request: UserResourceRequestType = {
        resource: "users",
        type: "notSearch",
        fulFill: false,
        userId: userId,
        others: userList,
      };
      await sendRequest(request);
      const key = makeKey(userId, groupId);
      await createConsumer(
        vars.rabbitMq.userRMQKey!,
        async (msgObj: UserResponseType) => {
          let index = 0;
          messagesObj!.map((messageObj) => {
            if (messageObj.sender) {
              messageObj.sender = msgObj.data![index];
              index += 1;
            }
            return messageObj;
          });
          await saveGlobalData(key, messagesObj);
        },
        request
      );
      const messageData = await retrieveGlobalData(key);
      if (messageData) {
        const groupMessage: groupMessage[] = JSON.parse(messageData as string);
        const groupMessageJson: UserChatContent[] = groupMessage.map((message) => {
          const chatContent: UserChatContent = {
            elementType: "nameTag",
            id: "standard",
            label: (message.sender as user)!.firstName + " " + (message.sender as user)!.lastName,
            link: {
              relativePath: `${vars.userServer.url}/${message.sender}`, //!get user profile
            },
            name: message.content,
            image: {
              url: (message.sender as user).profilePic,
              alt: "Photo of " + (message.sender as user).firstName,
            },
          };
          return chatContent;
        });
        chatContent.regionContent = groupMessageJson;
      }
    }
    return chatContent;
  } catch (error) {
    globalLogger.error(error);
  }
};
export const getGroupPageJson = (
  chatListApi: string,
  gruopName: string,
  inviteToGroupApi: string,
  groupMessageApi: string,
  disCoverApi: string,
  selfProfileAPI: string,
  groupId: string
) => {
  const divider: Divider = {
    elementType: "divider",
    borderStyle: "solid",
    borderWidth: "3px",
  };
  const groupChatJson: GroupPage = {
    content: [
      {
        borderColor: "transparent",
        elementType: "divider",
      },
      {
        elementType: "toolbar",
        toolbarStyle: "unpadded",
        left: [
          {
            elementType: "linkButton",
            accessoryIcon: "dropleft",
            backgroundColor: "#ffffff",
            borderRadius: "loose",
            borderWidth: "2px",
            link: {
              relativePath: chatListApi, //返回到chat页面（chat页面里面的ajax再load具体的content）
            },
          },
        ],
        middle: [
          {
            elementType: "toolbarLabel",
            label: gruopName, //group里面的人名字
          },
        ],
        right: [
          {
            elementType: "linkButton",
            accessoryIcon: "browse",
            backgroundColor: "#ffffff",
            borderRadius: "loose",
            borderWidth: "2px",
            link: {
              relativePath: inviteToGroupApi, //groupchat的添加好友进group聊天或者移出去的页面
            },
          },
        ],
      },
      divider,
      {
        elementType: "container",
        content: {
          ajaxRelativePath: groupMessageApi, //groupchat的聊天内容
        },
      },
      divider,
      {
        elementType: "toolbar",
        toolbarStyle: "unpadded",
        middle: [
          {
            elementType: "toolbarForm",
            relativePath: `../group/newMessage/${groupId}?message=`, //
            items: [
              {
                elementType: "toolbarInput", // send message at group chat private message
                inputType: "text",
                name: "search_input",
              },
              {
                elementType: "buttonContainer",
                buttons: [
                  {
                    elementType: "formButton",
                    title: "Send",
                    actionType: "destructiveQuiet",
                  },
                ],
              },
            ],
          },
        ],
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
              relativePath: disCoverApi, //跳转到discover页面
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            marginTop: "responsive",
            title: "profile",
            link: {
              relativePath: selfProfileAPI, //! self profile
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            marginTop: "responsive",
            title: "Chat",
            link: {
              relativePath: chatListApi, //跳转到chat页面
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
  return groupChatJson;
};
export const getGroupMemberListJson = (groupMembers: user[], groupId: string): GroupMemberList => {
  let groupMembercontentArray: GroupMemberContent[] = [];
  groupMembercontentArray = groupMembers.map((groupMember) => {
    const groupMembercontent: GroupMemberContent = {
      elementType: "nameTag",
      id: "standard",
      name: groupMember.firstName + " " + groupMember.lastName,
      link: {
        relativePath: `${vars.userServer.url}/${groupMember._id}`, //!get user profile
      },
      description: groupMember.majorList[0],
      image: {
        url: groupMember.profilePic,
        alt: "photo of " + groupMember.firstName,
      },
      accessoryButton: {
        actionStyle: "normal",
        title: groupMember == groupMembers[0] ? "Quit" : "Remove",
        events: [
          {
            eventName: "click",
            targetId: "button",
            action: "ajaxUpdate",
            ajaxRelativePath:
              groupMember == groupMembers[0]
                ? `../group/leaveGroup/${groupId}`
                : `../group/removeUser/${groupId}/${groupMember._id as string}`,
            requestMethod: "delete",
          },
        ],
        textColor: "theme:focal_link_color",
      },
    };
    return groupMembercontent;
  }) as GroupMemberContent[];
  const groupMemberListJson: GroupMemberList = {
    metadata: {
      version: "2.0",
    },
    regionContent: groupMembercontentArray,
  };
  return groupMemberListJson;
};
export const getFriendNotInGroupJson = (friendNotInGroup: user[], groupId: string): AddGroupMemberList => {
  const addGroupMemberContentArray: GroupMemberContent[] = friendNotInGroup.map((friend) => {
    const addGroupMemberContent: GroupMemberContent = {
      elementType: "nameTag",
      id: "standard",
      name: friend.firstName + " " + friend.lastName,
      link: {
        relativePath: friend._id as string,
      },
      description: friend.description,
      image: {
        url: friend.profilePic,
        alt: "Photo of " + friend.firstName,
      },
      accessoryButton: {
        actionStyle: "normal",
        title: "Add",
        events: [
          {
            eventName: "click",
            targetId: "button",
            action: "ajaxUpdate",
            ajaxRelativePath: `../group/newMember/${groupId}/${friend._id?.toString()}`,
            requestMethod: "post",
          },
        ],
        textColor: "theme:focal_link_color",
      },
    };
    return addGroupMemberContent;
  });
  const friendNotInGroupJson: AddGroupMemberList = {
    metadata: {
      version: "2.0",
    },
    regionContent: addGroupMemberContentArray as GroupMemberContent[],
  };
  return friendNotInGroupJson;
};
export const GetAddFriendToGroupJson = (friendList: user[]): AddGroupMemberList => {
  const addGroupMemberContentArray: GroupMemberContent[] = friendList.map((friend) => {
    const addGroupMemberContent: GroupMemberContent = {
      elementType: "nameTag",
      id: "standard",
      name: friend.firstName + " " + friend.lastName,
      link: {
        relativePath: `${vars.userServer.url}/${friend._id}`, //!get user profile
      },
      description: friend.description,
      image: {
        url: friend.profilePic,
        alt: "Photo of " + friend.firstName,
      },
      accessoryButton: {
        title: "Add",
        textColor: "theme:focal_link_color",
        events: [
          {
            eventName: "click",
            targetId: "nameTag",
            action: "ajaxUpdate",
            ajaxRelativePath: `../group/newGroup/${friend._id?.toString()}`,
            requestMethod: "post",
          },
        ],
      },
    };
    return addGroupMemberContent;
  });
  const friendNotInGroupJson: AddGroupMemberList = {
    metadata: {
      version: "2.0",
    },
    regionContent: addGroupMemberContentArray as GroupMemberContent[],
  };
  return friendNotInGroupJson;
};
export const getCreateGroupJson = (chatListAPI: string, friendListAPI: string): CreateGroupPage => {
  const createGroupPage: CreateGroupPage = {
    content: [
      {
        borderColor: "transparent",
        elementType: "divider",
      },
      {
        elementType: "toolbar",
        toolbarStyle: "unpadded",
        left: [
          {
            elementType: "linkButton",
            accessoryIcon: "confirm",
            backgroundColor: "#ffffff",
            borderRadius: "loose",
            size: "large",
            borderWidth: "2px",
            link: {
              relativePath: chatListAPI,
            },
          },
        ],
      },
      {
        elementType: "container",
        content: {
          ajaxRelativePath: friendListAPI, //chatpag加好友的list页面
        },
      },
    ],
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "narrow",
  };
  return createGroupPage;
};
export const getGroupMemberPageJson = (
  groupName: string,
  getGroupPageApi: string,
  getFriendNotInGroupPageApi: string,
  getGroupMemberApi: string
): GroupMemberPageJson => {
  const groupMemberPage: GroupMemberPageJson = {
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
            elementType: "toolbarLabel",
            label: groupName, //group名字
          },
        ],
        left: [
          {
            elementType: "linkButton",
            accessoryIcon: "dropleft",
            backgroundColor: "#ffffff",
            borderRadius: "loose",
            size: "large",
            borderWidth: "2px",
            link: {
              relativePath: getGroupPageApi, //返回到groupchat的页面（里面的ajax会load content）
            },
          },
        ],
        right: [
          {
            elementType: "linkButton",
            accessoryIcon: "button_add", //添加好友进入群聊
            backgroundColor: "#ffffff",
            borderRadius: "loose",
            size: "large",
            borderWidth: "2px",
            link: {
              relativePath: getFriendNotInGroupPageApi, //返回到groupchat的页面）
            },
          },
        ],
      },
      {
        elementType: "container",
        content: {
          ajaxRelativePath: getGroupMemberApi, //groupchat的朋友列表，进行浏览和移除群聊
        },
      },
    ],
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "narrow",
  };
  return groupMemberPage;
};
export const getFriendNotInGroupPageJson = (
  groupName: string,
  getGroupMemberPageApi: string,
  getGroupPageApi: string,
  getFriendNotInGroupApi: string
) => {
  const groupMemberPage: GroupMemberPageJson = {
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
            elementType: "toolbarLabel",
            label: groupName, //group名字
          },
        ],
        left: [
          {
            elementType: "linkButton",
            accessoryIcon: "dropleft",
            backgroundColor: "#ffffff",
            borderRadius: "loose",
            size: "large",
            borderWidth: "2px",
            link: {
              relativePath: getGroupMemberPageApi,
            },
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
              relativePath: getGroupPageApi,
            },
          },
        ],
      },
      {
        elementType: "container",
        content: {
          ajaxRelativePath: getFriendNotInGroupApi, //groupchat的朋友列表，进行浏览和移除群聊
        },
      },
    ],
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "narrow",
  };
  return groupMemberPage;
};
