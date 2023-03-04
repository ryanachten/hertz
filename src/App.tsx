import { useContext, useEffect, useRef, useState } from "react";
import { IMAGE_OPTIONS } from "./constants/image";
import { AudioServiceContext } from "./services/AudioService";

function App() {
  const audioServiceContext = useContext(AudioServiceContext);
  const selectedImage = useRef(IMAGE_OPTIONS[0].path);
  const [fps, setFps] = useState(24);
  const sampleSize = useRef(10);
  const fpsInterval = useRef(0);
  const [isAnimating, setAnimating] = useState(false);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const foregroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>();
  const previousTime = useRef(0);
  const currentFrame = useRef(0);
  const x = useRef(0);
  const y = useRef(0);

  useEffect(() => {
    fpsInterval.current = 1000 / fps;
  }, [fps]);

  const startAnimation = () => {
    audioServiceContext.startOutput();
    previousTime.current = Date.now();
    animate();
    setAnimating(true);
  };

  const stopAnimation = () => {
    cancelAnimationFrame(currentFrame.current);
    audioServiceContext.stopOutput();
    setAnimating(false);
  };

  const animate = () => {
    currentFrame.current = requestAnimationFrame(animate);

    const now = Date.now();
    const elapsed = now - previousTime.current;

    if (elapsed > fpsInterval.current) {
      previousTime.current = now - (elapsed % fpsInterval.current);
      frame();
    }
  };

  const frame = () => {
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
    return () => {
      stopAnimation();
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
        max="50"
        value={fps}
        onChange={(e) => setFps(parseInt(e.target.value, 10))}
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
          <button className="btn btn-primary" onClick={() => stopAnimation()}>
            Stop
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => startAnimation()}>
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
            stopAnimation();
            await setupCanvas();
            startAnimation();
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
