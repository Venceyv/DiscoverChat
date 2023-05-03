/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-03-20 02:07:43
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-23 06:57:48
 * @FilePath: \discoverChat\configs\redis.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Redis from "ioredis";
import vars from '../configs/vars.config';
export const redisRoom = new Redis(Number(vars.redisRoom.port), vars.redisRoom.host, {
  password: vars.redisRoom.password,
});
export const redisGroup = new Redis(Number(vars.redisGroup.port), vars.redisGroup.host, {
  password: vars.redisGroup.password,
});
export const redisFriendList = new Redis(Number(vars.redisFriendList.port),vars.redisFriendList.host,{
  password: vars.redisFriendList.password,
})

export const redisGlobalData = new Redis(Number(vars.redisGlobalData.port),vars.redisGlobalData.host,{
  password:vars.redisGlobalData.password,
})