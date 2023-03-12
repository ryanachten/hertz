import { RootState } from "../store";

export const getSelectedColour = ({ animation }: RootState) =>
  animation.selectedColour;

export const getSelectedNote = ({ animation }: RootState) =>
  animation.selectedNote;
