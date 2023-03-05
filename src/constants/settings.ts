import { SettingKey } from "../reducers/settings.reducer";

export type ImageOption = {
  name: string;
  path: string;
};

export const IMAGE_OPTIONS: ImageOption[] = [
  {
    name: "Perlin noise",
    path: "./assets/perlin_noise.png",
  },
  {
    name: "SRGB Spectrum",
    path: "./assets/srgb.webp",
  },
];

export type RangeOption = {
  label: string;
  key: SettingKey;
  min: number;
  max: number;
};

export const RANGE_OPTIONS: RangeOption[] = [
  {
    label: "FPS",
    key: "fps",
    min: 0,
    max: 50,
  },
  {
    label: "Sample Size",
    key: "sampleSize",
    min: 1,
    max: 100,
  },
  {
    label: "Brightness",
    key: "brightness",
    min: -100,
    max: 100,
  },
];
