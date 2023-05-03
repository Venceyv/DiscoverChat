/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-20 06:28:59
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-28 18:31:07
 * @FilePath: \discoveryChat(chat)\services\userMq.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import { rabbitMqLogger } from "../configs/logger.config";
import { Channel } from "amqplib";
import { RecommandUserResourceRequestType, SearchUserResourceRequestType } from "../interfaces/request.interface";
import vars from "../configs/vars.config";
import { UserResponseType } from "../interfaces/response.interface";
import { User } from "../models/index.model";
import { user } from "../interfaces/data.Interface";

export const createProducer = async (channel: ChannelWrapper, queuekey: string, msg: UserResponseType) => {
  try {
    await channel.sendToQueue(queuekey, msg).catch(function (err) {
      rabbitMqLogger.error(err);
    });
  } catch (error) {
    rabbitMqLogger.error(error);
  }
};

export const createConsumer = async (channel: ChannelWrapper, queuekey: string, callBack: Function) => {
  try {
    await channel
      .consume(queuekey, async (msg) => {
        callBack(msg, channel);
      })
      .catch((err) => {
        channel.close();
        rabbitMqLogger.error(err);
      });
  } catch (error) {
    rabbitMqLogger.error(error);
  }
};
export async function getUserRMQ(
  requestObject: SearchUserResourceRequestType | string
): Promise<UserResponseType | null | undefined> {
  const request = JSON.parse(requestObject as string); // see if need to stringify
  const a = JSON.parse(requestObject as string);
  const responseObject: UserResponseType = {
    resource: request.resource,
    userId: request.userId,
    type: request.type,
    data: null,
  };
  try {
    if (request.type === "notSearch") {
      let data: user[] = [];
      const userData = await Promise.all(
        request.others.map(async (userId: string) => {
          const userData: user | null = await User.findById(userId);
          return userData;
        })
      );
      data = userData;
      if (request.fulFill) {
        const selfUser = await User.findById(request.userId, { majorList: 1 }).lean();
        const usersWithSameMajors: user[] | null = await User.find({ majorList: { $in: selfUser?.majorList } });
        data = data.concat(usersWithSameMajors);
        if (data.length < 10) {
          const userWithDiffMajors: user[] | null = await User.find({ majorList: { $nin: selfUser?.majorList } });
          data = data.concat(userWithDiffMajors);
        }

        data = data.filter(
          (e) => {
            return e._id?.toString() != request.userId;
          }
        );
        if (data.length > 10) data = data.slice(0, 9);
      }
      responseObject.data = data;
    } else if (request.type === "search") {
      //should return an array of users
      const data: any = await User.find({
        $or: [{ lastName: { $in: request.searchParam } }, { firstName: { $in: request.searchParam } }],
      }).exec();
      responseObject.data = data;
    }
    return responseObject;
  } catch (err) {
    rabbitMqLogger.error(err);
  }
}
const opt = {
  credentials: require("amqplib").credentials.plain(process.env.RABBIT_USERNAME, process.env.RABBIT_PASSWORD),
};
const connection = amqp.connect(vars.rabbitMq.connUrl, { connectionOptions: opt });

export const createChannel = (queuekey: string): ChannelWrapper => {
  connection.on("disconnect", () => {
    setInterval(() => {
      connection.reconnect();
    }, 1000);
  });
  return connection.createChannel({
    json: true,
    setup: function (channel: Channel) {
      return channel.assertQueue(queuekey, {
        autoDelete: false,
        durable: true,
      });
    },
  });
};
