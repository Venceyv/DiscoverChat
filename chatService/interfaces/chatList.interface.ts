import { Metadata } from "@google-cloud/storage/build/src/nodejs-common";
import { ButtonGroup } from "./buttonGroup.interface";
import { Divider } from "./divider.interface";
import { ToolBar } from "./toolBar.interface";
import { ChatListContent } from "./chat.interfaces";

/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-28 11:09:37
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 19:23:27
 * @FilePath: \discoveryChat(V1)\interfaces\chatList.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface ChatListPageJson {
  content: (Divider|ToolBar|ChatListContent|ButtonGroup)[];
  metadata:Metadata,
  contentContainerWidth: "narrow";
}
