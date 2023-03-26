import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AnimationControls from "./components/AnimationControls";
import AudioCanvas from "./components/AudioCanvas";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ForegroundCanvas from "./components/ForegroundCanvas";
import SampleCanvas from "./components/SampleCanvas";
import StatsContainer from "./components/StatsContainer";
import { IMAGE_OPTIONS } from "./constants/settings";
import useDispatchRandomSettings from "./hooks/useDispatchRandomSettings";
import useSelectorRef, { useRangeSettingRef } from "./hooks/useSelectorRef";
import {
  getAutoplayInterval,
  getRangeSetting,
  isAutoplaying,
} from "./selectors/settings.selectors";
import {
  AudioAnimationContext,
  StandardAnimationContext,
} from "./services/AnimationService";

function App() {
  const audioAnimation = useContext(AudioAnimationContext);
  const standardAnimation = useContext(StandardAnimationContext);

  const selectedImagePath = useRef(IMAGE_OPTIONS[0].path);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement>();
  const sampleSizeRef = useRangeSettingRef("sampleSize");
  const fps = useSelector(getRangeSetting)("fps");

  const [isAnimating, setAnimating] = useState(false);
  const imageRef = useRef<HTMLImageElement>();
  const backgroundRef = useRef<HTMLCanvasElement>(null);
  const x = useRef(0);
  const y = useRef(0);
  const tickRef = useRef(0);
  const [tick, setTick] = useState(0);
  const isAutoplayingRef = useSelectorRef(isAutoplaying);
  const autoplayInterval = useSelector(getAutoplayInterval);

  useDispatchRandomSettings(tick, autoplayInterval);

  useEffect(() => {
    audioAnimation.fps = fps;
  }, [audioAnimation, fps]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener(audioAnimation.eventName, handleFrame);
    return () => {
      stopServices();
      window.removeEventListener(audioAnimation.eventName, handleFrame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startServices = () => {
    audioAnimation.startAnimation();
    standardAnimation.startAnimation();
    setAnimating(true);
  };

  const stopServices = () => {
    audioAnimation.stopAnimation();
    standardAnimation.stopAnimation();
    setAnimating(false);
  };

  const handleFrame = () => {
    if (isAutoplayingRef.current) {
      tickRef.current++;
      setTick(tickRef.current);
    }

    const size = sampleSizeRef.current;
    const background = backgroundRef.current;

    if (!background) return;

    if (x.current + size >= background.width - 1) {
      x.current = 0;

      if (y.current + size >= background.height - 1) {
        y.current = 0;
      } else {
        y.current += size;
      }
    } else {
      x.current += size;
    }
  };

  const setupCanvas = async () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = selectedImagePath.current;
      img.crossOrigin = "anonymous";

      img.addEventListener("load", () => {
        setSelectedImage(img);
        imageRef.current = img;
        resolve(img);
      });
    });
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-2">
      {selectedImage !== undefined && (
        <div className="max-h-screen p-8 flex flex-col">
          <div className="relative grow">
            <BackgroundCanvas
              ref={backgroundRef}
              image={selectedImage}
              x={x}
              y={y}
            />
            <ForegroundCanvas x={x} y={y} />
          </div>
          <StatsContainer />
        </div>
      )}
      <div className="max-h-screen p-8 overflow-y-auto">
        {isAnimating && (
          <>
            <AudioCanvas />
            <SampleCanvas />
          </>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {isAnimating ? (
            <button className="btn btn-primary" onClick={() => stopServices()}>
              Stop
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => startServices()}>
              Play
            </button>
          )}
          <div className="form-control">
            <label className="label" htmlFor="srcImage">
              Source image
            </label>
            <select
              name="srcImage"
              className="select"
              onChange={async (e) => {
                selectedImagePath.current = e.target.value;
                await setupCanvas();
              }}
            >
              {IMAGE_OPTIONS.map((opt) => (
                <option key={opt.path} value={opt.path}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <AnimationControls />
      </div>
    </main>
  );
}

export default App;
