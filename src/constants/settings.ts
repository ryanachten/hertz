import { RangeSettingKey } from "../reducers/settings.reducer";
import perlinNoise from "../assets/perlin_noise.png";
import srgb from "../assets/srgb.webp";

export type ImageOption = {
  name: string;
  path: string;
};

export const IMAGE_OPTIONS: ImageOption[] = [
  {
    name: "Perlin noise",
    path: perlinNoise,
  },
  {
    name: "SRGB Spectrum",
    path: srgb,
  },
];

export const WAVEFORM_OPTIONS: OscillatorType[] = [
  "sine",
  "triangle",
  "square",
  "sawtooth",
];

export const AUTOPLAY_INTERVAL_SETTINGS = {
  min: 1,
  max: 50,
};

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
    max: 25,
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
