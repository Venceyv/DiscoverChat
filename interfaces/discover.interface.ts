/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-27 10:32:20
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 02:04:38
 * @FilePath: \discoveryChat(V1)\interfaces\discover.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Container } from "winston";
import { Button } from "./Button.interface";
import { ButtonGroup } from "./buttonGroup.interface";
import { Divider } from "./divider.interface";
import { Form } from "./loginForm.interface";
import { Metadata } from "./metadata.interface";
import { ToolBar } from "./toolBar.interface";
import { UserProfile } from "./userProfile.interface";

export interface DiscoverPageJson {
  content: (Divider | ToolBar | Container | ButtonGroup | Form|DiscoverUserContentJson)[];
  metadata: Metadata;
  contentContainerWidth: "narrow";
}
export interface DiscoverUserContentJson extends UserProfile {
  accessoryButton?: Button;
}
export interface DiscoverhContentJson {
  metadata: Metadata;
  regionContent: DiscoverUserContentJson[];
}
