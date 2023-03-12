import { RootState } from "../store";

export const getSelectedColour = ({ animation }: RootState) =>
  animation.selectedColour;
