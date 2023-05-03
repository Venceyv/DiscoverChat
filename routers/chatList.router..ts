/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-27 17:09:30
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-28 14:07:55
 * @FilePath: \discoverChat\routers\chat.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Router} from "express";
import { ChatListPageJson, getChatList, searchChat } from "../controllers/chatList.controller";
import { verifyUser } from "../services/jwt.service";
const chatListRouter = Router();

chatListRouter.get('/',verifyUser,getChatList);
chatListRouter.get('/search',verifyUser,searchChat);
chatListRouter.get('/page',verifyUser,ChatListPageJson);
export {chatListRouter}
