import { ObjectId } from "mongoose";

export interface user {
  _id: ObjectId | string | null;
  email: string;
  firstName: string;
  lastName: string;
  birthday: Date | null;
  profilePic: string;
  majorList: Array<string>;
  description: string;
  gender: string;
}
export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  birthday: Date | null;
  profilePic: string;
  majorList: Array<string>;
  description: string;
  gender: string;
}
export interface roomMessage {
  _id: ObjectId | null | string;
  content: string;
  sender: string | null | user;
  room: string;
  timeStamp: Date;
}
export interface roomMessageData {
  content: string | undefined;
  sender: string | null | user;
  room: string;
  timeStamp: Date;
}
export interface group {
  _id: ObjectId | string | null;
  name: string;
  lastActivity: Date;
}
export interface groupData {
  name: string;
}
export interface groupMessage {
  _id: ObjectId | null | string;
  content: string;
  sender: string | null | user;
  group: string;
  timeStamp: Date;
}
export interface groupMessageData {
  content: string | undefined;
  sender: string | null | user;
  group: string;
  timeStamp: Date;
}
export interface groupMember {
  _id: ObjectId | string | null;
  user: string;
  group: string;
}
export interface groupMemberData {
  user: string;
  group: string;
}
export interface DiaLogue {
  type: "room" | "group";
  id: string;
  name: string;
  avatar: string;
  messageContent:string;
  timeStamp: Date | undefined;
}

