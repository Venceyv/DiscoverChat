import { DiscoverUserContentJson } from "./discover.interface";

/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-05-03 05:58:51
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 05:58:59
 * @FilePath: \discoveryChat(V1)\interfaces\list.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEe
 */
export interface List{
    elementType:"list",
    items:DiscoverUserContentJson[]
}