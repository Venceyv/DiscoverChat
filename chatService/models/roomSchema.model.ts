/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-23 10:07:16
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-03-24 23:36:10
 * @FilePath: \discoverChat\models\room.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
const { Schema } = mongoose;

const roomSchema = new Schema({
  avatar:{
    type:String,
    required:true,
  },
  name:{
    type:String,
    required:true,
  },
  lastActivity:{
    type:Date,
    default:Date.now,
  },
});
export { roomSchema };