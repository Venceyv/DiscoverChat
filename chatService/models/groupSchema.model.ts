/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-23 10:06:15
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-24 12:13:18
 * @FilePath: \discoverChat\models\group.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
import vars from "../configs/vars.config";
const { Schema } = mongoose;

const groupSchema = new Schema({
  avatar:{
    type:String,
    default:vars.group.picUrl
  },
  name:{
    type: String,
    required:true,
  },
  lastActivity:{
    type:Date,
    default:Date.now,
  },
});
export { groupSchema };