import { Engine } from "babylonjs";

export class GameState {
    protected engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    public update(dt: number) {}

    public draw() {}
}
