import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AnimationControls from "./components/AnimationControls";
import AudioCanvas from "./components/AudioCanvas";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ForegroundCanvas from "./components/ForegroundCanvas";
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
    const image = imageRef.current;

    if (!image) return;

    if (x.current + size >= image.width - 1) {
      x.current = 0;

      if (y.current + size >= image.height - 1) {
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
    <main className="flex flex-wrap gap-4 justify-center">
      <div>
        {selectedImage !== undefined && (
          <div className="relative">
            <BackgroundCanvas image={selectedImage} x={x} y={y} />
            <ForegroundCanvas image={selectedImage} x={x} y={y} />
          </div>
        )}
        <AudioCanvas />
        <StatsContainer />
      </div>
      <div>
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
        {isAnimating && <AnimationControls />}
      </div>
    </main>
  );
}

export default App;
