import { useContext, useEffect, useRef, useState } from "react";
import { IMAGE_OPTIONS } from "./constants/image";
import { AnimationServiceContext } from "./services/AnimationService";
import { AudioServiceContext } from "./services/AudioService";

function App() {
  const audioServiceContext = useContext(AudioServiceContext);
  const animationServiceContext = useContext(AnimationServiceContext);
  const selectedImage = useRef(IMAGE_OPTIONS[0].path);
  const sampleSize = useRef(10);
  const [isAnimating, setAnimating] = useState(false);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>();
  const x = useRef(0);
  const y = useRef(0);

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
    const foreground = foregroundCanvasRef.current;
    const foregroundCtx = foreground?.getContext("2d");
    const backgroundCtx = backgroundCanvasRef.current?.getContext("2d");
    const img = imageRef.current;
    const size = sampleSize.current;

    if (!foreground || !foregroundCtx || !backgroundCtx || !img) return;
    foregroundCtx.clearRect(0, 0, foreground.width, foreground.height);
    const { data } = backgroundCtx.getImageData(
      x.current,
      y.current,
      size,
      size
    );

    foregroundCtx.strokeRect(x.current, y.current, size, size);

    audioServiceContext.updateOutput((data[0] + data[1] + data[2]) / 3); // TODO: this is actually only taking the brightness of the first pixel

    if (x.current + size >= foreground.width - 1) {
      x.current = 0;

      if (y.current + size >= foreground.height - 1) {
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
      img.src = selectedImage.current;
      img.crossOrigin = "anonymous";
      const background = backgroundCanvasRef.current;
      const foreground = foregroundCanvasRef.current;
      const context = background?.getContext("2d");

      if (!background || !foreground || !context) return;

      img.addEventListener("load", () => {
        if (!background || !context) return;
        background.height = img.height;
        background.width = img.width;
        foreground.height = img.height;
        foreground.width = img.width;
        context.drawImage(img, 0, 0);
        imageRef.current = img;

        resolve(img);
      });
    });
  };

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

  const renderPlayControls = () => (
    <>
      <label className="label" htmlFor="fps">
        FPS
      </label>
      <input
        className="range range-xs"
        name="fps"
        type="range"
        min="0"
        defaultValue="24"
        max="50"
        onChange={(e) => {
          animationServiceContext.fps = parseInt(e.target.value, 10);
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
        onChange={(e) => {
          sampleSize.current = parseInt(e.target.value, 10);
        }}
      />
    </>
  );

  return (
    <main className="flex flex-wrap gap-4 justify-center">
      <div className="relative">
        <canvas className="max-w-lg" ref={backgroundCanvasRef} />
        <canvas
          className="max-w-lg absolute bottom-0 left-0"
          ref={foregroundCanvasRef}
        />
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
        <label className="label" htmlFor="srcImage">
          Source image
        </label>
        <select
          name="srcImage"
          className="select"
          onChange={async (e) => {
            selectedImage.current = e.target.value;
            await setupCanvas();
          }}
        >
          {IMAGE_OPTIONS.map((opt) => (
            <option key={opt.path} value={opt.path}>
              {opt.name}
            </option>
          ))}
        </select>
        {isAnimating && renderPlayControls()}
      </div>
    </main>
  );
}

export default App;
