import { roomLogger } from "../configs/logger.config";
import vars from "../configs/vars.config";
import { ChatContent, UserChatContent } from "../interfaces/chat.interfaces";
import { roomMessage, user } from "../interfaces/data.Interface";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { UserResponseType } from "../interfaces/response.interface";
import { RoomPageJson } from "../interfaces/room.interface";
import { createConsumer } from "./chatMq.service";
import { retrieveGlobalData, saveGlobalData } from "./globalData.service";
import { sendRequest } from "./request.service";
import { retriveMessage } from "./roomQueue.service";
import { makeKey } from "./userKey.service";

export const getRoomMessageJson = async (requesterId: string, userId: string): Promise<ChatContent | undefined> => {
  try {
    let messages: Array<string> | undefined;
    let messagesObj: Array<roomMessage> = [];
    let chatContent = {
        metadata: {
          version: "2.0",
        },
      } as ChatContent;
    const roomId = makeKey(requesterId, userId);
    messages = await retriveMessage(roomId);
    if (messages?.length == 0) {
        chatContent.regionContent = [];
      }
    else{
        let userList: Array<string | user> = [];
        messages!.map((message) => {
          const messageObj: roomMessage = JSON.parse(message);
          messagesObj.push(messageObj);
          userList.push(messageObj.sender!);
        });
        const request: UserResourceRequestType = {
          resource: "users",
          userId: requesterId,
          type: "notSearch",
          fulFill: false,
          others: userList! as string[],
        };
        await sendRequest(request);
        const key = makeKey(userId, roomId);
        await createConsumer(
          vars.rabbitMq.userRMQKey,
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
        const roomMessageData = await retrieveGlobalData(key);
        if (roomMessageData) {
            const groupMessage: roomMessage[] = JSON.parse(roomMessageData as string);
            const groupMessageJson: UserChatContent[] = groupMessage.map((message) => {
              const chatContent: UserChatContent = {
                elementType: "nameTag",
                id: "standard",
                label: (message.sender as user)!.firstName + " " + (message.sender as user)!.lastName,
                link: {
                  relativePath: `${vars.userServer.url}/${(message.sender as user)._id}`, //!get user profile
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
    roomLogger.error(error);
  }
};
export const getRoomPageJson = (chatListAPI:string,friendName:string,getRoomMessageAPI:string,disCoverApi:string,selfProfileAPI:string,friendId:string):RoomPageJson=>{
    const roomPageJson:RoomPageJson ={
        content: [
            {
                borderColor: "transparent",
                elementType: "divider"
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
                            relativePath: chatListAPI//从windowchat具体聊天框返回到chat page
                        }
                    }
                ],
                middle: [
                    {
                        elementType: "toolbarLabel",
                        label: friendName
                    }
                ]
                
            },
            {
                elementType: "divider",
                borderStyle: "solid",
                borderWidth: "3px"
            },
            {
                elementType: "container",
                content: {
                    ajaxRelativePath: getRoomMessageAPI//windowchat的聊天内容
                }
            },
            {
                elementType: "divider",
                borderStyle: "solid",
                borderWidth: "3px"
            },
            {
                elementType: "toolbar",
                toolbarStyle: "unpadded",
                middle: [
                    {
                        elementType: "toolbarForm",
                        relativePath: `../room/newMessage/${friendId}?content=`,//relative path
                        items: [
                            {
                                elementType: "toolbarInput",// send message at window chat private message
                                inputType: "text",
                                name: "search_input"
                            },
                            {
                                elementType: "buttonContainer",
                                buttons: [
                                    {
                                        elementType: "formButton",
                                        title: "Send",
                                        buttonType:'submit',
                                        actionType: "destructiveQuiet"
                                    }
                                ]
                            }
                        ]
                    }
                ]
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
                relativePath: disCoverApi//跳转到discover页面
              }
            },
            {
              elementType: "linkButton",
              size: "large",
              borderColor: "#FFFFFF",
              marginTop: "responsive",
              title: "profile",
              link: {
                relativePath: selfProfileAPI//跳转到自己的profile
              }
            },
            {
              elementType: "linkButton",
              size: "large",
              borderColor: "#FFFFFF",
              marginTop: "responsive",
              title: "Chat",
              link: {
                relativePath: chatListAPI//跳转到chat页面
              }
            }
          ]
        }
        ],
        metadata: {
            "version": "2.0"
        },
        contentContainerWidth: "narrow"
    }
    return roomPageJson;
}