import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { useRangeSettingRef } from "../hooks/useSelectorRef";
import useResponsiveCanvas from "../hooks/useResponsiveCanvas";
import { AudioAnimationContext } from "../services/AnimationService";

export interface IBackgroundCanvas {
  x: MutableRefObject<number>;
  y: MutableRefObject<number>;
}

const ForegroundCanvas = ({ x, y }: IBackgroundCanvas) => {
  const animationServiceContext = useContext(AudioAnimationContext);

  const sampleSize = useRangeSettingRef("sampleSize");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useResponsiveCanvas(canvasRef);

  // Setup animation handler
  useEffect(() => {
    window.addEventListener(animationServiceContext.eventName, handleFrame);
    return () => {
      window.removeEventListener(
        animationServiceContext.eventName,
        handleFrame
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFrame = () => {
    const foreground = canvasRef.current;
    const foregroundCtx = foreground?.getContext("2d");
    const size = sampleSize.current;

    if (!foreground || !foregroundCtx) return;
    foregroundCtx.clearRect(0, 0, foreground.width, foreground.height);

    foregroundCtx.strokeRect(x.current, y.current, size, size);
  };

  return (
    <canvas className="h-full w-full absolute top-0 left-0" ref={canvasRef} />
  );
};

export default ForegroundCanvas;
