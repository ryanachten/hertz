import { useContext, useEffect, useRef } from "react";
import { StandardAnimationContext } from "../services/AnimationService";
import { AudioServiceContext } from "../services/AudioService";
import useResponsiveCanvas from "../hooks/useResponsiveCanvas";

const AudioCanvas = () => {
  const audioServiceContext = useContext(AudioServiceContext);
  const standardAnimation = useContext(StandardAnimationContext);

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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const data = audioServiceContext.getFrequencyData();

    const height = canvas.height;
    const width = canvas.width;

    ctx.clearRect(0, 0, width, height);

    const sliceWidth = width / data.length;
    ctx.beginPath();
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 255;
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

  return <canvas className="w-full h-44 mb-4" ref={canvasRef} />;
};

export default AudioCanvas;
