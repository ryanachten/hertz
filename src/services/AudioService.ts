import { createContext } from "react";
import { Note, NOTE_LOOKUP } from "../constants/notes";

export type Sample = {
  rgb: number;
  releaseTime: number;
  attackTime: number;
  sweepLength: number;
};

class AudioService {
  private readonly _context = new AudioContext();
  private _waveform: OscillatorType = "sine";

  public playSample({
    rgb,
    attackTime,
    sweepLength,
    releaseTime,
  }: Sample): Note {
    const time = this._context.currentTime;
    const note = this.rgbToNote(rgb);

    const osc = new OscillatorNode(this._context, {
      type: this._waveform,
      frequency: note.frequency,
    });
    const gain = new GainNode(this._context);
    gain.gain.cancelScheduledValues(time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + attackTime);
    gain.gain.linearRampToValueAtTime(0, time + sweepLength - releaseTime);

    osc.connect(gain).connect(this._context.destination);
    osc.start(time);
    osc.stop(time + sweepLength);

    return note;
  }

  public updateWaveform(value: OscillatorType) {
    this._waveform = value;
  }

  /**
   * Maps RGB value to note
   * @param rgbValue must be between 0 and 255
   */
  private rgbToNote(rgbValue: number): Note {
    if (rgbValue === 0) return NOTE_LOOKUP[0];

    const percentage = rgbValue / 255;
    const noteIndex = Math.round(percentage * (NOTE_LOOKUP.length - 1));
    if (!NOTE_LOOKUP[noteIndex]) {
      debugger;
    }

    return NOTE_LOOKUP[noteIndex];
  }
}

export const AudioServiceSingleton = new AudioService();
export const AudioServiceContext = createContext(AudioServiceSingleton);
