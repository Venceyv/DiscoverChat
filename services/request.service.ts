import { rabbitMqLogger } from "../configs/logger.config";
import vars from "../configs/vars.config";
import { UserResourceRequestType } from "../interfaces/request.interface";
import { createProducer } from "./chatMq.service";

export const sendRequest =async (request:UserResourceRequestType) => {
    try {
        await createProducer(vars.rabbitMq.disCoverRMQKey,request);
    } catch (error) {
        rabbitMqLogger.error(error)
    }
}