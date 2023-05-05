/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-10 22:44:44
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 14:18:56
 * @FilePath: \discoveryChat(V1)\controllers\discover.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { discoverLogger } from "../configs/logger.config";
import { Request, Response } from "express";
import { getDiscoverPageJson, getDiscoverUserContentJson, getSearchUserContentJson } from "../services/discover.service";
import { user } from "../interfaces/data.Interface";
import { DiscoverPageJson } from "../interfaces/discover.interface";
import { User } from "../models/index.model";
export const getDiscoverPage = async (req: Request, res: Response) => {
  try {
    const discoverPageAPI = `../discover/discoverPage`;
    const chatListAPI = `../chatList`;
    const requesterID = req.body.user._id;
    const query = req.body.q;
    const selfProfileAPI = `../user/${requesterID}`;
    let userData, userContentJson;
    if (query == undefined) {
      userData = await User.find({}) as user[];
      userData = userData.filter(e=>e._id!=requesterID);
      userContentJson = await getDiscoverUserContentJson(userData as user[], requesterID as string);
    } else {
      userData = await User.find({}) as user[];
      userData = userData.filter((user)=>{
        const keyword = query.toLowerCase();
        return (user.lastName.toLowerCase() == keyword||user.firstName.toLowerCase() == keyword);
      })
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
