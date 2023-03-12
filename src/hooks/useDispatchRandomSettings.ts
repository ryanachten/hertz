import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RANGE_OPTIONS } from "../constants/settings";
import { updateRangeSetting } from "../reducers/settings.reducer";

const shouldAnimate = () => Boolean(Math.round(Math.random()));

const randomValue = (max: number, min: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const useDispatchRandomSettings = (tick: number, interval: number) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (tick % interval !== 0) return;

    console.log("update!");

    RANGE_OPTIONS.forEach(({ key, max, min }) => {
      if (shouldAnimate()) {
        dispatch(updateRangeSetting({ key, value: randomValue(max, min) }));
      }
    });
  }, [dispatch, interval, tick]);
};

export default useDispatchRandomSettings;
