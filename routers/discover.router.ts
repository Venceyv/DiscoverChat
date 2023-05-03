/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-11 00:01:21
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 01:07:08
 * @FilePath: \discoveryChat(ts)\routers\discover.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Router} from "express";
import { getDiscoverPage, searchUser } from "../controllers/discover.controller";
import { verifyUser } from "../services/jwt.service";
const discoverRouter = Router();
discoverRouter.get('/search',verifyUser,searchUser);
discoverRouter.get('/discoverPage',verifyUser,getDiscoverPage);
discoverRouter.post('/discoverPage',verifyUser,getDiscoverPage);
export {discoverRouter}
