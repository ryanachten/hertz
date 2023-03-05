import { createContext } from "react";

class AudioService {
  private readonly _context = new AudioContext();
  private readonly _gainNode = this._context.createGain();
  private readonly _oscillatorNode = this._context.createOscillator();
  private _hasStarted = false;

  constructor() {
    this._gainNode.connect(this._context.destination);
  }

  public startOutput() {
    if (!this._hasStarted) {
      this._oscillatorNode.start();
      this._hasStarted = true;
    }
    this._oscillatorNode.connect(this._gainNode);
  }

  public stopOutput() {
    this._oscillatorNode.disconnect();
  }

  public updateOutput(value: number) {
    this._oscillatorNode.frequency.value = value;
  }

  public updateWaveform(value: OscillatorType) {
    this._oscillatorNode.type = value;
  }
}

export const AudioServiceSingleton = new AudioService();
export const AudioServiceContext = createContext(AudioServiceSingleton);
