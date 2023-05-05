import {  Button } from "./Button.interface"
import { ButtonGroup } from "./buttonGroup.interface"
import { Divider } from "./divider.interface"
import { Metadata } from "./metadata.interface"
import { ToolBar } from "./toolBar.interface"
import { UserProfile } from "./userProfile.interface"

export interface SearchUserContentJson extends UserProfile{
    accessoryButton?:Button
}
export interface SearchContentJson{
    content:(Divider|ButtonGroup|ToolBar|SearchUserContentJson)[],
    metadata: Metadata,
    contentContainerWidth: "narrow"
}