/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-30 12:44:20
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-02 20:54:35
 * @FilePath: \discoveryChat(V1)\interfaces\metadata.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Cookies } from "./cookies.interface";

export interface Metadata{
    version:'2.0',
    redirectLink?:{
        relativePath:string
    }
    cookies?:Cookies[]
}