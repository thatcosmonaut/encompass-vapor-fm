import { WebGLRenderer } from "three";

export class GameState {
    protected renderer: WebGLRenderer;

    constructor(renderer: WebGLRenderer) {
        this.renderer = renderer;
    }

    public update(dt: number) {}

    public draw() {}
}
