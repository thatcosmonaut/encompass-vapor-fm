import { PostProcess, Scene } from "babylonjs";

export abstract class GameState {
    public channelPass: PostProcess;
    protected scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public abstract update(dt: number): void;

    public abstract draw(): void;
}
