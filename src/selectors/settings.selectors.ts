import { RangeSettingKey } from "../reducers/settings.reducer";
import { RootState } from "../store";

export const getRangeSetting =
  ({ settings }: RootState) =>
  (key: RangeSettingKey) =>
    settings.rangeSettings[key];

export const isAutoplaying = ({ settings }: RootState) => settings.autoplay;
export const getAutoplayInterval = ({ settings }: RootState) =>
  settings.autoplayInterval;

export const getWaveform = ({ settings }: RootState) => settings.waveform;
