import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  fps: number;
  sampleSize: number;
}

export type SettingKey = keyof SettingsState;

const initialState: SettingsState = {
  fps: 24,
  sampleSize: 10,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSetting: (
      state,
      action: PayloadAction<{
        key: SettingKey;
        value: number;
      }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { updateSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
