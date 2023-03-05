import { Fragment, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RANGE_OPTIONS, WAVEFORM_OPTIONS } from "../constants/settings";
import { updateSetting } from "../reducers/settings.reducer";
import { getSetting } from "../selectors/settings.selectors";
import { AudioServiceContext } from "../services/AudioService";

const AnimationControls = () => {
  const audioServiceContext = useContext(AudioServiceContext);
  const setting = useSelector(getSetting);
  const dispatch = useDispatch();
  return (
    <>
      <label className="label" htmlFor="waveform">
        Waveform
      </label>
      <select
        name="waveform"
        onChange={(e) => {
          audioServiceContext.updateWaveform(e.target.value as OscillatorType);
        }}
      >
        {WAVEFORM_OPTIONS.map((waveform) => (
          <option key={waveform} value={waveform}>
            {waveform}
          </option>
        ))}
      </select>
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
