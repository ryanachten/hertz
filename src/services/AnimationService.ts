import { createContext } from "react";

class AnimationService {
  public readonly eventName = "AnimationServiceEvent";
  public fps = 24;
  public isAnimating = false;

  private readonly _animationEvent = new CustomEvent(this.eventName);
  private _previousTime = 0;
  private _currentFrame = 0;

  private fpsInterval = () => 1000 / this.fps;

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
}

export const AnimationServiceSingleton = new AnimationService();
export const AnimationServiceContext = createContext(AnimationServiceSingleton);
