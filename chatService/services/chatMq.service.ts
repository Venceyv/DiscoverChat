/*
 * @Author: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @Date: 2023-04-06 17:56:12
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 02:53:17
 * @FilePath: \discoveryChat\services\chatMq.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: 2FLing 349332929yaofu@gmail.com
=======
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
 * @Date: 2023-03-19 07:50:13
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 17:38:51
 * @FilePath: \discoverChat\services\chatMq.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import amqp from "amqp-connection-manager";
<<<<<<< HEAD
import { rabbitMqLogger } from "../configs/logger.config";
import { Channel } from "amqplib";
import { UserResourceRequestType } from "../interfaces/request.interface";
import vars from "../configs/vars.config";
import { sendRequest } from "./request.service";
import { UserResponseType } from "../interfaces/response.interface";
import { retrieveGlobalData, saveGlobalData } from "./globalData.service";
import { makeKey } from "./userKey.service";
import { user } from "../interfaces/data.Interface";

const opt = {
  credentials: require("amqplib").credentials.plain(process.env.RABBIT_USERNAME, process.env.RABBIT_PASSWORD),
};

export const createProducer = async (queuekey: string, msg: UserResourceRequestType) => {
  try {
    const connection = amqp.connect(vars.rabbitMq.connUrl, { connectionOptions: opt });
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel: Channel) {
        return channel.assertQueue(queuekey, {
          autoDelete: false,
          durable: true,
        });
      },
    });

    await channelWrapper.sendToQueue(queuekey, msg).catch(function (err) {
      rabbitMqLogger.error(err);
    });
    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    rabbitMqLogger.error(error);
  }
};

export const createConsumer = async (
  queuekey: string,
  callBack: Function,
  request: UserResourceRequestType,
) => {
  try {
    const connection = amqp.connect(vars.rabbitMq.connUrl, { connectionOptions: opt });
    let success = false;
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel: Channel) {
        return channel.assertQueue(queuekey);
      },
    });
    while(!success){
      await channelWrapper
      .consume(queuekey, async (msg) => {
        const message = msg.content.toString();
        const msgObj = JSON.parse(message);
        if (
          msgObj.userId.replace(/['"]+/g, "") == request.userId &&
          msgObj.type.replace(/['"]+/g, "") == request.type
        ) {
          success = true;
          channelWrapper.ack(msg);
          await callBack(msgObj);
        }
      })
      .catch((err) => {
        channelWrapper.close();
        rabbitMqLogger.error(err);
      });
      if(!success)await sendRequest(request);
    }
    setTimeout(() => {
      connection.close();
    }, 1000);
=======
import dotenv from "dotenv";
import { rabbitMqLogger } from "../configs/logger.config";
dotenv.config();

export const createProducer = async (key: string, msg: string) => {
  try {
    const rabbitConn = process.env.RABBITMQ_CONN;
    const opt = {
      credentials: require("amqplib").credentials.plain(process.env.RABBIT_USERNAME, process.env.RABBIT_PASSWORD)
    };
    const connection = amqp.connect([rabbitConn], { connectionOptions: opt });
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel: any) {
        channel.assertQueue(key, { durable: false,Ack:true });
        return;
      },
    });
    await channelWrapper
      .sendToQueue(key, msg)
      .catch(function (err) {
        return console.log(err);
      });
      
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  } catch (error) {
    rabbitMqLogger.error(error);
  }
};
<<<<<<< HEAD
export const getUserData =async (request:UserResourceRequestType):Promise<user[]|undefined> => {
  try {
    let userArray:user[] = [];
    await sendRequest(request);
    const key = makeKey(request.userId,request.type);
    await createConsumer(vars.rabbitMq.userRMQKey,async(msg:UserResponseType)=>{
      await saveGlobalData(key,msg.data as user[]);
    },request);
    const userData = await retrieveGlobalData(key);
    if (userData) {
      userArray= JSON.parse(userData as string);
    }
    return userArray;
  } catch (error) {
    rabbitMqLogger.error(error);
  }
}
=======

export const createConsumer = async (queuekey: string) => {
  try {
    const rabbitConn = process.env.RABBITMQ_CONN;
    const opt = {
      credentials: require("amqplib").credentials.plain(process.env.RABBIT_USERNAME, process.env.RABBIT_PASSWORD)
    };
    const connection = amqp.connect([rabbitConn], { connectionOptions: opt });;
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel: any) {
        channel.assertQueue(queuekey, { durable: false,Ack:true });
        return;
      },
    });
    return Promise.all([
      channelWrapper.assertQueue(queuekey, { exclusive: true, autoDelete: true }),
      channelWrapper.bindQueue(queuekey, "my-exchange", "create"),
      channelWrapper.consume(queuekey, async (msg) => {
        const message = msg.content.toString();
        
      }),
    ]);
  } catch (error) {
    rabbitMqLogger.error(error);
  }
};

>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
