/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-05-03 03:12:28
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-05-03 15:16:51
 * @FilePath: \discoveryChat(V1)\interfaces\events.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface Event{
    eventName: string,
    targetId: string
    action: string,
    ajaxRelativePath?: string,//path
    requestMethod?:"get"|"post"|'put'|'delete',
    region?:string,
    loadingIndicator?:true|false,
    relativePath?:string,
}