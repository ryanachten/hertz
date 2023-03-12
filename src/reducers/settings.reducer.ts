import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  autoplay: boolean;
  autoplayInterval: number;
  rangeSettings: RangeSettings;
}

type RangeSettings = {
  fps: number;
  sampleSize: number;
  brightness: number;
  release: number;
  attack: number;
  sweep: number;
};

export type RangeSettingKey = keyof RangeSettings;

const initialState: SettingsState = {
  autoplay: true,
  autoplayInterval: 4,
  rangeSettings: {
    fps: 5,
    sampleSize: 10,
    brightness: 0,
    release: 50,
    attack: 20,
    sweep: 2,
  },
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateRangeSetting: (
      state,
      {
        payload,
      }: PayloadAction<{
        key: RangeSettingKey;
        value: number;
      }>
    ) => {
      state.rangeSettings[payload.key] = payload.value;
    },
    updateAutoplay: (state, { payload }: PayloadAction<boolean>) => {
      state.autoplay = payload;
    },
    updateAutoplayInterval: (state, { payload }: PayloadAction<number>) => {
      state.autoplayInterval = payload;
    },
  },
});

export const { updateRangeSetting, updateAutoplay, updateAutoplayInterval } =
  settingsSlice.actions;
export default settingsSlice.reducer;
