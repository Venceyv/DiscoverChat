/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-23 10:05:51
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-24 09:11:18
 * @FilePath: \discoverChat\models\message.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
const { Schema } = mongoose;

const roomMessageSchema = new Schema({
  content: {
    type: String,
    required:true
  },
  timeStamp:{
    type:Date,
    default:Date.now,
  },
  sender:{
    type:String,
    required:true,
  },
  room:{
    type:String,
    required:true,
    immutable:true,
    ref:"room"
  },
});
export { roomMessageSchema };