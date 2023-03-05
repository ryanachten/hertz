import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "../reducers/settings.reducer";
import { getSetting } from "../selectors/settings.selectors";

const AnimationControls = () => {
  const fps = useSelector(getSetting)("fps");
  const sampleSize = useSelector(getSetting)("sampleSize");

  const dispatch = useDispatch();
  return (
    <>
      <label className="label" htmlFor="fps">
        FPS
      </label>
      <input
        className="range range-xs"
        name="fps"
        type="range"
        min="0"
        value={fps}
        max="50"
        onChange={(e) => {
          dispatch(
            updateSetting({
              key: "fps",
              value: parseInt(e.target.value, 10),
            })
          );
        }}
      />
      <label className="label" htmlFor="sampleSize">
        Sample Size
      </label>
      <input
        className="range range-xs"
        name="sampleSize"
        type="range"
        min="1"
        max="100"
        value={sampleSize}
        onChange={(e) => {
          dispatch(
            updateSetting({
              key: "sampleSize",
              value: parseInt(e.target.value, 10),
            })
          );
        }}
      />
    </>
  );
};

export default AnimationControls;
