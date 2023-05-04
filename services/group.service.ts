import { globalLogger } from "../configs/logger.config";
import vars from "../configs/vars.config";
import { ButtonGroup } from "../interfaces/buttonGroup.interface";
import { ChatContent, UserChatContent } from "../interfaces/chat.interfaces";
import { Container } from "../interfaces/container.interface";
import { user } from "../interfaces/data.Interface";
import { groupMessage, roomMessage } from "../interfaces/data.Interface";
import { DiscoverPageJson, DiscoverUserContentJson } from "../interfaces/discover.interface";
import { Divider } from "../interfaces/divider.interface";
import {
  AddGroupMemberList,
  GroupMemberContent,
  GroupMemberPageJson,
  GroupPage,
} from "../interfaces/group.interface";
import { List } from "../interfaces/list.interface";
import { Form } from "../interfaces/loginForm.interface";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { UserResponseType } from "../interfaces/response.interface";
import { ToolBar } from "../interfaces/toolBar.interface";
import { GroupMember } from "../models/index.model";
import { createConsumer, getUserData } from "./chatMq.service";
import { retrieveGlobalData, saveGlobalData } from "./globalData.service";
import { retriveMessage } from "./groupQueue.service";
import { sendRequest } from "./request.service";
import { makeKey } from "./userKey.service";

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
              relativePath: `../user/${message.sender}`, //!get user profile
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
  groupMemberPageApi: string,
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
              relativePath: groupMemberPageApi, //groupchat的添加好友进group聊天或者移出去的页面
            },
          },
        ],
      },
      divider,
      {
        elementType: "container",
        id: "gourpMessage",
        content: {
          ajaxRelativePath: groupMessageApi, //groupchat的聊天内容
          ajaxUpdateInterval: 5,
        },
      },
      {
        elementType: "form",
        relativePath: `../group/newMessage/${groupId}`,
        disableScrim: true,
        postType: "background",
        id: "MessageInputBar",
        items: [
          {
            elementType: "input",
            inputType: "text",
            name: "message",
            label: "",
            required: true,
          },
          {
            elementType: "buttonContainer",
            buttons: [
              {
                elementType: "formButton",
                title: "Send",
                buttonType: "submit",
                actionType: "constructive",
              },
              {
                elementType: "formButton",
                title: "Reset",
                buttonType: "reset",
                actionType: "destructive",
              },
            ],
          },
        ],
        events: [
          {
            eventName: "success",
            action: "resetForm",
            targetId: "MessageInputBar",
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
export const getGroupMemberListJson = (groupMembers: user[], groupId: string,selfId:string): GroupMemberContent[] => {
  let groupMembercontentArray: GroupMemberContent[] = [];
  groupMembercontentArray = groupMembers.map((groupMember) => {
    const groupMembercontent: GroupMemberContent = {
      id: `${groupMember._id}`,
      title: groupMember.firstName + " " + groupMember.lastName,
      link: {
        relativePath: `../user/${groupMember._id}`, //!get user profile
      },
      description: groupMember.majorList[0],
      image: {
        url: groupMember.profilePic,
        alt: "photo of " + groupMember.firstName,
      },
      accessoryButton: {
        title: groupMember._id == selfId ? "Quit" : "Remove",
        events: [
          {
            eventName: "click",
            targetId: `${groupMember._id}`,
            action: "ajaxUpdate",
            ajaxRelativePath:
            groupMember._id == selfId 
                ? `../group/leaveGroup/${groupId}`
                : `../group/removeUser/${groupId}/${groupMember._id as string}`,
            requestMethod: "delete",
          }
        ],
        textColor: "theme:focal_link_color",
      },
    };
    return groupMembercontent;
  }) as GroupMemberContent[];
  return groupMembercontentArray;
};
export const getFriendNotInGroupJson = (friendNotInGroup: user[], groupId: string): GroupMemberContent[] => {
  const addGroupMemberContentArray: GroupMemberContent[] = friendNotInGroup.map((friend) => {
    const addGroupMemberContent: GroupMemberContent = {
      id: `${friend._id}`,
      title: friend.firstName + " " + friend.lastName,
      link: {
        relativePath: `../user/${friend._id}`, //!get user profile
      },
      description: friend.majorList[0],
      image: {
        url: friend.profilePic,
        alt: "photo of " + friend.firstName,
      },
      accessoryButton: {
        title: "Invite",
        events: [
          {
            eventName: "click",
            targetId: `${friend._id}`,
            action: "ajaxUpdate",
            ajaxRelativePath: `../group/newMember/${groupId}/${friend._id as string}`,
            requestMethod: "post",
          },
        ],
        textColor: "theme:focal_link_color",
      },
    };
    return addGroupMemberContent;
  });
  return addGroupMemberContentArray;
};
export const GetAddFriendToGroupJson = (friendList: user[]): AddGroupMemberList => {
  const addGroupMemberContentArray: GroupMemberContent[] = friendList.map((friend) => {
    const addGroupMemberContent: GroupMemberContent = {
      elementType: "nameTag",
      id: "standard",
      name: friend.firstName + " " + friend.lastName,
      link: {
        relativePath: `../user/${friend._id}`, //!get user profile
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
export const getCreateGroupJson = (
  userContentJson: DiscoverUserContentJson[],
  discoverPageAPI: string,
  chatListAPI: string,
  selfProfileAPI: string
): DiscoverPageJson => {
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
          relativePath: discoverPageAPI, //跳转到discover页面
        },
      },
      {
        elementType: "linkButton",
        size: "large",
        borderColor: "#FFFFFF",
        marginTop: "responsive",
        title: "profile",
        link: {
          relativePath: selfProfileAPI, //! user profile
        },
      },
      {
        elementType: "linkButton",
        size: "large",
        borderColor: "#FFFFFF",
        marginTop: "responsive",
        title: "chat",
        link: {
          relativePath: chatListAPI,
        },
      },
    ],
  };
  const divider: Divider = {
    borderColor: "transparent",
    elementType: "divider",
  };
  const content: (Divider | ToolBar | Container | ButtonGroup | List)[] = [];
  let items: DiscoverUserContentJson[] = [];
  content.push(divider);
  userContentJson.map((value) => {
    items.push(value);
  });
  const list: List = {
    elementType: "list",
    items: items,
  };
  content.push(list);
  content.push(buttonGroup);
  const createGroupPage: DiscoverPageJson = {
    metadata: {
      version: "2.0",
    },
    content: content,
    contentContainerWidth: "narrow",
  };
  return createGroupPage;
};
export const getGroupMemberPageJson = (
  groupName: string,
  getGroupPageApi: string,
  FriendNotInGroupJson: GroupMemberContent[],
  GroupMemberJson: GroupMemberContent[]
): GroupMemberPageJson => {
  const content: (Divider | ToolBar | Container | ButtonGroup | Form | List)[] = [];
  const divider: Divider = {
    borderColor: "transparent",
    elementType: "divider",
  };
  const toolBar = {
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
  };
  const items: GroupMemberContent[] = GroupMemberJson.concat(FriendNotInGroupJson);
  const list: List = {
    elementType: "list",
    items: items,
  };
  content.push(divider);
  content.push(toolBar);
  content.push(list);
  const groupMemberPage: GroupMemberPageJson = {
    content: content,
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "narrow",
  };
  return groupMemberPage;
};
export const getGroupMemberStatus = async (userId: string, groupId: string, selfUID: string) => {
  try {
    const inGroup = await GroupMember.findOne({ user: userId, group: groupId }).lean();
    const request: UserResourceRequestType = {
      resource: "users",
      type: "notSearch",
      fulFill: false,
      userId: selfUID,
      others: [userId],
    };
    const userData = await getUserData(request);
    let userContentJson: GroupMemberContent[];
    if (inGroup) userContentJson = getGroupMemberListJson(userData as user[], groupId,selfUID);
    else userContentJson = getFriendNotInGroupJson(userData as user[], groupId);
    const groupMemberStatus = {
      metadata:{
        version:"2.0",
      },
      elementFields:userContentJson[0]
    };
    return groupMemberStatus;
  } catch (error) {
    globalLogger.error(error);
  }
};
export const getFriendListJson =  (friendData:user[]) => {
  const userSearchContentArray: DiscoverUserContentJson[] = friendData.map(friend => {
    let userSearchContent: DiscoverUserContentJson;
      userSearchContent = {
        id:`${friend._id}`,
        title: friend.firstName + " " + friend.lastName,
        link: {
          relativePath: `../user/${friend._id}`,
        },
        description: friend.majorList[0],
        image: {
          url: friend.profilePic,
          alt: `Photo of ${friend.firstName + " " + friend.lastName}`,
        },
        accessoryButton: {
          title: "Invite",
          events: [
            {
              eventName: "click",
              targetId: `${friend._id}`,
              action: "ajaxUpdate",
              ajaxRelativePath: `../group/${friend._id}`,
              requestMethod:"post",
            },
          ],
          textColor: "theme:focal_link_color",
        },
      };
      return userSearchContent;
    });
    return userSearchContentArray;
}