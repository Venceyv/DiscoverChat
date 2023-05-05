/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-12 23:30:11
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @LastEditTime: 2023-04-23 20:16:43
=======
 * @LastEditTime: 2023-04-13 06:31:35
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
 * @FilePath: \discoveryChat\middlewares\error.middleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { globalLogger, groupLogger, roomLogger } from '../configs/logger.config';

export class APIError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}
export class ErrorInfo{
  requester:string|undefined;
  relatedId:string|undefined;
  message:string|undefined;
  constructor(message:string,requester:string|undefined,relatedId:string|undefined){
    this.message = message;
    this.requester = requester;
    this.relatedId = relatedId;
  }
}

<<<<<<< HEAD
export const errorHandler = (err: APIError|unknown, req: Request, res: Response, next: NextFunction|null = null) => {
=======
export const errorHandler = (err: APIError|unknown, req: Request, res: Response, next: NextFunction) => {
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  // Custom api error
  if (err instanceof APIError) {
    const relatedId = req.params.roomId?req.params.roomId:req.params.groupId;
    const error = new ErrorInfo(err.message,req.body.requester,relatedId);
    globalLogger.error(JSON.stringify(error));
    const service = err.message.split(':')[0];
    switch (service) {
      case 'roomService':
        roomLogger.error(JSON.stringify(error));
        break;
      default:
        groupLogger.error(JSON.stringify(error));
        break;
    }
    const response = {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
    };
<<<<<<< HEAD
    return res.status(err.statusCode).send(response);
=======
    res.status(err.statusCode).send(response);
    return;
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  }
  // Zod validation error
  if (err instanceof ZodError) {
    globalLogger.error(err.issues);
<<<<<<< HEAD
    return res.status(400).json(err.issues);
  }
  globalLogger.error(err);
  return res.status(500).send({ error: 'Internal Server Error.' });
=======
    res.status(400).json(err.issues);
    return;
  }
  globalLogger.error('Internal Server Error.');
  res.status(500).send({ error: 'Internal Server Error.' });
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
};
