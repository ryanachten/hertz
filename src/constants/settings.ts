import { RangeSettingKey } from "../reducers/settings.reducer";

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

export const WAVEFORM_OPTIONS: OscillatorType[] = [
  "sine",
  "triangle",
  "square",
  "sawtooth",
];

export type RangeOption = {
  label: string;
  key: RangeSettingKey;
  min: number;
  max: number;
};

export const RANGE_OPTIONS: RangeOption[] = [
  {
    label: "FPS",
    key: "fps",
    min: 1,
    max: 50,
  },
  {
    label: "Sample Size",
    key: "sampleSize",
    min: 1,
    max: 99,
  },
  {
    label: "Release Time",
    key: "release",
    min: 1,
    max: 200,
  },
  {
    label: "Attack Time",
    key: "attack",
    min: 1,
    max: 200,
  },
  {
    label: "Sweep Length",
    key: "sweep",
    min: 1,
    max: 10,
  },
  {
    label: "Brightness",
    key: "brightness",
    min: -100,
    max: 100,
  },
];
