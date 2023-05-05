import { Router } from "express";
import { verifyUser } from "../services/jwt.service";
import { blockUser, removeFromBlockList, unBlockUser } from "../controllers/blockList.controller";
import { checkUserExist } from "../middlewares/user.middleware";
const blockListRouter = Router();

blockListRouter.get("/block/:userId", verifyUser,checkUserExist, blockUser);
blockListRouter.get("/unBlock/:userId", verifyUser, checkUserExist,unBlockUser);
blockListRouter.delete("/:userId", verifyUser, checkUserExist,removeFromBlockList);
export { blockListRouter };
