/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-23 10:06:15
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
<<<<<<< HEAD
 * @LastEditTime: 2023-04-24 12:13:18
=======
 * @LastEditTime: 2023-03-26 08:04:38
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
 * @FilePath: \discoverChat\models\group.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
<<<<<<< HEAD
import vars from "../configs/vars.config";
=======
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
const { Schema } = mongoose;

const groupSchema = new Schema({
  avatar:{
    type:String,
<<<<<<< HEAD
    default:vars.group.picUrl
=======
    required:true,
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  },
  name:{
    type: String,
    required:true,
  },
<<<<<<< HEAD
=======
  groupOwner:{
    type: String,
    required: true, 
    unique: true,
  },
  numberPeople: {
    type: Number,
    default:2,
  },
>>>>>>> d8e83b038d42dd6c4c51a9c49b48ca21b3e566e7
  lastActivity:{
    type:Date,
    default:Date.now,
  },
});
export { groupSchema };