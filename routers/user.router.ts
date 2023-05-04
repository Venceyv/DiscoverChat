/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-05-04 02:05:12
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 02:27:15
 * @FilePath: \discoveryChat(V1)\routers\user.router.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Router } from "express";
import { verifyUser } from "../services/jwt.service";
import { getUser } from "../controllers/user.controller";

const userRouter = Router();
userRouter.get('/:userId',verifyUser,getUser);
  export{userRouter};