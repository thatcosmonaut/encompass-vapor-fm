declare namespace FFT {
  export class fft {
    constructor(timeSize: number, sampleRate: number);
    logAverages(minBandwidth: number, bandsPerOctave: number): void;
    avgSize(): number;
    getAvg(i: number): number;
    calcAvg(lowFreq: number, hiFreq: number): number;
    forward(buffer: number[]): void;
  }

  export class BeatDetect {
    constructor(timeSize: number, sampleRate: number);
    detect(buffer: Float32Array): void;
    detectSize(): number;
    setSensitivity(millis: number): void;
    isKick(): boolean;
    isSnare(): boolean;
    isRange(low: number, high: number, threshold: number): boolean;
  }
}
