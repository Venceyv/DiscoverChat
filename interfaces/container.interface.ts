import { DiscoverUserContentJson } from "./discover.interface";

export interface Container {
  elementType: "container";
  id?:string,
  content: {
    ajaxRelativePath?: string; //windowchat的聊天内容
    metadata?: {
      version: "2.0",
    },
    regionContent?: DiscoverUserContentJson[];
  },
}
export interface RegionContent{
  regionContent:DiscoverUserContentJson[]
}