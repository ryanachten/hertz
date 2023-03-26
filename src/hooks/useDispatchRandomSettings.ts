import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RANGE_OPTIONS, WAVEFORM_OPTIONS } from "../constants/settings";
import {
  updateRangeSetting,
  updateWaveform,
} from "../reducers/settings.reducer";

const shouldAnimate = () => Boolean(Math.round(Math.random()));

const randomValue = (max: number, min: number) =>
  Math.floor(Math.random() * (max - min) + min);

const useDispatchRandomSettings = (tick: number, interval: number) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (tick % interval !== 0) return;

    RANGE_OPTIONS.forEach(({ key, max, min }) => {
      if (shouldAnimate()) {
        dispatch(updateRangeSetting({ key, value: randomValue(max, min) }));
      }
    });

    if (shouldAnimate()) {
      const waveformIndex = randomValue(0, WAVEFORM_OPTIONS.length);
      dispatch(updateWaveform(WAVEFORM_OPTIONS[waveformIndex]));
    }
  }, [dispatch, interval, tick]);
};

export default useDispatchRandomSettings;
