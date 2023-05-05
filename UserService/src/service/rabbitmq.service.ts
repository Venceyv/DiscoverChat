export interface UserResourceRequestType {
  resource: 'users';
  type: 'self' | 'others';
  userId: string;
  others: string[];
}

export interface UserResponseType {
  resource: 'users';
  userId: string;
  type: 'self' | 'others';
  data: unknown[] | null; //TODO
}

/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-06 17:56:12
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-20 01:26:49
 * @FilePath: \discoveryChat\services\chatMq.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-19 07:50:13
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 17:38:51
 * @FilePath: \discoverChat\services\chatMq.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import amqp from 'amqp-connection-manager';
import dotenv from 'dotenv';
import { Channel } from 'amqplib';
import User from '../model/user.model';
dotenv.config();
import amqplib from 'amqplib';
import logger from '../config/logger.config';
const rabbitConn = process.env.RABBITMQ_CONN;
const discoverQKey = process.env.RBBITMQ_DISCOVER_QUEUE;

const opt = {
  credentials: amqplib.credentials.plain(
    process.env.RABBIT_USERNAME || '',
    process.env.RABBIT_PASSWORD || ''
  ),
};
export const connection = amqp.connect(rabbitConn, { connectionOptions: opt });

export const createProducer = async (
  queuekey: string,
  msg: UserResponseType | null | undefined
) => {
  try {
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel: Channel) {
        return channel.assertQueue(queuekey, {
          autoDelete: queuekey != discoverQKey,
          durable: queuekey == discoverQKey,
        });
      },
    });
    await channelWrapper.sendToQueue(queuekey, msg).catch(function (err) {
      logger.error(err);
    });
    channelWrapper.close();
  } catch (error) {
    logger.error(error);
  }
};

export const createConsumer = async (queuekey: string, callBack: any) => {
  try {
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel: Channel) {
        return channel.assertQueue(queuekey);
      },
    });
    const queueInfo = await channelWrapper.assertQueue(queuekey);
    channelWrapper
      .consume(
        queuekey,
        async (msg) => {
          console.log('received');
          callBack(msg, channelWrapper);
        },
        { noAck: false }
      )
      .catch((err) => {
        console.log('errored');
        logger.error(err);
      })
      .finally(() => channelWrapper.close());
    // }
  } catch (error) {
    logger.error(error);
  }
};

// get user RMQ
export async function getUserRMQ(
  requestObject: UserResourceRequestType | string
): Promise<UserResponseType | null | undefined> {
  const { resource, type, userId, others } = JSON.parse(requestObject as string); // see if need to stringify
  const responseObject: UserResponseType = {
    resource: resource,
    userId: userId,
    type: type,
    data: null,
  };
  try {
    if (type === 'self') {
      const data = await User.findById(userId).exec();
      if (!data) return null;

      responseObject.data = [data];
    }

    if (type === 'others') {
      const data = await User.find({ _id: { $in: others } }).exec();
      if (data.length === 0) return null;

      responseObject.data = data;
    }

    return responseObject;
  } catch (err) {
    logger.error(err);
  }
}
