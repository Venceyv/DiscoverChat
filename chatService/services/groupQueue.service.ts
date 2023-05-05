/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-20 03:00:06
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @LastEditTime: 2023-04-26 19:45:44
=======
 * @LastEditTime: 2023-04-06 22:09:06
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
 * @FilePath: \discoverChat\services\queue.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { redisGroup } from "../configs/redis.config";
<<<<<<< HEAD
import { groupMessage, groupMessageData, roomMessage } from "../interfaces/data.Interface";

export const saveMessage = async (key:string, message:groupMessageData) => {
  try {
    const stringifiedMessage = JSON.stringify(message);
    await redisGroup.rpush(key, stringifiedMessage);

=======

export const saveMessage = async (key:any, message:any) => {
  try {
    message = JSON.stringify(message);
    await redisGroup.rpush(key, message);
    const length = await redisGroup.llen(key);
    if(length>30){
      await redisGroup.lpop(key);
    }
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  } catch (error) {
    console.log({ error: error });
  }
};

<<<<<<< HEAD
export const retriveMessage = async (key:string):Promise<Array<string>|undefined> => {
=======
export const retriveMessage = async (key:any) => {
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  try {
    if(!redisGroup.exists(key)) return [];
    const messages = await redisGroup.lrange(key, 0, -1);
    return messages;
  } catch (error) {
    console.log({ error: error });
  }
};

<<<<<<< HEAD
export const clearList = async (key:string)=>{
=======
export const clearList = async (key:any)=>{
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  try {
    await redisGroup.del(key);
  } catch (error) {
    console.log({ error: error });
  }
}
<<<<<<< HEAD
export const removeFromList = async (key:string,message:groupMessage)=>{
=======
export const removeFromList = async (key:any,element:any)=>{
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  try {
    const messages = await redisGroup.lrange(key, 0, -1);
    messages.map((val)=>{
      const ele = JSON.parse(val);
<<<<<<< HEAD
      if(ele._id == message._id) redisGroup.lrem(key,0,val);
=======
      if(ele._id == element._id) redisGroup.lrem(key,0,val);
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
    });
  } catch (error) {
    console.log(error);
  }
}
<<<<<<< HEAD
export const updateToList = async (key:string,message:groupMessage,newContent:string)=>{
=======
export const updateToList = async (key:any,message:any,newContent:any)=>{
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  try {
    const messages = await redisGroup.lrange(key, 0, -1);
    messages.forEach((ele,index,list)=>{
      const eleObject = JSON.parse(ele);
      if(eleObject._id == message._id){
        eleObject.content = newContent;
        const newMessage = JSON.stringify(eleObject);
        redisGroup.lset(key,index,newMessage);
      }
    });
  } catch (error) {
    console.log(error);
  }
}