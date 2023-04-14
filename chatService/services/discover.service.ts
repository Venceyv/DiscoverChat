/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-11 00:50:30
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-12 23:35:56
 * @FilePath: \discoveryChat\services\discover.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { redisFriendList } from "../configs/redis.config";
import { isFriends } from "./friendList.service";

export const getMightBeFriendList = async (user1: string, userList: Array<string>) => {
  try {
    const friendList = await redisFriendList.lrange(user1, 0, -1);
    const mightBeFriendList = userList.filter((user) => friendList.some((friend) => isFriends(friend, user)));
    return mightBeFriendList;
  } catch (error) {
    console.log(error);
  }
};
