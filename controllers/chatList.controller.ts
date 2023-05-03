/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-06 17:52:38
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-29 20:56:27
 * @FilePath: \discoveryChat(ts)\controllers\chatList.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { chatListLogger } from "../configs/logger.config";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { DiaLogue } from "../interfaces/data.Interface";
import { getChatListPageJson, getUserChatList } from "../services/chatList.service";
import vars from "../configs/vars.config";
dotenv.config();
export const getChatList = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user._id;    
    let chats: DiaLogue[] | undefined = (await getUserChatList(userId, "byTime")) as DiaLogue[] | undefined;
    return res.status(200).json(chats);
  } catch (error) {
    chatListLogger.error(error);
  }
};
export const searchChat = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user._id;
    const query = req.query.q;
    const chats = (await getUserChatList(userId, "bySearch", query as string)) as DiaLogue[] | undefined;
    res.status(200).json(chats);
  } catch (error) {
    chatListLogger.error(error);
  }
};
export const ChatListPageJson = async (req: Request, res: Response) => {
  try {
    const requester = req.body.user;
    const friendListAddGroupApi = `../group/friendList`;
    const getChatListApi = `../chatList`;
    const getDiscoverPageApi = `../discover/discoverPage`;
    const getSelfProfileApi = `${vars.userServer.url}/${requester._id}`;
    const getChatListPageApi = `../chatList/page`;
    const chatlistPageJson = getChatListPageJson(
      friendListAddGroupApi,
      getChatListApi,
      getDiscoverPageApi,
      getSelfProfileApi,
      getChatListPageApi
    );
    res.status(200).json(chatlistPageJson);
  } catch (error) {
    chatListLogger.error(error);
  }
};
