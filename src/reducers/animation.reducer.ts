import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type RGB = { red: number; green: number; blue: number };

export interface AnimationState {
  selectedColour: RGB | null;
}

const initialState: AnimationState = {
  selectedColour: null,
};

export const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    updateColour: (state, { payload }: PayloadAction<RGB>) => {
      state.selectedColour = payload;
    },
  },
});

export const { updateColour } = animationSlice.actions;
export default animationSlice.reducer;
