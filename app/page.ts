import {
    WebGLRenderer,
    WebGLRenderTarget,
} from "three";
import { BustState } from "./states/bust";
import { GameState } from "./states/gamestate";

export class Page {
    private renderer: WebGLRenderer;
    private current_state: GameState;
    private bust_state: BustState;

    public load() {
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        const render_target = new WebGLRenderTarget(window.innerWidth, window.innerHeight);

        this.bust_state = new BustState(this.renderer);
        this.current_state = this.bust_state;

        // const noise_shader_entity = world_builder.create_entity();
        // noise_shader_entity.add_component(NoiseShaderComponent);
    }

    public update(dt: number) {
        this.current_state.update(dt);
    }

    public draw() {
        this.renderer.clear();
        this.current_state.draw();
    }
}
