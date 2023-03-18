import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRangeSettingRef } from "../hooks/useSelectorRef";
import { updateColour, updateNote } from "../reducers/animation.reducer";
import { getRangeSetting } from "../selectors/settings.selectors";
import { AudioAnimationContext } from "../services/AnimationService";
import { AudioServiceContext } from "../services/AudioService";

export interface IBackgroundCanvas {
  image: HTMLImageElement;
  x: MutableRefObject<number>;
  y: MutableRefObject<number>;
}

const BackgroundCanvas = ({ image, x, y }: IBackgroundCanvas) => {
  const dispatch = useDispatch();
  const audioServiceContext = useContext(AudioServiceContext);
  const animationServiceContext = useContext(AudioAnimationContext);

  const sampleSizeRef = useRangeSettingRef("sampleSize");
  const releaseRef = useRangeSettingRef("release");
  const attackRef = useRangeSettingRef("attack");
  const sweepRef = useRangeSettingRef("sweep");
  const sampleSize = useSelector(getRangeSetting)("sampleSize");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brightness = useSelector(getRangeSetting)("brightness");

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

  // Draw image
  useEffect(() => {
    const background = canvasRef.current;
    const img = image;

    const backgroundCtx = background?.getContext("2d");
    if (!background || !backgroundCtx) return;

    background.height = image.height;
    background.width = image.width;
    backgroundCtx.drawImage(img, 0, 0);

    // Apply brightness transformations if needed
    if (brightness !== 0) {
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
    }
  }, [brightness, image, sampleSize]);

  const handleFrame = () => {
    const backgroundCtx = canvasRef.current?.getContext("2d");
    const size = sampleSizeRef.current;

    if (!backgroundCtx) return;
    const { data } = backgroundCtx.getImageData(
      x.current,
      y.current,
      size,
      size
    );

    // This just samples the first pixel in the sample range
    // TODO: look at getting an average or median
    const red = data[0];
    const green = data[1];
    const blue = data[2];

    dispatch(
      updateColour({
        red,
        green,
        blue,
      })
    );

    const note = audioServiceContext.playSample({
      rgb: (red + green + blue) / 3,
      releaseTime: releaseRef.current / 100,
      attackTime: attackRef.current / 100,
      sweepLength: sweepRef.current,
    });

    dispatch(updateNote(note));
  };

  return <canvas className="max-w-lg" ref={canvasRef} />;
};

export default BackgroundCanvas;
