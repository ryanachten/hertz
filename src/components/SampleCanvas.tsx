import { useContext, useEffect, useRef } from "react";
import useResponsiveCanvas from "../hooks/useResponsiveCanvas";
import { StandardAnimationContext } from "../services/AnimationService";
import { AudioServiceContext, Sample } from "../services/AudioService";
import theme from "../theme";

type Signal = keyof Sample;

const SampleCanvas = () => {
  const audioServiceContext = useContext(AudioServiceContext);
  const standardAnimation = useContext(StandardAnimationContext);
  const queueLength = 100;
  const sampleQueue = useRef<Array<Sample | null>>(
    new Array<Sample | null>(queueLength)
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useResponsiveCanvas(canvasRef, () => handleStandardFrame());

  // Setup animation handler
  useEffect(() => {
    window.addEventListener(standardAnimation.eventName, handleStandardFrame);
    return () => {
      window.removeEventListener(
        standardAnimation.eventName,
        handleStandardFrame
      );
    };
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
    drawSignal("attackTime", 2, theme.info, canvas);
    drawSignal("releaseTime", 2, theme.accent, canvas);
    drawSignal("sweepLength", 10, theme.success, canvas);
    drawSignal("rgb", 255, theme.neutral, canvas);
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
      const v = sample ? sample[signal] / maxValue : 0;
      const y = height - v * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }
    ctx.stroke();
  };

  return (
    <div className="flex mb-4">
      <div className="flex flex-col justify-between w-28 py-2">
        <div className="badge badge-neutral badge-s mr-2">Frequency</div>
        <div className="badge badge-info badge-s mr-2">Attack Time</div>
        <div className="badge badge-accent badge-s mr-2">Release Time</div>
        <div className="badge badge-success badge-s">Sweep Length</div>
      </div>
      <canvas className="grow h-44" ref={canvasRef} />
    </div>
  );
};

export default SampleCanvas;
