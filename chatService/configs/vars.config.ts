/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-13 05:13:34
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @LastEditTime: 2023-05-04 10:23:02
 * @FilePath: \discoveryChat\configs\vars.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dotenv from "dotenv";
=======
 * @LastEditTime: 2023-04-13 05:23:17
 * @FilePath: \discoveryChat\configs\vars.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dotenv from 'dotenv';
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7

dotenv.config();

export default {
<<<<<<< HEAD
  server:{
    Port:parseInt(process.env.PORT || "3000"),
    url:process.env.SERVERURL
  },
  userServer:{
    url:process.env.USERSERVERURL
  },
  mongoUrl: process.env.DATABASE_URL || "",
  nodeEnvironment: process.env.NODE_ENVIRONMENT,
  redisRoom: {
    port: process.env.REIDS_PORT_ROOM || "",
    host: process.env.REDIS_HOST_ROOM || "",
    password: process.env.REDIS_PASSWORD_ROOM,
  },
  redisGroup: {
    port: process.env.REIDS_PORT_GROUP || "",
    host: process.env.REDIS_HOST_GROUP || "",
    password: process.env.REDIS_PASSWORD_GROUP,
  },
  redisFriendList: {
    port: process.env.REDIS_PORT_FRIENDLIST || "",
    host: process.env.REDIS_HOST_FRIENDLIST || "",
    password: process.env.REDIS_PASSWORD_FRIENDLIST,
  },
  redisGlobalData: {
    port: process.env.REDIS_PORT_GLOBALDATA || "",
    host: process.env.REDIS_HOST_GLOBALDATA || "",
    password: process.env.REDIS_PASSWORD_GLOBALDATA || "",
  },
  redisBlockList:{
    port: process.env.REDIS_PORT_BLOCK_LIST || "",
    host: process.env.REDIS_HOST_BLOCK_LIST|| "",
    password: process.env.REDIS_PASSWORD_BLOCKLIST || "",
  },
  googleCloud: {
    bucketName: process.env.GCS_BUCKET_NAME || "",
    projectId: process.env.GCLOUD_PROJECT_ID || "",
    email: process.env.GCLOUD_CLIENT_EMAIL || "",
    key: process.env.GCLOUD_PRIVATE_KEY || "",
  },
  rabbitMq: {
    connUrl: process.env.RABBITMQ_CONN || "",
    userName: process.env.RABBIT_USERNAME || "",
    password: process.env.RABBIT_PASSWORD || "",
    disCoverRMQKey: process.env.RBBITMQ_DISCOVER_QUEUE || "",
    userRMQKey: process.env.RBBITMQ_USER_QUEUE || "",
  },
  group:{
    picUrl:process.env.GROUPCHAT_PICURL||"",
  }
};
=======
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
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
