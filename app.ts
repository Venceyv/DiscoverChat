import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { toolsRouter } from "./routers/tool.router";
import { chatRoomRouter } from "./routers/chatRoomRouter.router";
import { chatGroupRouter } from "./routers/chatGroup.router";
import { chatListRouter } from "./routers/chatList.router.";
import { discoverRouter } from "./routers/discover.router";
import { APIError, errorHandler } from "./middlewares/error.middleware";
import { globalLogger } from "./configs/logger.config";
import cookieParser from "cookie-parser";
import { loginUserRouter } from "./routers/loginUser.router";
export const app = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/login',loginUserRouter);
app.use("/room", chatRoomRouter);
app.use("/tools", toolsRouter);
app.use('/group',chatGroupRouter);
app.use('/chatList',chatListRouter);
app.use('/discover',discoverRouter);
app.use(express.json());
app.use((req,res,next)=>{
  const error = new APIError(404,'Invalid source path.');
  globalLogger.error(error);
});

app.use(errorHandler);