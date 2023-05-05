/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-06 17:57:52
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-23 21:18:01
 * @FilePath: \discoveryChat(ts)\services\userKey.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const makeKey = (userId:String,roomId:String)=>{
    userId = userId.replace(/['"]+/g, "");
    roomId = roomId.replace(/['"]+/g, "");
    return userId  + ':' + roomId;
}