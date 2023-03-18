import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { useRangeSettingRef } from "../hooks/useSelectorRef";
import { AudioAnimationContext } from "../services/AnimationService";

export interface IBackgroundCanvas {
  image: HTMLImageElement;
  x: MutableRefObject<number>;
  y: MutableRefObject<number>;
}

const ForegroundCanvas = ({ image, x, y }: IBackgroundCanvas) => {
  const animationServiceContext = useContext(AudioAnimationContext);

  const sampleSize = useRangeSettingRef("sampleSize");
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Resize canvas on image update
  useEffect(() => {
    const foreground = canvasRef.current;
    if (!foreground) return;

    foreground.height = image.height;
    foreground.width = image.width;
  }, [image]);

  const handleFrame = () => {
    const foreground = canvasRef.current;
    const foregroundCtx = foreground?.getContext("2d");
    const size = sampleSize.current;

    if (!foreground || !foregroundCtx) return;
    foregroundCtx.clearRect(0, 0, foreground.width, foreground.height);

    foregroundCtx.strokeRect(x.current, y.current, size, size);
  };

  return <canvas className="max-w-lg absolute top-0 left-0" ref={canvasRef} />;
};

export default ForegroundCanvas;
