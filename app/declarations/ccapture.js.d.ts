declare class CCapture {
    constructor(options: {format: string, framerate?: number, timeLimit?: number});
    start(): void;
    capture(canvas: HTMLCanvasElement): void;
    save(): void;
    stop(): void;
  }
