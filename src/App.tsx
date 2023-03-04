import { useEffect, useRef, useState } from "react";
import { IMAGE_OPTIONS } from "./constants/image";

function App() {
  const selectedImage = useRef(IMAGE_OPTIONS[0].path);
  const [fps, setFps] = useState(24);
  const sampleSize = useRef(10);
  const fpsInterval = useRef(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isAnimating, setAnimating] = useState(false);
  const audioContext = useRef(new AudioContext());
  const oscillator = useRef<OscillatorNode>();
  const gainNode = useRef<GainNode>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>();
  const previousTime = useRef(0);
  const currentFrame = useRef(0);
  const x = useRef(0);
  const y = useRef(0);

  useEffect(() => {
    fpsInterval.current = 1000 / fps;
  }, [fps]);

  const startAnimation = () => {
    const osc = oscillator.current;
    const gain = gainNode.current;
    if (!gain || !osc) return;
    if (!hasStarted) {
      osc.start();
      setHasStarted(true);
    }
    osc.connect(gain);
    previousTime.current = Date.now();
    animate();
    setAnimating(true);
  };

  const stopAnimation = () => {
    cancelAnimationFrame(currentFrame.current);
    oscillator.current?.disconnect();
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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;
    const osc = oscillator.current;
    const size = sampleSize.current;

    if (!canvas || !ctx || !img || !osc) return;
    ctx.drawImage(img, 0, 0); // TODO: can probably create a more optimized reset using putImageData
    const { data } = ctx.getImageData(x.current, y.current, size, size);

    ctx.strokeRect(x.current, y.current, size, size);

    osc.frequency.value = (data[0] + data[1] + data[2]) / 3; // TODO: this is actually only taking the brightness of the first pixel

    if (x.current + size >= canvas.width - 1) {
      x.current = 0;

      if (y.current + size >= canvas.height - 1) {
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
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");

      if (!canvasRef.current || !context) return;

      img.addEventListener("load", () => {
        if (!canvas || !context) return;
        canvas.height = img.height;
        canvas.width = img.width;
        context.drawImage(img, 0, 0);
        imageRef.current = img;

        resolve(img);
      });
    });
  };

  const setupAudio = () => {
    const audio = audioContext.current;
    const gain = audio.createGain();
    gain.connect(audio.destination);

    const osc = audio.createOscillator();

    gainNode.current = gain;
    oscillator.current = osc;
  };

  useEffect(() => {
    setupAudio();
    setupCanvas();

    return () => {
      stopAnimation();
    };
  }, []);

  const renderPlayControls = () => (
    <>
      <button onClick={() => stopAnimation()}>Stop</button>
      <label htmlFor="fps">FPS</label>
      <input
        name="fps"
        type="range"
        min="0"
        max="50"
        value={fps}
        onChange={(e) => setFps(parseInt(e.target.value, 10))}
      />
      <label htmlFor="sampleSize">Sample Size</label>
      <input
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
    <main>
      <div>
        <select
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
        {isAnimating ? (
          renderPlayControls()
        ) : (
          <button onClick={() => startAnimation()}>Play</button>
        )}
      </div>
      <canvas ref={canvasRef} />
    </main>
  );
}

export default App;
