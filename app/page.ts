import { World, WorldBuilder } from "encompass-ecs";
import { WebGLRenderer, WebGLRenderTarget } from "three";
import { NoiseShaderComponent } from "./components/noise_shader";
import { NoiseShaderEngine } from "./engines/noise_shader";
import { NoiseRenderer } from "./renderers/noise";

export class Page {
    private noise_world: World;

    public load() {
        const renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const render_target = new WebGLRenderTarget(window.innerWidth, window.innerHeight);

        const world_builder = new WorldBuilder();

        // ADD YOUR ENGINES HERE...
        world_builder.add_engine(NoiseShaderEngine);

        // ADD YOUR RENDERERS HERE...
        world_builder.add_renderer(NoiseRenderer).initialize(
            renderer,
            render_target,
        );

        const noise_shader_entity = world_builder.create_entity();
        noise_shader_entity.add_component(NoiseShaderComponent);

        this.noise_world = world_builder.build();
    }

    public update(dt: number) {
        this.noise_world.update(dt);
    }

    public draw() {
        // this.web_gl_renderer.clear();
        this.noise_world.draw();
    }
}
