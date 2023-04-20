import amqp from 'amqp-connection-manager';
import dotenv from 'dotenv';
import amqplib from 'amqplib';
import logger from '../config/logger.config';
dotenv.config();

export const createProducer = async (key: string, msg: string) => {
  try {
    const rabbitConn = process.env.RABBITMQ_CONN;
    const opt = {
      credentials: amqplib.credentials.plain(
        process.env.RABBIT_USERNAME || '',
        process.env.RABBIT_PASSWORD || ''
      ),
    };

    if (!rabbitConn) {
      return;
    }

    const connection = amqp.connect([rabbitConn], { connectionOptions: opt });
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel: {
        assertQueue: (arg0: string, arg1: { durable: boolean; Ack: boolean }) => void;
      }) {
        channel.assertQueue(key, { durable: false, Ack: true });
        return;
      },
    });
    await channelWrapper.sendToQueue(key, msg).catch(function (err) {
      return logger.log(err);
    });
  } catch (error) {
    logger.error(error);
  }
};

export const createConsumer = async (queuekey: string) => {
  try {
    const rabbitConn = process.env.RABBITMQ_CONN;
    const opt = {
      credentials: amqplib.credentials.plain(
        process.env.RABBIT_USERNAME || '',
        process.env.RABBIT_PASSWORD || ''
      ),
    };

    if (!rabbitConn) return;
    const connection = amqp.connect([rabbitConn], { connectionOptions: opt });
    const channelWrapper = connection.createChannel({
      json: true,
      setup: function (channel: {
        assertQueue: (arg0: string, arg1: { durable: boolean; Ack: boolean }) => void;
      }) {
        channel.assertQueue(queuekey, { durable: false, Ack: true });
        return;
      },
    });
    return Promise.all([
      channelWrapper.assertQueue(queuekey, { exclusive: true, autoDelete: true }),
      channelWrapper.bindQueue(queuekey, 'my-exchange', 'create'),
      channelWrapper.consume(queuekey, async (msg) => {
        const message = msg.content.toString();
      }),
    ]);
  } catch (error) {
    logger.error(error);
  }
};
