/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-07 14:22:22
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-12 23:36:02
 * @FilePath: \discoveryChat\services\friendList.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { redisFriendList } from "../configs/redis.config"

export const saveToFriendList = async(user1:string,user2:string)=>{
    try {
        const key = user1 + ':' +user2;
        await Promise.all(
            [
                redisFriendList.lpush(user1,user2),
                redisFriendList.hset(key,'friend','1')
            ]
        );
    } catch (error) {
        console.log(error);
    }
}
export const retriveFriendList = async (user:string) => {
    try {
        const friendList = await redisFriendList.lrange(user,0,-1);
        return friendList;
    } catch (error) {
        console.log(error);
    }
}
export const deleteFromFriendList =async (user1:string,user2:string)=> {
    try {
        const key = user1 + ':' +user2;
        await Promise.all(
            [
                redisFriendList.lrem(user1,0,user2),
                redisFriendList.hdel(key,'friend')
            ]
        );
    } catch (error) {
        console.log(error);
    }
}
export const isFriends =async (user1:string,user2:string) => {
    try {
        const key = user1 + ':' + user2;
        const record = await redisFriendList.hget(key,'friend');
        return (record != null);
    } catch (error) {
        console.log(error);
    }
}