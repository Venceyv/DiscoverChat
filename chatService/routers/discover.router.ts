/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-11 00:01:21
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-11 00:06:37
 * @FilePath: \discoveryChat(ts)\routers\discover.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Router} from "express";
import { getRecommand } from "../controllers/discover.controller";
const discoverRouter = Router();

discoverRouter.get('/',getRecommand);

export {discoverRouter}
