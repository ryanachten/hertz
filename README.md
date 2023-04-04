![Hertz banner](./docs/hertz_banner.png)

Generative audio experiment using pixels values of a source image to produce frequencies.
I certainly wouldn't call the output "music", but the sounds it produces are pretty interesting, ranging from unlistenable hash noise to ambient textures.

![Hertz autoplay mode](./docs/hertz_autoplay.gif)

## Signal processing

To generate a note, the following signal processing takes place:

1. the RGB values of a pixel are determined in the `BackgroundCanvas`
2. these values are passed to the `AudioService` where the they are mapped to a note
3. the frequency of this note is assigned to an oscillator node
4. the oscillator node is attached to a gain node which is attached to the audio output
5. the frequency and other parameters of a given sample are displayed using the `SampleCanvas`
6. the resulting audio output is sampled using an audio analyser, the output of which is rendered using the `AudioCanvas`

![Hertz signal processing](./docs/hertz_signal-processing.png)

## Using hertz

Hertz can be used in one of two modes:

1. Autoplay - will randomly set different parameters at a given interval
2. Manual - allows user to control all parameters

Developers can run hertz locally by simply running `yarn start`

![Hertz manual mode](./docs/hertz_manual.jpg)
