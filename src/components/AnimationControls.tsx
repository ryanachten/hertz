import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RANGE_OPTIONS } from "../constants/settings";
import { updateSetting } from "../reducers/settings.reducer";
import { getSetting } from "../selectors/settings.selectors";

const AnimationControls = () => {
  const setting = useSelector(getSetting);
  const dispatch = useDispatch();
  return (
    <>
      {RANGE_OPTIONS.map(({ label, key, min, max }) => (
        <Fragment key={key}>
          <label className="label" htmlFor={key}>
            {label}
          </label>
          <input
            className="range range-xs"
            name={key}
            type="range"
            min={min}
            value={setting(key)}
            max={max}
            onChange={(e) => {
              dispatch(
                updateSetting({
                  key,
                  value: parseInt(e.target.value, 10),
                })
              );
            }}
          />
        </Fragment>
      ))}
    </>
  );
};

export default AnimationControls;
