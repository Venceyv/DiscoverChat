/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-20 03:00:06
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-06 17:57:45
 * @FilePath: \discoverChat\services\queue.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { redisRoom } from "../configs/redis.config";

export const saveMessage = async (key:any, message:any) => {
  try {
    message = JSON.stringify(message);
    await redisRoom.rpush(key, message);
    const length = await redisRoom.llen(key);
    if(length>30){
      await redisRoom.lpop(key);
    }
  } catch (error) {
    console.log({ error: error });
  }
};

export const retriveMessage = async (key:any) => {
  try {
    if(!redisRoom.exists(key)) return [];
    const messages = await redisRoom.lrange(key, 0, -1);
    return messages;
  } catch (error) {
    console.log({ error: error });
  }
};

export const clearList = async (key:any)=>{
  try {
    await redisRoom.del(key);
  } catch (error) {
    console.log({ error: error });
  }
}
export const removeFromList = async (key:any,element:any)=>{
  try {
    const messages = await redisRoom.lrange(key, 0, -1);
    messages.map((val)=>{
      const ele = JSON.parse(val);
      if(ele._id == element._id) redisRoom.lrem(key,0,val);
    });
  } catch (error) {
    console.log(error);
  }
}
export const updateToList = async (key:any,message:any,newContent:any)=>{
  try {
    const messages = await redisRoom.lrange(key, 0, -1);
    messages.forEach((ele,index,list)=>{
      const eleObject = JSON.parse(ele);
      if(eleObject._id == message._id){
        eleObject.content = newContent;
        const newMessage = JSON.stringify(eleObject);
        redisRoom.lset(key,index,newMessage);
      }
    });
  } catch (error) {
    console.log(error);
  }
}