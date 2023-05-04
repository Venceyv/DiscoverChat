/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-05-03 03:12:28
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 22:30:16
 * @FilePath: \discoveryChat(V1)\interfaces\room.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ButtonGroup } from "./buttonGroup.interface";
import { Container } from "./container.interface";
import { Divider } from "./divider.interface";
import { Form } from "./loginForm.interface";
import { ToolBar } from "./toolBar.interface";


export interface RoomPageJson {
  content: (Divider|Form|Container|ButtonGroup|ToolBar) [];
  metadata: {
    version: "2.0";
  };
  contentContainerWidth: "narrow";
}
