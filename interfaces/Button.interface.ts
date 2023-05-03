import { Event } from "./events.interface";

export interface Button {
  actionType?:string,
  actionStyle?:string
  accessoryIcon?: string,
  buttonType?:string
  backgroundColor?: string,
  borderColor?:string,
  borderRadius?: string,
  borderWidth?: string,
  elementType?: string,
  link?: {
    relativePath: string, //返回到chat的页面（里面的ajax会load content）
  };
  marginTop?:string,
  size?: string,
  title?:string,
  textColor?:string,
  events?:Event[]
}