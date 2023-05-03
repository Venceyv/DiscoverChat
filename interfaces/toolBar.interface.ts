import { Button } from "./Button.interface";
import { ButtonContainer } from "./buttonContainer.interface";
import { Form } from "./loginForm.interface";
import { ToolBarForm } from "./toolBarForm.interface";
import { ToolBarLabel } from "./toolBarLabel.interface";

/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-28 11:39:27
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-02 20:36:34
 * @FilePath: \discoveryChat(V1)\interfaces\toolBar.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface ToolBar {
    elementType:'toolbar',
    toolbarStyle:'unpadded'|string,
    left?:(ToolBarForm|Button|ButtonContainer|ToolBarLabel|Form)[],
    middle?:(ToolBarForm|Button|ButtonContainer|ToolBarLabel|Form)[],
    right?:(ToolBarForm|Button|ButtonContainer|ToolBarLabel|Form)[]
}