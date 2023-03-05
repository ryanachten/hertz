import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { SettingKey } from "../reducers/settings.reducer";
import { getSetting } from "../selectors/settings.selectors";

/*
 * RequestAnimationFrame doesn't play nice with selectors
 * since they don't update inside the closure.
 * This hook propagates value updates to a ref to work around this.
 */
const useSettingRef = (key: SettingKey) => {
  const setting = useSelector(getSetting)(key);
  const settingRef = useRef(setting);

  useEffect(() => {
    settingRef.current = setting;
  }, [setting]);

  return settingRef;
};

export default useSettingRef;
