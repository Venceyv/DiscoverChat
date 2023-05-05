import { roomLogger } from "../configs/logger.config";
import vars from "../configs/vars.config";
import { ChatContent, UserChatContent } from "../interfaces/chat.interfaces";
import { roomMessage, user } from "../interfaces/data.Interface";
import { Divider } from "../interfaces/divider.interface";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { UserResponseType } from "../interfaces/response.interface";
import { RoomPageJson } from "../interfaces/room.interface";
import { createConsumer, getUserData } from "./chatMq.service";
import { getDiscoverUserContentJson } from "./discover.service";
import { retrieveGlobalData, saveGlobalData } from "./globalData.service";
import { sendRequest } from "./request.service";
import { retriveMessage } from "./roomQueue.service";
import { makeKey } from "./userKey.service";

export const getRoomMessageJson = async (requesterId: string, userId: string): Promise<ChatContent | undefined> => {
    try {
      const userList: Array<string> = [];
      let messages: Array<string> | undefined = [];
      let messagesObj: Array<roomMessage> = [];
      let chatContent = {
        metadata: {
          version: "2.0",
        },
      } as ChatContent;
      const roomkey = makeKey(requesterId,userId);
      messages = await retriveMessage(roomkey);
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
        const key = makeKey(userId, roomkey);
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
          const roomMessage: roomMessage[] = JSON.parse(messageData as string);
          const roomMessageJson: UserChatContent[] = roomMessage.map((message) => {
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
          chatContent.regionContent = roomMessageJson;
        }
      }
      return chatContent;
    } catch (error) {
      roomLogger.error(error);
    }
  };
  export const getRoomPageJson = (
    chatListApi: string,
    roomName: string,
    roomMessageApi: string,
    disCoverApi: string,
    selfProfileAPI: string,
    roomId: string
  ) => {
    const divider: Divider = {
      elementType: "divider",
      borderStyle: "solid",
      borderWidth: "3px",
    };
    const roomChatJson: RoomPageJson = {
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
              label: roomName, //group里面的人名字
            },
          ],
        },
        divider,
        {
          elementType: "container",
          id: "roomMessage",
          content: {
            ajaxRelativePath: roomMessageApi, //groupchat的聊天内容
            ajaxUpdateInterval: 5,
          },
        },
        {
          elementType: "form",
          relativePath: `../room/newMessage/${roomId}`,
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
    return roomChatJson;
  };
export const getCurrentFriendStatus = async (friendUIDs:string,selfUID:string)=>{
  const request:UserResourceRequestType={
    resource:'users',
    type:'notSearch',
    fulFill:false,
    userId:selfUID,
    others:[friendUIDs]
  }
  const userData = await getUserData(request);
  const userContentJson = await getDiscoverUserContentJson(userData as user[],selfUID);
  const friendStatus = {
    metadata:{
      version:"2.0",
    },
    elementFields:userContentJson[0]
  };
  return friendStatus;
}