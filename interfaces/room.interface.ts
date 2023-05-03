import { ButtonGroup } from "./buttonGroup.interface";
import { Container } from "./container.interface";
import { Divider } from "./divider.interface";
import { ToolBar } from "./toolBar.interface";


export interface RoomPageJson {
  content: [
    Divider,
    ToolBar,
    Divider,
    Container,
    Divider,
    ToolBar,
    ButtonGroup
  ];
  metadata: {
    version: "2.0";
  };
  contentContainerWidth: "narrow";
}
