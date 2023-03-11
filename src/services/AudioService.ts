import { createContext } from "react";

export type Note = {
  frequency: number;
  releaseTime: number;
  attackTime: number;
  sweepLength: number;
};

class AudioService {
  private readonly _context = new AudioContext();
  private _waveform: OscillatorType = "sine";

  public playNote({ frequency, attackTime, sweepLength, releaseTime }: Note) {
    const time = this._context.currentTime;
    const osc = new OscillatorNode(this._context, {
      type: this._waveform,
      frequency,
    });
    const gain = new GainNode(this._context);
    gain.gain.cancelScheduledValues(time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + attackTime);
    gain.gain.linearRampToValueAtTime(0, time + sweepLength - releaseTime);

    osc.connect(gain).connect(this._context.destination);
    osc.start(time);
    osc.stop(time + sweepLength);
  }

  public updateWaveform(value: OscillatorType) {
    this._waveform = value;
  }
}

export const AudioServiceSingleton = new AudioService();
export const AudioServiceContext = createContext(AudioServiceSingleton);
