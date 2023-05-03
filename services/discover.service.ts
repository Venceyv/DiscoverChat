/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-11 00:50:30
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 03:14:21
 * @FilePath: \discoveryChat\services\discover.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Container, log } from "winston";
import vars from "../configs/vars.config";
import { ButtonContainer } from "../interfaces/buttonContainer.interface";
import { ButtonGroup } from "../interfaces/buttonGroup.interface";
import { user } from "../interfaces/data.Interface";
import { DiscoverPageJson, DiscoverUserContentJson, DiscoverhContentJson } from "../interfaces/discover.interface";
import { Divider } from "../interfaces/divider.interface";
import { FormButton } from "../interfaces/formbutton.interface";
import { SearchContentJson, SearchUserContentJson } from "../interfaces/search.interface";
import { ToolBar } from "../interfaces/toolBar.interface";
import { ToolBarForm } from "../interfaces/toolBarForm.interface";
import { ToolBarInput } from "../interfaces/toolBarInput.interface";
import { isFriends, retriveFriendList } from "./friendList.service";
import { Form } from "../interfaces/loginForm.interface";
export const getMightBeFriendList = async (
  requester: string,
  friendList: Array<string>
): Promise<string[] | undefined> => {
  try {
    let mightBeFriendList: Array<string> = [];
    type FriendFriendList = [string[]];
    let listFriendFriendList: FriendFriendList = (await Promise.all(
      friendList.map(async (friend) => {
        return await retriveFriendList(friend);
      })
    )) as unknown as [string[]];
    listFriendFriendList = listFriendFriendList.map((friendFriendList) => {
      return friendFriendList.filter((friendFriend) => friendFriend != requester);
    }) as [string[]];
    listFriendFriendList.map((friendFriendList) => {
      mightBeFriendList = mightBeFriendList.concat(friendFriendList);
    });
    const filteredMightBeFriendList: string[] = [];
    await Promise.all(
      mightBeFriendList.map(async (user) => {
        const isFriend = await isFriends(requester, user);
        if (!isFriend) filteredMightBeFriendList.push(user);
      })
    );
    return filteredMightBeFriendList;
  } catch (error) {
    console.log(error);
  }
};
export const getDiscoverPageJson = (
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
  const divider:Divider = {
    borderColor: "transparent",
    elementType: "divider",
  };
  const toolBar = {
    elementType: "toolbar",
    toolbarStyle: "unpadded",
    middle: [
      {
        elementType: "toolbarForm",
        relativePath: `../discover/discoverPage?q=`, // add relative path
        items: [
          {
            elementType: "toolbarInput",
            inputType: "text",
            label: "searchUser",
            name: "q",
            required: true,
          },
          {
            elementType: "buttonContainer",
            buttons: [
              {
                elementType: "formButton",
                title: "search",
                buttonType: "submit",
                actionType: "search",
              },
            ],
          },
        ],
      },
    ],
  };
  const content: (Divider | ToolBar | Container | ButtonGroup | Form | DiscoverUserContentJson)[] = [];
  content.push(divider);
  content.push(toolBar);
  userContentJson.forEach((value)=>{
    content.push(value);
  });
  content.push(buttonGroup);
  const discoverPageJson: DiscoverPageJson = {
    metadata: {
      version: "2.0",
    },
    content: content,
    contentContainerWidth: "narrow",
  };
  return discoverPageJson;
};
export const getDiscoverUserContentJson = async (
  userData: user[],
  requesterId: string,
  targetId: string
): Promise<DiscoverUserContentJson[]> => {
  const userSearchContentArray: DiscoverUserContentJson[] = await Promise.all(
    userData.map(async (user) => {
      let userSearchContent: DiscoverUserContentJson;
      if (user._id != requesterId) {
        const isFriend = await isFriends(requesterId, user._id as string);
        userSearchContent = {
          elementType: "nameTag",
          id: "standard",
          name: user.firstName + " " + user.lastName,
          link: {
            relativePath: `${vars.userServer.url}/${user._id}`,
          },
          description: user.majorList[0],
          image: {
            url: user.profilePic,
            alt: `Photo of ${user.firstName + " " + user.lastName}`,
          },
          accessoryButton: {
            actionStyle: "normal",
            title: isFriend ? "Remove Friend" : "Add Friend",
            events: [
              {
                eventName: "click",
                targetId: targetId,
                action: "ajaxUpdate",
                ajaxRelativePath: `../room/${user._id}`,
                requestMethod: isFriend ? "delete" : "post",
              },
            ],
            textColor: "theme:focal_link_color",
          },
        };
      } else {
        userSearchContent = {
          elementType: "nameTag",
          id: "standard",
          name: user.firstName + " " + user.lastName,
          link: {
            relativePath: `${vars.userServer.url}/${user._id}`,
          },
          description: user.majorList[0],
          image: {
            url: user.profilePic,
            alt: `Photo of ${user.firstName + " " + user.lastName}`,
          },
        };
      }

      return userSearchContent;
    })
  );
  return userSearchContentArray;
};
export const getSearchUserContentJson = async (
  userData: user[],
  requesterId: string
): Promise<SearchUserContentJson[]> => {
  const userSearchContentArray: SearchUserContentJson[] = [];
  await Promise.all(
    userData.map(async (user) => {
      let userSearchContent: SearchUserContentJson;
      if (user._id != requesterId) {
        const isFriend = await isFriends(requesterId, user._id as string);
        console.log(isFriend)
        userSearchContent = {
          elementType: "nameTag",
          id: "searchResult",
          name: user.firstName + " " + user.lastName,
          link: {
            relativePath: `${vars.userServer.url}/${user._id}`,
          },
          description: user.majorList[0],
          image: {
            url: user.profilePic,
            alt: `Photo of ${user.firstName + " " + user.lastName}`,
          },
          accessoryButton: {
            actionStyle: "normal",
            title: isFriend ? "Remove Friend" : "Add Friend",
            events: [
              {
                eventName: "click",
                targetId: "searchResult",
                action: "ajaxUpdate",
                ajaxRelativePath: `../room/${user._id}`,
                requestMethod: isFriend ? "delete" : "post",
              },
            ],
            textColor: "theme:focal_link_color",
          },
        };
      } else {
        userSearchContent = {
          elementType: "nameTag",
          id: "standard",
          name: user.firstName + " " + user.lastName,
          link: {
            relativePath: `${vars.userServer.url}/${user._id}`,
          },
          description: user.majorList[0],
          image: {
            url: user.profilePic,
            alt: `Photo of ${user.firstName + " " + user.lastName}`,
          },
        };
      }
      userSearchContentArray.push(userSearchContent);
    })
  );

  return userSearchContentArray;
};
