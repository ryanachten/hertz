import { useSelector } from "react-redux";
import {
  getSelectedColour,
  getSelectedNote,
} from "../selectors/animation.selectors";

const placeholder = "--";
const padRgb = (num?: number) =>
  num === undefined ? placeholder : num.toString().padStart(3, "0");
const padFreq = (num?: number) =>
  num === undefined ? placeholder : Math.round(num).toString().padStart(4, "0");

const StatsContainer = () => {
  const colour = useSelector(getSelectedColour);
  const note = useSelector(getSelectedNote);
  return (
    <div className="w-full flex flex-col">
      <div className="stats shadow rounded-none">
        <div className="stat">
          <div className="stat-title">Colour</div>
          <div className="stat-figure">
            <div
              className="w-16 h-16 rounded-md"
              style={{
                backgroundColor: `rgb(${colour?.red},${colour?.green},${colour?.blue})`,
              }}
            ></div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Red</div>
          <div className="stat-value font-mono">{padRgb(colour?.red)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Green</div>
          <div className="stat-value font-mono">{padRgb(colour?.green)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Blue</div>
          <div className="stat-value font-mono">{padRgb(colour?.blue)}</div>
        </div>
      </div>
      <div className="stats shadow rounded-t-none">
        <div className="stat">
          <div className="stat-title">Octave</div>
          <div className="stat-value font-mono">
            {note?.octave ?? placeholder}
          </div>
        </div>
        <div className="stat w-28">
          <div className="stat-title">Note</div>
          <div className="stat-value font-mono">
            {note?.label ?? placeholder}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Frequency</div>
          <div className="stat-value font-mono">{padFreq(note?.frequency)}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsContainer;
