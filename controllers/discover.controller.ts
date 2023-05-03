/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-10 22:44:44
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 01:14:03
 * @FilePath: \discoveryChat(V1)\controllers\discover.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { discoverLogger } from "../configs/logger.config";
import { redisFriendList } from "../configs/redis.config";
import { Request, Response } from "express";
import {
  getDiscoverPageJson,
  getMightBeFriendList,
  getDiscoverUserContentJson,
} from "../services/discover.service";
import { getUserData } from "../services/chatMq.service";
import vars from "../configs/vars.config";
import { RecommandUserResourceRequestType, SearchUserResourceRequestType } from "../interfaces/request.interface";
import { sendRequest } from "../services/request.service";
import { user } from "../interfaces/data.Interface";
import { DiscoverPageJson } from "../interfaces/discover.interface";
// export const getRecommand = async (req: Request, res: Response) => {
//   try {
//     const userId = req.body.user._id;
//     const query =  req.query.q;    
//     let userData;
//     const targetId = "recommandedList";
//     if (query == undefined) {
//       const friendList = await redisFriendList.lrange(userId, 0, -1);
//       if (friendList.length != 0) {
//         const mightBeFriendList = await getMightBeFriendList(userId, friendList);
//         const request: RecommandUserResourceRequestType = {
//           resource: "users",
//           type: "notSearch",
//           fulFill: true,
//           userId: userId,
//           others: mightBeFriendList!,
//           friendList: friendList!,
//         };
//         await sendRequest(request);
//         userData = (await getUserData(request)) as user[];
//       } else {
//         return res
//           .status(200)
//           .json("Woo, looks like you have made friend with everybody in discoverChat already! Incredible!");
//       }
//       const recommandJson = await getDiscoverUserContentJson(userData as user[], userId as string, targetId as string);
//       return res.status(200).json(recommandJson);
//     } else {
//       const getRecommandAPI = `../discover/search?q=${query}`;
//       const discoverPageAPI = `../discover/discoverPage`;
//       const chatListAPI = `../chatList/page`;
//       const requesterID = req.body.user._id;
//       const selfProfileAPI = `${vars.userServer.url}/${requesterID}`;
//       const discoverPageJson: DiscoverPageJson = getDiscoverPageJson(
//         getRecommandAPI,
//         discoverPageAPI,
//         chatListAPI,
//         selfProfileAPI
//       );
//       res.status(200).json(discoverPageJson);
//     }
//   } catch (error) {
//     discoverLogger.error(error);
//   }
// };
export const getDiscoverPage = async (req: Request, res: Response) => {
  try {
    const discoverPageAPI = `../discover/discoverPage`;
    const chatListAPI = `../chatList/page`;
    const requesterID = req.body.user._id;
    const query =  req.body.q;
    const selfProfileAPI = `${vars.userServer.url}/${requesterID}`;
    let userData,userContentJson;
    const targetId = "recommandedList";    
    if (query == undefined) {
      const friendList = await redisFriendList.lrange(requesterID, 0, -1);
      if (friendList.length != 0) {
        const mightBeFriendList = await getMightBeFriendList(requesterID, friendList);
        const request: RecommandUserResourceRequestType = {
          resource: "users",
          type: "notSearch",
          fulFill: true,
          userId: requesterID,
          others: mightBeFriendList!,
          friendList: friendList!,
        };
        await sendRequest(request);
        userData = (await getUserData(request)) as user[];
      } else {
        return res
          .status(200)
          .json("Woo, looks like you have made friend with everybody in discoverChat already! Incredible!");
      }
      userContentJson = await getDiscoverUserContentJson(userData as user[], requesterID as string, targetId as string);
    }else{
      const request: SearchUserResourceRequestType = {
        resource: "users",
        type: "search",
        fulFill: false,
        userId: requesterID,
        others: [],
        searchParam: query as string,
      };
      const userData = await getUserData(request);
      userContentJson = await getDiscoverUserContentJson(
        userData as user[],
        requesterID._id as string,
        targetId
      );
    }
    const discoverPageJson: DiscoverPageJson = getDiscoverPageJson(
      userContentJson,
      discoverPageAPI,
      chatListAPI,
      selfProfileAPI
    );
    res.status(200).json(discoverPageJson);
  } catch (error) {
    discoverLogger.error(error);
  }
};
export const searchUser = async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    const requster = req.body.user;
    const targetId = "recommandedList";
    const request: SearchUserResourceRequestType = {
      resource: "users",
      type: "search",
      fulFill: false,
      userId: requster._id,
      others: [],
      searchParam: query as string,
    };
    const userData = await getUserData(request);
    const searchContentJson = await getDiscoverUserContentJson(
      userData as user[],
      requster._id as string,
      targetId
    );
    return res.status(200).json(searchContentJson);
  } catch (error) {
    discoverLogger.error(error);
  }
};
