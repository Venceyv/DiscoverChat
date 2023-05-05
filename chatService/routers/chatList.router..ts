/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-27 17:09:30
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @LastEditTime: 2023-05-03 19:37:04
=======
 * @LastEditTime: 2023-04-12 23:34:38
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
 * @FilePath: \discoverChat\routers\chat.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Router} from "express";
<<<<<<< HEAD
import { ChatListPageJson } from "../controllers/chatList.controller";
import { verifyUser } from "../services/jwt.service";
const chatListRouter = Router();
chatListRouter.get('/',verifyUser,ChatListPageJson);
chatListRouter.post('/',verifyUser,ChatListPageJson);
=======
import { getChatList } from "../controllers/chatList.controller";
const chatListRouter = Router();

chatListRouter.get('/',getChatList);

>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
export {chatListRouter}
