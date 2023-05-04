/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-10 22:44:44
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 02:33:03
 * @FilePath: \discoveryChat(V1)\controllers\discover.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { discoverLogger } from "../configs/logger.config";
import { redisFriendList } from "../configs/redis.config";
import { Request, Response } from "express";
import { getDiscoverPageJson, getMightBeFriendList, getDiscoverUserContentJson, getSearchUserContentJson } from "../services/discover.service";
import { getUserData } from "../services/chatMq.service";
import { RecommandUserResourceRequestType, SearchUserResourceRequestType } from "../interfaces/request.interface";
import { sendRequest } from "../services/request.service";
import { user } from "../interfaces/data.Interface";
import { DiscoverPageJson } from "../interfaces/discover.interface";
export const getDiscoverPage = async (req: Request, res: Response) => {
  try {
    const discoverPageAPI = `../discover/discoverPage`;
    const chatListAPI = `../chatList`;
    const requesterID = req.body.user._id;
    const query = req.body.q;
    const selfProfileAPI = `../user/${requesterID}`;
    let userData, userContentJson;
    if (query == undefined) {
      const friendList = await redisFriendList.lrange(requesterID, 0, -1);
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
      userContentJson = await getDiscoverUserContentJson(userData as user[], requesterID as string);
    } else {
      const request: SearchUserResourceRequestType = {
        resource: "users",
        type: "search",
        fulFill: false,
        userId: requesterID,
        others: [],
        searchParam: query as string,
      };
      const userData = await getUserData(request);
      userContentJson = await getSearchUserContentJson(userData as user[], requesterID as string);
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
