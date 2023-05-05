/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-27 17:09:30
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 11:43:21
 * @FilePath: \discoverChat\routers\chat.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Router } from "express";
import {
  getFriendListToMakeGroup,
  getGroupPage,
  getGroupMessage,
  getMakeGroupPage,
  inviteToGroup,
  leaveGroup,
  newGroup,
  removeFromGroup,
  sentToGroup,
  getGroupMemberPage,
  getLeaveGroup,
} from "../controllers/chatGroup.controller";
import { checkGroupExist, checkIfInTheGroup } from "../middlewares/group.middleware";
import { verifyUser } from "../services/jwt.service";
import { checkUserExist } from "../middlewares/user.middleware";
import { checkIfInBlockList } from "../middlewares/blockList.middleware";
const chatGroupRouter = Router();

chatGroupRouter.get('/friendList',verifyUser,getFriendListToMakeGroup);
chatGroupRouter.get('/makeGroupPage',verifyUser,getMakeGroupPage);
chatGroupRouter.get("/:groupId", verifyUser, checkGroupExist, getGroupPage);
chatGroupRouter.get("/message/:groupId", verifyUser, checkGroupExist, checkIfInTheGroup, getGroupMessage);
chatGroupRouter.get("/memberPage/:groupId", verifyUser, checkGroupExist, checkIfInTheGroup, getGroupMemberPage);
chatGroupRouter.get("/leaveGroup/:groupId", verifyUser, checkGroupExist, checkIfInTheGroup, getLeaveGroup);
chatGroupRouter.post("/:userId", verifyUser,checkUserExist,checkIfInBlockList, newGroup);
chatGroupRouter.post("/newMember/:groupId/:userId", verifyUser, checkGroupExist,checkIfInBlockList, inviteToGroup); 
chatGroupRouter.post("/newMessage/:groupId", verifyUser, checkGroupExist, checkIfInTheGroup, sentToGroup);

chatGroupRouter.delete(
  "/removeUser/:groupId/:userId",
  verifyUser,
  checkGroupExist,
  checkIfInTheGroup,
  removeFromGroup
);
chatGroupRouter.delete("/leaveGroup/:groupId", verifyUser, checkGroupExist, checkIfInTheGroup, leaveGroup);

export { chatGroupRouter };
