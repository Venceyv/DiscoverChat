/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-05-02 20:38:58
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-02 20:39:08
 * @FilePath: \discoveryChat(V1)\interfaces\input.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface Input {
  elementType: "input";
  inputType: string;
  name: string;
  label: string;
  required: true;
}
