/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-05-04 10:24:33
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-04 11:57:38
 * @FilePath: \discoveryChat(V1)\services\blockList.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { redisBlockList } from "../configs/redis.config";

export const addToList = async (key:string, userId:string) => {
  try {
    await redisBlockList.rpush(key, userId);
  } catch (error) {
    console.log({ error: error });
  }
};

export const inList = async (key:string,userId:string) => {
  try {
    const usersInList = await redisBlockList.lrange(key,0,-1);
    return usersInList.includes(userId);
  } catch (error) {
    console.log({ error: error });
  }
};


export const removeFromList = async (key:string,userId:string)=>{
  try {
    const messages = await redisBlockList.lrange(key, 0, -1);
    messages.map((val)=>{
      if(val == userId) redisBlockList.lrem(key,0,val);
    });
  } catch (error) {
    console.log(error);
  }
}