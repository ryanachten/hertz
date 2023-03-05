import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useSettingRef from "../hooks/useSelectRef";
import { getSetting } from "../selectors/settings.selectors";
import { AnimationServiceContext } from "../services/AnimationService";
import { AudioServiceContext } from "../services/AudioService";

export interface IBackgroundCanvas {
  image: HTMLImageElement;
  x: MutableRefObject<number>;
  y: MutableRefObject<number>;
}

const BackgroundCanvas = ({ image, x, y }: IBackgroundCanvas) => {
  const audioServiceContext = useContext(AudioServiceContext);
  const animationServiceContext = useContext(AnimationServiceContext);

  const sampleSize = useSettingRef("sampleSize");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brightness = useSelector(getSetting)("brightness");

  // Setup animation handler
  useEffect(() => {
    window.addEventListener(animationServiceContext.eventName, handleFrame);
    return () => {
      window.removeEventListener(
        animationServiceContext.eventName,
        handleFrame
      );
    };
  }, []);

  // Draw image
  useEffect(() => {
    const background = canvasRef.current;
    const img = image;

    const backgroundCtx = background?.getContext("2d");
    if (!background || !backgroundCtx) return;

    background.height = image.height;
    background.width = image.width;
    backgroundCtx.drawImage(img, 0, 0);

    // Update brightness if set
    if (brightness === 0) return;
    const imageData = backgroundCtx.getImageData(
      0,
      0,
      background.width,
      background.height
    );
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + brightness; // red
      data[i + 1] = data[i + 1] + brightness; // green
      data[i + 2] = data[i + 2] + brightness; // blue
    }
    backgroundCtx.putImageData(imageData, 0, 0);
  }, [brightness, image]);

  const handleFrame = () => {
    const backgroundCtx = canvasRef.current?.getContext("2d");
    const size = sampleSize.current;

    if (!backgroundCtx) return;
    const { data } = backgroundCtx.getImageData(
      x.current,
      y.current,
      size,
      size
    );

    audioServiceContext.updateOutput((data[0] + data[1] + data[2]) / 3); // TODO: this is actually only taking the brightness of the first pixel
  };

  return <canvas className="max-w-lg" ref={canvasRef} />;
};

export default BackgroundCanvas;
