/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-27 17:09:30
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-06 17:50:43
 * @FilePath: \discoverChat\routers\chat.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Router } from "express";
import {
  chatHistory,
  deleteGroup,
  editGroup,
  editGroupMessage,
  getGroupMessage,
  groupMember,
  inviteToGroup,
  leaveGroup,
  newGroup,
  recallGroupMessage,
  removeFromGroup,
  sentToGroup,
} from "../controllers/chatGroup.controller";
import { checkGroupExist, checkIfGroupOwner, checkIfInTheGroup } from "../middlewares/group.middleware";
import { checkAuth } from "../middlewares/group.middleware";
const chatGroupRouter = Router();

chatGroupRouter.get("/message/:groupId", checkGroupExist, checkIfInTheGroup, getGroupMessage);
chatGroupRouter.get("/member/:groupId", checkGroupExist, checkIfInTheGroup, groupMember);
chatGroupRouter.get("/history/:groupId", checkGroupExist, checkIfInTheGroup, chatHistory);
chatGroupRouter.post("/newGroup", newGroup);
chatGroupRouter.post("/newMember/:groupId", checkGroupExist, checkIfGroupOwner, inviteToGroup);
chatGroupRouter.post("/newMessage/:groupId", checkGroupExist, checkIfInTheGroup, sentToGroup);
chatGroupRouter.put("/:groupId", checkGroupExist, checkIfGroupOwner, editGroup);
chatGroupRouter.put("/message/:groupId/:messageId", checkGroupExist, checkIfInTheGroup, checkAuth, editGroupMessage);
chatGroupRouter.delete("/:groupId", checkGroupExist, checkIfGroupOwner, deleteGroup);
chatGroupRouter.delete("/removeUser/:groupId/:userId", checkGroupExist, checkIfGroupOwner, removeFromGroup);
chatGroupRouter.delete("/leaveGroup/:groupId", checkGroupExist, checkIfInTheGroup, leaveGroup);
chatGroupRouter.delete(
  "/message/:groupId/:messageId",
  checkGroupExist,
  checkIfInTheGroup,
  checkAuth,
  recallGroupMessage
);

export { chatGroupRouter };
