/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-20 01:19:47
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-25 16:37:08
 * @FilePath: \discoveryChat\interfaces\request.interface.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface UserResourceRequestType {
  resource: 'users';
  type: 'notSearch'|'search';
  fulFill:boolean;
  userId: string;
  others: string[];
}
export interface SearchUserResourceRequestType extends UserResourceRequestType{
  searchParam:string
}
export interface RecommandUserResourceRequestType extends UserResourceRequestType{
  friendList:string[];
}