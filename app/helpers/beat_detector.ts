export class BeatDetector {
    private beatdetect: FFT.BeatDetect;

    constructor(frequencyBinCount: number, sampleRate: number, floats: Float32Array) {
        this.beatdetect = new FFT.BeatDetect(frequencyBinCount, sampleRate);
    }

    public update(floats: Float32Array) {
        this.beatdetect.detect(floats);
    }

    public isKick(): boolean {
        return this.beatdetect.isKick();
    }

    public isSnare(): boolean {
        return this.beatdetect.isSnare();
    }

    public setSensitivity(num: number): void {
        this.beatdetect.setSensitivity(num);
    }
}
