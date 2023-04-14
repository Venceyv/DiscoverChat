/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-19 07:50:13
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 17:38:51
 * @FilePath: \discoverChat\services\chatMq.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import amqp from "amqp-connection-manager";
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
      
  } catch (error) {
    rabbitMqLogger.error(error);
  }
};

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

