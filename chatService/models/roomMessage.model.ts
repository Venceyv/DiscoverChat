/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-23 10:05:51
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @LastEditTime: 2023-04-24 09:11:18
=======
 * @LastEditTime: 2023-03-30 17:17:16
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
 * @FilePath: \discoverChat\models\message.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
const { Schema } = mongoose;

const roomMessageSchema = new Schema({
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
  room:{
    type:String,
    required:true,
    immutable:true,
    ref:"room"
  },
});
export { roomMessageSchema };