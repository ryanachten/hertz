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
  private readonly _analyser = this._context.createAnalyser();
  private _waveform: OscillatorType = "sine";
  private _sampleState: Sample | null = null;

  /**
   * Plays as an audio sample given various parameters
   */
  public playSample(sample: Sample): Note {
    const { rgb, attackTime, sweepLength, releaseTime } = sample;
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
    gain.connect(this._analyser);
    osc.start(time);
    osc.stop(time + sweepLength);

    this._sampleState = sample;
    return note;
  }

  /**
   * Update the waveform used by the oscillator
   */
  public updateWaveform(value: OscillatorType) {
    this._waveform = value;
  }

  /**
   * Uses an audio analyser to sample frequency data
   */
  public getFrequencyData() {
    const bufferLength = this._analyser.frequencyBinCount;

    const timeDomainData = new Uint8Array(bufferLength);
    this._analyser.getByteFrequencyData(timeDomainData);

    return timeDomainData;
  }

  public getCurrentSampleState = () => this._sampleState;

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
