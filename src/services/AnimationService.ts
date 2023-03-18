import { createContext } from "react";

class AnimationService {
  public readonly eventName: string;
  public fps = 24;
  public isAnimating = false;

  private _previousTime = 0;
  private _currentFrame = 0;
  private readonly _animationEvent: CustomEvent;

  constructor(serviceName: string) {
    this.eventName = serviceName;
    this._animationEvent = new CustomEvent(this.eventName);
  }

  public startAnimation() {
    this._previousTime = Date.now();
    this.animate();
    this.isAnimating = true;
  }

  public stopAnimation() {
    cancelAnimationFrame(this._currentFrame);
    this.isAnimating = false;
  }

  /**
   * Delegates animation frame handling to event subscribers
   */
  private animate() {
    this._currentFrame = requestAnimationFrame(() => this.animate());

    const now = Date.now();
    const elapsed = now - this._previousTime;

    if (elapsed > this.fpsInterval()) {
      this._previousTime = now - (elapsed % this.fpsInterval());
      dispatchEvent(this._animationEvent);
    }
  }

  private fpsInterval = () => 1000 / this.fps;
}

export const StandardAnimation = new AnimationService("StandardAnimation");
export const StandardAnimationContext = createContext(StandardAnimation);

export const AudioAnimation = new AnimationService("AudioAnimation");
export const AudioAnimationContext = createContext(AudioAnimation);
