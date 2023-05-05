import { Button } from "./Button.interface";

export interface ButtonGroup {
  elementType: "buttonGroup";
  fullWidth: true|false;
  buttons: Button[];
}
