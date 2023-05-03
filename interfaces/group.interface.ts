import { Button } from "./Button.interface";
import { ButtonGroup } from "./buttonGroup.interface";
import { Container } from "./container.interface";
import { Divider } from "./divider.interface";
import { Metadata } from "./metadata.interface";
import { ToolBar } from "./toolBar.interface";
import { UserProfile } from "./userProfile.interface";

export interface GroupPage {
  content: [Divider, ToolBar, Divider, Container, Divider, ToolBar, ButtonGroup];
  metadata: Metadata;
  contentContainerWidth: "narrow";
}
export interface CreateGroupPage {
  content: [Divider, ToolBar, Container];
  metadata: Metadata;
  contentContainerWidth: "narrow";
}
export interface GroupMemberContent extends UserProfile {
  accessoryButton: Button;
}
export interface GroupMemberList {
  metadata: Metadata;
  regionContent: GroupMemberContent[];
}
export interface AddGroupMemberList {
  metadata: Metadata;
  regionContent: GroupMemberContent[];
}
export interface GroupMemberPageJson {
  content: [Divider, ToolBar, Container];
  metadata: Metadata;
  contentContainerWidth: "narrow";
}
export interface FriendNotInGroupPageJson {
  content: [Divider, ToolBar, Container];
  metadata: Metadata;
  contentContainerWidth: "narrow";
}
