import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  fps: number;
  sampleSize: number;
  brightness: number;
}

export type SettingKey = keyof SettingsState;

const initialState: SettingsState = {
  fps: 24,
  sampleSize: 10,
  brightness: 0,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSetting: (
      state,
      {
        payload,
      }: PayloadAction<{
        key: SettingKey;
        value: number;
      }>
    ) => {
      state[payload.key] = payload.value;
    },
  },
});

export const { updateSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
