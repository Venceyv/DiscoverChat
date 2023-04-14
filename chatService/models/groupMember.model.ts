/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-23 12:31:54
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 01:51:57
 * @FilePath: \discoverChat\models\groupMember.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
const { Schema } = mongoose;

export const groupMemberSchema = new Schema({
  user:{
    type:String,
    required:true,
  },
  group:{
    type:String,
    ref:"group",
    required:true,
    immutable:true,
  },
});