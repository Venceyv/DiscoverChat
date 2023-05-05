/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-23 10:05:51
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-12 23:32:25
 * @FilePath: \discoverChat\models\message.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
const { Schema } = mongoose;

const groupMessageSchema = new Schema({
  content: {
    type: String,
<<<<<<< HEAD
    required:true
=======
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  },
  timeStamp:{
    type:Date,
    default:Date.now,
  },
  sender:{
    type:String,
    required:true,
  },
  group:{
    type:String,
    required:true,
    immutable:true,
    ref:"group",
  },
});
export { groupMessageSchema };