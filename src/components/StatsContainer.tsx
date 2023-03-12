import { useSelector } from "react-redux";
import { getSelectedColour } from "../selectors/animation.selectors";

const leftPad = (num: number) => num.toString().padStart(3, "0");

const StatsContainer = () => {
  const selectedColour = useSelector(getSelectedColour);
  if (!selectedColour) return null;

  const { red, green, blue } = selectedColour;
  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-title">Colour</div>
        <div className="stat-figure">
          <div
            className="w-16 h-16 rounded-md"
            style={{ backgroundColor: `rgb(${red},${green},${blue})` }}
          ></div>
        </div>
      </div>
      <div className="stat">
        <div className="stat-title">Red</div>
        <div className="stat-value font-mono">{leftPad(red)}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Green</div>
        <div className="stat-value font-mono">{leftPad(green)}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Blue</div>
        <div className="stat-value font-mono">{leftPad(blue)}</div>
      </div>
    </div>
  );
};

export default StatsContainer;
