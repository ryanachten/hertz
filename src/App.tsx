import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AnimationControls from "./components/AnimationControls";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ForegroundCanvas from "./components/ForegroundCanvas";
import { IMAGE_OPTIONS } from "./constants/settings";
import useSettingRef from "./hooks/useSelectRef";
import { getSetting } from "./selectors/settings.selectors";
import { AnimationServiceContext } from "./services/AnimationService";
import { AudioServiceContext } from "./services/AudioService";

function App() {
  const audioServiceContext = useContext(AudioServiceContext);
  const animationServiceContext = useContext(AnimationServiceContext);

  const selectedImagePath = useRef(IMAGE_OPTIONS[0].path);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement>();
  const sampleSize = useSettingRef("sampleSize");
  const fps = useSelector(getSetting)("fps");

  const [isAnimating, setAnimating] = useState(false);
  const imageRef = useRef<HTMLImageElement>();
  const x = useRef(0);
  const y = useRef(0);

  useEffect(() => {
    animationServiceContext.fps = fps;
  }, [animationServiceContext, fps]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener(animationServiceContext.eventName, handleFrame);
    return () => {
      stopServices();
      window.removeEventListener(
        animationServiceContext.eventName,
        handleFrame
      );
    };
  }, []);

  const startServices = () => {
    audioServiceContext.startOutput();
    animationServiceContext.startAnimation();
    setAnimating(true);
  };

  const stopServices = () => {
    audioServiceContext.stopOutput();
    animationServiceContext.stopAnimation();
    setAnimating(false);
  };

  const handleFrame = () => {
    const size = sampleSize.current;
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
      {selectedImage !== undefined && (
        <div className="relative">
          <BackgroundCanvas image={selectedImage} x={x} y={y} />
          <ForegroundCanvas image={selectedImage} x={x} y={y} />
        </div>
      )}
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
        {isAnimating && <AnimationControls />}
      </div>
    </main>
  );
}

export default App;
