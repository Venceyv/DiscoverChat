import { user } from "./data.Interface";

export interface UserResponseType{
    resource: 'users';
    userId:string;
    type: 'self' | 'others';
    data:Array<user>|null;
  }