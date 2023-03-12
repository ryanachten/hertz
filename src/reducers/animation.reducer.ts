import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Note } from "../constants/notes";

export type RGB = { red: number; green: number; blue: number };

export interface AnimationState {
  selectedColour: RGB | null;
  selectedNote: Note | null;
}

const initialState: AnimationState = {
  selectedColour: null,
  selectedNote: null,
};

export const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    updateColour: (state, { payload }: PayloadAction<RGB>) => {
      state.selectedColour = payload;
    },
    updateNote: (state, { payload }: PayloadAction<Note>) => {
      state.selectedNote = payload;
    },
  },
});

export const { updateColour, updateNote } = animationSlice.actions;
export default animationSlice.reducer;
