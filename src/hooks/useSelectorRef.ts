import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RangeSettingKey } from "../reducers/settings.reducer";
import { getRangeSetting } from "../selectors/settings.selectors";
import { RootState } from "../store";

/*
 * RequestAnimationFrame doesn't play nice with selectors
 * since they don't update inside the closure.
 * This hook propagates value updates to a ref to work around this.
 */
const useSelectorRef = <T>(selector: (state: RootState) => T) => {
  const result = useSelector(selector);
  const resultRef = useRef(result);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  return resultRef;
};

export const useRangeSettingRef = (key: RangeSettingKey) => {
  const setting = useSelector(getRangeSetting)(key);
  const settingRef = useRef(setting);

  useEffect(() => {
    settingRef.current = setting;
  }, [setting]);

  return settingRef;
};

export default useSelectorRef;
