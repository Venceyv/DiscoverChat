import { Metadata } from "./metadata.interface";

export interface UserChatContent {
  elementType: "nameTag";
  id: "standard";
  label: string; //label是人的名字
  link: {
    relativePath: string; //看YILONG WANG的profile
  };
  name: string; //用的name来当作聊天内容
  image: {
    url: string;
    alt: string | "Photo of Jonathan Surasmith"; //头像
  };
}
export interface ChatListContent {
  elementType: "nameTag",
  id: "standard",
  name: string,
  link: {
    relativePath: string, //进入groupchat聊天框架（里面有ajax再load具体的内容）
  },
  description: string,
  image: {
    url: string, //头像
    alt: string,
  }
}
export interface ChatContent {
  metadata: Metadata,
  regionContent: (UserChatContent|ChatListContent)[];
}
