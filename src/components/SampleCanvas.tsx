import { useContext, useEffect, useRef } from "react";
import { StandardAnimationContext } from "../services/AnimationService";
import { AudioServiceContext, Sample } from "../services/AudioService";

type Signal = keyof Sample;

const SampleCanvas = () => {
  const audioServiceContext = useContext(AudioServiceContext);
  const standardAnimation = useContext(StandardAnimationContext);
  const queueLength = 100;
  const sampleQueue = useRef<Array<Sample | null>>(
    new Array<Sample | null>(queueLength)
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Setup animation handler
  useEffect(() => {
    window.addEventListener(standardAnimation.eventName, handleStandardFrame);
    return () => {
      window.removeEventListener(
        standardAnimation.eventName,
        handleStandardFrame
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStandardFrame = () => {
    const sample = audioServiceContext.getCurrentSampleState();
    const queue = sampleQueue.current;
    queue.unshift(sample); // append new sample to start of queue
    queue.pop(); // remove last entry from queue to retain fixed length

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const height = canvas.height;
    const width = canvas.width;

    ctx.clearRect(0, 0, width, height);
    drawSignal("attackTime", 2, "red", canvas);
    drawSignal("releaseTime", 2, "blue", canvas);
    drawSignal("sweepLength", 10, "green", canvas);
    drawSignal("rgb", 255, "orange", canvas);
  };

  const drawSignal = (
    signal: Signal,
    maxValue: number,
    color: string,
    canvas: HTMLCanvasElement
  ) => {
    const ctx = canvas.getContext("2d");
    const queue = sampleQueue.current;
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const sliceWidth = width / queueLength;
    let x = 0;

    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i < queueLength; i++) {
      const sample = queue[i];
      if (!sample) return;
      const v = sample[signal] / maxValue;
      const y = height - v * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  return (
    <canvas height={300} width={800} className="max-w-lg" ref={canvasRef} />
  );
};

export default SampleCanvas;
