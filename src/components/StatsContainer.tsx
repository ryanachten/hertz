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
        <div className="stat p-3 sm:p-5 flex flex-col sm:flex-row">
          <div className="stat-title text-xs sm:text-base mb-2 sm:mb-0">
            Colour
          </div>
          <div className="stat-figure">
            <div
              className="w-8 h-8 sm:w-16 sm:h-16 rounded-md"
              style={{
                backgroundColor: `rgb(${colour?.red},${colour?.green},${colour?.blue})`,
              }}
            ></div>
          </div>
        </div>
        <Stat label="Red" value={padRgb(colour?.red)} />
        <Stat label="Green" value={padRgb(colour?.green)} />
        <Stat label="Blue" value={padRgb(colour?.blue)} />
      </div>
      <div className="stats shadow rounded-t-none">
        <Stat label="Octave" value={note?.octave.toString()} />
        <Stat className="w-28" label="Note" value={note?.label} />
        <Stat label="Frequency" value={padFreq(note?.frequency)} />
      </div>
    </div>
  );
};

const Stat = ({
  className,
  label,
  value = placeholder,
}: {
  className?: string;
  label: string;
  value?: string;
}) => (
  <div className={`stat p-3 sm:p-5 ${className ?? ""}`}>
    <div className="stat-title text-xs sm:text-base">{label}</div>
    <div className="stat-value text-s sm:text-4xl font-mono">{value}</div>
  </div>
);

export default StatsContainer;
