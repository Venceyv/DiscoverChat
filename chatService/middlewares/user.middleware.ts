import { NextFunction, Request, Response } from "express";
import { globalLogger } from "../configs/logger.config";
import { User } from "../models/index.model";
import { APIError, errorHandler } from "./error.middleware";

export const checkUserExist =async (req:Request,res:Response,next:NextFunction) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if(!user){
            const error = new APIError(404,'user does not exist');
            throw error;
        }
        req.body.paramUser = user;
        return next();
    } catch (error) {
        errorHandler(error,req,res);
        globalLogger.error(error);
    }
}