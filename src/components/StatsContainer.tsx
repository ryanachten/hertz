import { useSelector } from "react-redux";
import {
  getSelectedColour,
  getSelectedNote,
} from "../selectors/animation.selectors";

const padRgb = (num: number) => num.toString().padStart(3, "0");
const padFreq = (num: number) => Math.round(num).toString().padStart(4, "0");

const StatsContainer = () => {
  const colour = useSelector(getSelectedColour);
  const note = useSelector(getSelectedNote);
  return (
    <div className="w-full flex flex-col">
      {colour && (
        <div className="stats shadow rounded-none">
          <div className="stat">
            <div className="stat-title">Colour</div>
            <div className="stat-figure">
              <div
                className="w-16 h-16 rounded-md"
                style={{
                  backgroundColor: `rgb(${colour.red},${colour.green},${colour.blue})`,
                }}
              ></div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Red</div>
            <div className="stat-value font-mono">{padRgb(colour.red)}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Green</div>
            <div className="stat-value font-mono">{padRgb(colour.green)}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Blue</div>
            <div className="stat-value font-mono">{padRgb(colour.blue)}</div>
          </div>
        </div>
      )}
      {note && (
        <div className="stats shadow rounded-t-none">
          <div className="stat">
            <div className="stat-title">Octave</div>
            <div className="stat-value font-mono">{note.octave}</div>
          </div>
          <div className="stat w-28">
            <div className="stat-title">Note</div>
            <div className="stat-value font-mono">{note.label}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Frequency</div>
            <div className="stat-value font-mono">
              {padFreq(note.frequency)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsContainer;
