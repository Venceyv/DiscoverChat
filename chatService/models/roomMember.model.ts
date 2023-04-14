/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-24 23:36:36
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-03-24 23:37:08
 * @FilePath: \discoverChat\models\roomMember.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
const { Schema } = mongoose;

const roomMemberSchema = new Schema({
  user:{
    type:String,
    required:true,
  },
  room:{
    type:String,
    required:true,
    immutable:true,
    ref:"room",
  },
});
export { roomMemberSchema };