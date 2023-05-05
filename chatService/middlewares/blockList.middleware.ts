import { NextFunction, Request, Response } from "express"
import { globalLogger } from "../configs/logger.config"
import { inList } from "../services/blockList.service";
import { APIError, errorHandler } from "./error.middleware";

export const checkIfInBlockList =async (req:Request,res:Response,next:NextFunction) => {
    try {
        const requesterId = req.body.user._id;
        const userId = req.params.userId;
        const [exist,inBlock]= await Promise.all([
            inList(requesterId,userId),
            inList(userId,requesterId)
        ]);        
        if(exist||inBlock){
            const error = new APIError(401,'unauthorize');
            throw error;
        }
        return next();
    } catch (error) {
        errorHandler(error,req,res);
        globalLogger.error(error);
    }
}