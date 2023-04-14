/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-13 05:13:34
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 05:23:17
 * @FilePath: \discoveryChat\configs\vars.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dotenv from 'dotenv';

dotenv.config();

export default {
  serverPort: parseInt(process.env.PORT || '3000'),
  mongoUrl: process.env.DATABASE_URL || '',
  nodeEnvironment: process.env.NODE_ENVIRONMENT,
  redisRoom: {
    port: process.env.REIDS_PORT_ROOM || '',
    host: process.env.REDIS_HOST_ROOM || '',
    password:process.env.REDIS_PASSWORD_ROOM
  },
  redisGroup: {
    port: process.env.REIDS_PORT_GROUP || '',
    host: process.env.REDIS_HOST_GROUP || '',
    password:process.env.REDIS_PASSWORD_GROUP
  },
  redisFriendList: {
    port: process.env.REDIS_PORT_FRIENDLIST || '',
    host: process.env.REDIS_HOST_FRIENDLIST || '',
    password:process.env.REDIS_PASSWORD_FRIENDLIST
  },
  googleCloud: {
    bucketName: process.env.GCS_BUCKET_NAME || '',
    projectId: process.env.GCLOUD_PROJECT_ID || '',
    email: process.env.GCLOUD_CLIENT_EMAIL || '',
    key: process.env.GCLOUD_PRIVATE_KEY || '',
  },
  rabbitMq:{
    connUrl:process.env.RABBITMQ_CONN,
    userName:process.env.RABBIT_USERNAME,
    password:process.env.RABBIT_PASSWORD
  }
};