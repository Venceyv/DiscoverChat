/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-02-23 10:06:47
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-19 21:37:59
 * @FilePath: \discoverChat\models\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import mongoose from "mongoose";
import { groupMemberSchema } from "./groupMember.model";
import { groupSchema } from "./groupSchema.model";
import { roomMessageSchema } from "./roomMessage.model";
import { groupMessageSchema } from "./groupMessage.model";
import { userSchema } from "./user.model";


export const Group = mongoose.model("group", groupSchema);

export const RoomMessage = mongoose.model("roomMessage", roomMessageSchema);

export const User = mongoose.model('User', userSchema);

export const GroupMember = mongoose.model("groupMember",groupMemberSchema);

export const GroupMessage = mongoose.model("groupMessage", groupMessageSchema);

