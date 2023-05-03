import { Button } from "./Button.interface";
import { ButtonContainer } from "./buttonContainer.interface";
import { ToolBarInput } from "./toolBarInput.interface";
import { ToolBarLabel } from "./toolBarLabel.interface";

export interface ToolBarForm {
  elementType: "toolbarForm",
  relativePath: string, // add relative path
  items: (ToolBarForm|Button|ButtonContainer|ToolBarLabel|ToolBarInput)[];
}
 