/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-27 17:09:30
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-29 21:24:37
 * @FilePath: \discoverChat\routers\chat.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Router} from "express";
import {  deleteRoom, getDeleteRoom, getNewRoom, getRoomMessage, getRoomPage, newRoom, sentToRoom } from "../controllers/chatRoom.controller";
import {  checkIfFriends } from "../middlewares/room.middleware";
import { verifyUser } from "../services/jwt.service";
import { checkUserExist } from "../middlewares/user.middleware";
import { checkIfInBlockList } from "../middlewares/blockList.middleware";
const chatRoomRouter = Router();

chatRoomRouter.get('/:userId',verifyUser,checkUserExist,checkIfInBlockList,checkIfFriends,getRoomPage);
chatRoomRouter.get('/add/:userId',verifyUser,checkUserExist,checkIfInBlockList,getNewRoom);
chatRoomRouter.get('/delete/:userId',verifyUser,checkUserExist,getDeleteRoom);
chatRoomRouter.get('/message/:userId',verifyUser,checkUserExist,checkIfInBlockList,checkIfFriends,getRoomMessage);
chatRoomRouter.post('/:userId',verifyUser,checkUserExist,checkIfInBlockList,newRoom);
chatRoomRouter.post('/newMessage/:userId',verifyUser,checkUserExist,checkIfInBlockList,checkIfFriends,sentToRoom);
chatRoomRouter.delete('/:userId',verifyUser,checkUserExist,checkIfFriends,deleteRoom);
export {chatRoomRouter}
