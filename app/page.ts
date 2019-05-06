import { Engine } from "babylonjs";
import { BustState } from "./states/bust";
import { GameState } from "./states/gamestate";

export class Page {
    private current_state: GameState;
    private bust_state: BustState;

    public load() {
        const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
        const engine = new Engine(canvas, true);

        this.bust_state = new BustState(engine);
        this.current_state = this.bust_state;

        engine.runRenderLoop(() => {
            this.update(engine.getDeltaTime() * 0.001);
            this.draw();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });
    }

    private update(dt: number) {
        this.current_state.update(dt);
    }

    private draw() {
        this.current_state.draw();
    }
}
