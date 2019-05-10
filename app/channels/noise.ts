import { PostProcess, UniversalCamera, Vector3, PassPostProcess } from "babylonjs";
import { Scene } from "babylonjs/scene";
import { World, WorldBuilder } from "encompass-ecs";
import { NoiseComponent } from "../components/noise";
import { SceneComponent } from "../components/scene";
import { NoiseEngine } from "../engines/noise";
import { StreamManager } from "../helpers/stream_manager";
import { SceneRenderer } from "../renderers/scene";
import { Channel } from "./channel";

export class NoiseChannel extends Channel {
    private world: World;

    public constructor(scene: Scene, stream_manager: StreamManager) {
        super(scene, stream_manager);

        const world_builder = new WorldBuilder();

        world_builder.add_engine(NoiseEngine);

        world_builder.add_renderer(SceneRenderer);

        world_builder.create_entity().add_component(SceneComponent).scene = scene;

        const camera = new UniversalCamera("sceneCamera", new Vector3(), scene);

        const postprocess_entity = world_builder.create_entity();

        const noise_component = postprocess_entity.add_component(NoiseComponent);
        noise_component.time = 0;
        noise_component.amount = 1;
        const noise_effect = new PostProcess(
            "noise",
            "./assets/shaders/noise",
            ["time", "amount"],
            null,
            1.0,
            camera
        );
        noise_effect.onApply = effect => {
            effect.setFloat("time", noise_component.time);
            effect.setFloat("amount", noise_component.amount);
        }
        noise_component.effect = noise_effect;

        this.channelPass = new PassPostProcess("pass", 1.0, camera);

        this.world = world_builder.build();
    }

    public update(dt: number) {
        this.world.update(dt);
    }

    public draw() {
        this.world.draw();
    }
}
