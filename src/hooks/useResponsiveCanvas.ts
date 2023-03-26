import { RefObject, useEffect } from "react";

const useResponsiveCanvas = (
  ref: RefObject<HTMLCanvasElement>,
  onResizeHandler?: () => void
) => {
  useEffect(() => {
    window.addEventListener("resize", syncClientDimensions);
    syncClientDimensions();

    return () => {
      window.removeEventListener("resize", syncClientDimensions);
    };
  }, []);

  /**
   * Synchronizes canvas dimensions with client dimensions
   */
  const syncClientDimensions = () => {
    const canvas = ref.current;

    if (!canvas) return;
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    if (onResizeHandler) onResizeHandler();
  };
};

export default useResponsiveCanvas;
