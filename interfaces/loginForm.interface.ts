/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-29 20:21:14
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-30 12:47:26
 * @FilePath: \discoveryChat(V1)\interfaces\loginForm.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Button } from "./Button.interface";
import { ButtonContainer } from "./buttonContainer.interface";
import { Divider } from "./divider.interface";
import { Input } from "./input.interface";
import { Metadata } from "./metadata.interface";
import { ToolBar } from "./toolBar.interface";
export interface FormInputText{
    elementType:"formInputText",
    name:string,
    label:string,
}
export interface Form{
    elementType: "form";
    id: string;
    requestMethod: "GET"|"POST"|"DELETE"|"PUT";
    relativePath: string;
    items:(FormInputText|FormInputPassword|Button|ButtonContainer|Input)[]
}
export interface FormInputPassword{
    elementType: "formInputPassword";
    name: string;
    label: string;
    value: string;
    description: string;
    enableShowHidePasswordToggle: true|false;
    minlength: number;
    maxlength: number;
}
export interface LoginForm{
    metadata: Metadata,
      contentContainerWidth: "narrow",
      content:[
        Divider,
        ToolBar,
        Form
      ]
}
