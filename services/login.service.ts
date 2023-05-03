import { LoginForm } from "../interfaces/loginForm.interface";

/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-29 20:58:22
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-29 21:06:46
 * @FilePath: \discoveryChat(V1)\services\login.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const getLoginFormJson = (path:string): LoginForm => {
  const loginForm: LoginForm = {
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "narrow",
    content: [
      {
        elementType: "divider",
        borderColor: "transparent",
      },
      {
        elementType: "toolbar",
        toolbarStyle: "unpadded",
        middle: [
          {
            elementType: "toolbarLabel",
            label: "Welcome to DiscoverChat!",
          },
        ],
      },
      {
        elementType: "form",
        id: "contact",
        requestMethod: "GET",
        relativePath: path,
        items: [
          {
            elementType: "formInputText",
            name: "username",
            label: "Username",
          },
          {
            elementType: "formInputPassword",
            name: "password",
            label: "Password",
            value: "$uper$ecret4U",
            description:
              "Requirements:<ul><li>At least 8 characters long</li><li>At least one uppercase letter, one number, and one punctuation character</li><li>No spaces</li><li>Must <em>not</em> match any of your 5 previous passwords</li></ul>",
            enableShowHidePasswordToggle: true,
            minlength: 8,
            maxlength: 24,
          },
          {
            elementType: "formButton",
            title: "Login",
            buttonType: "submit",
            actionStyle: "constructive",
          },
        ],
      },
    ],
  };
  return loginForm;
};
