import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RANGE_OPTIONS, WAVEFORM_OPTIONS } from "../constants/settings";
import {
  updateAutoplay,
  updateAutoplayInterval,
  updateRangeSetting,
} from "../reducers/settings.reducer";
import {
  getAutoplayInterval,
  getRangeSetting,
  isAutoplaying,
} from "../selectors/settings.selectors";
import { AudioServiceContext } from "../services/AudioService";
import RangeControl from "./RangeControl";

const AnimationControls = () => {
  const audioServiceContext = useContext(AudioServiceContext);
  const setting = useSelector(getRangeSetting);
  const autoplay = useSelector(isAutoplaying);
  const autoplayInterval = useSelector(getAutoplayInterval);

  const dispatch = useDispatch();
  return (
    <>
      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text">Autoplay</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={autoplay}
            onChange={(e) => dispatch(updateAutoplay(e.target.checked))}
          />
        </label>
      </div>

      <RangeControl
        id="AutoplayInterval"
        label="Autoplay Interval"
        min={1}
        max={50}
        value={autoplayInterval}
        onChange={(value) => dispatch(updateAutoplayInterval(value))}
      />

      <div className="form-control">
        <label className="label" htmlFor="waveform">
          Waveform
        </label>
        <select
          disabled={autoplay}
          name="waveform"
          onChange={(e) => {
            audioServiceContext.updateWaveform(
              e.target.value as OscillatorType
            );
          }}
        >
          {WAVEFORM_OPTIONS.map((waveform) => (
            <option key={waveform} value={waveform}>
              {waveform}
            </option>
          ))}
        </select>
      </div>
      {RANGE_OPTIONS.map(({ label, key, min, max }) => (
        <RangeControl
          key={key}
          id={key}
          label={label}
          min={min}
          max={max}
          value={setting(key)}
          onChange={(value) =>
            dispatch(
              updateRangeSetting({
                key,
                value,
              })
            )
          }
        />
      ))}
    </>
  );
};

export default AnimationControls;
