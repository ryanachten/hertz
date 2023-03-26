import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AUTOPLAY_INTERVAL_SETTINGS,
  RANGE_OPTIONS,
  WAVEFORM_OPTIONS,
} from "../constants/settings";
import {
  updateAutoplay,
  updateAutoplayInterval,
  updateRangeSetting,
  updateWaveform,
} from "../reducers/settings.reducer";
import {
  getAutoplayInterval,
  getRangeSetting,
  getWaveform,
  isAutoplaying,
} from "../selectors/settings.selectors";
import { AudioServiceContext } from "../services/AudioService";
import RangeControl from "./RangeControl";
import SelectControl from "./SelectControl";

const AnimationControls = () => {
  const audioServiceContext = useContext(AudioServiceContext);
  const dispatch = useDispatch();
  const setting = useSelector(getRangeSetting);
  const autoplay = useSelector(isAutoplaying);
  const autoplayInterval = useSelector(getAutoplayInterval);
  const selectedWaveform = useSelector(getWaveform);

  useEffect(
    () => audioServiceContext.updateWaveform(selectedWaveform),
    [audioServiceContext, selectedWaveform]
  );

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
      {autoplay && (
        <RangeControl
          id="AutoplayInterval"
          label="Autoplay Interval"
          min={AUTOPLAY_INTERVAL_SETTINGS.min}
          max={AUTOPLAY_INTERVAL_SETTINGS.max}
          value={autoplayInterval}
          onChange={(value) => dispatch(updateAutoplayInterval(value))}
        />
      )}
      <SelectControl
        label="Waveform"
        id="waveform"
        disabled={autoplay}
        onChange={(value) => dispatch(updateWaveform(value as OscillatorType))}
        value={selectedWaveform}
      >
        {WAVEFORM_OPTIONS.map((waveform) => (
          <option key={waveform} value={waveform}>
            {waveform}
          </option>
        ))}
      </SelectControl>
      {RANGE_OPTIONS.map(({ label, key, min, max }) => (
        <RangeControl
          key={key}
          id={key}
          label={label}
          disabled={autoplay}
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
    </div>
  );
};

export default AnimationControls;
