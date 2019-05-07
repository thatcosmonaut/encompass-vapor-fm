import { BlurPostProcess, DefaultRenderingPipeline, Engine, PostProcess, Scene, UniversalCamera, Vector2, Vector3 } from "babylonjs";
import { World, WorldBuilder } from "encompass-ecs";
import { BadTVEffectComponent } from "./components/bad_tv_effect";
import { CRTEffectComponent } from "./components/crt_effect";
import { SceneComponent } from "./components/scene";
import { BadTVEffectEngine } from "./engines/bad_tv_effect";
import { ChangeChannelEngine } from "./engines/change_channel";
import { CRTEffectEngine } from "./engines/crt_effect";
import { InputHandlerEngine } from "./engines/input_handler";
import { SceneRenderer } from "./renderers/scene";
import { BustState } from "./states/bust";
import { CybergridState } from "./states/cybergrid";
import { GameState } from "./states/gamestate";

export class Page {
    private bust_state: BustState;
    private cybergrid_state: CybergridState;
    private current_channel = { current: 4 };
    private channels = new Map<number, GameState>();
    private world: World;

    public load() {
        const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
        const engine = new Engine(canvas, true);

        const scene = new Scene(engine);
        const camera = new UniversalCamera("camera", new Vector3(), scene);

        this.bust_state = new BustState(new Scene(engine));
        this.cybergrid_state = new CybergridState(new Scene(engine));

        this.channels.set(3, this.bust_state);
        this.channels.set(4, this.cybergrid_state);

        const world_builder = new WorldBuilder();

        world_builder.add_engine(InputHandlerEngine).initialize();
        world_builder.add_engine(ChangeChannelEngine).initialize(this.current_channel);
        world_builder.add_engine(CRTEffectEngine);
        world_builder.add_engine(BadTVEffectEngine);

        world_builder.add_renderer(SceneRenderer);

        const scene_entity = world_builder.create_entity();
        scene_entity.add_component(SceneComponent).scene = scene;

        const postProcess1 = new PostProcess(
            "Final compose",
            "./assets/shaders/compose",
            [],
            ["sceneSampler0"],
            1,
            camera,
        );
        postProcess1.onApply = (effect) => {
            effect.setTextureFromPostProcess(
                "sceneSampler0",
                this.channels.get(this.current_channel.current)!.channelPass,
            );
        };

        new BlurPostProcess("horzBlur", new Vector2(1.0, 0), 16, 2.0, camera);
        new BlurPostProcess("vertBlur", new Vector2(0, 1.0), 16, 2.0, camera);

        const pipeline = new DefaultRenderingPipeline("pipeline", true);
        pipeline.bloomEnabled = true;
        pipeline.bloomThreshold = 0.2;
        pipeline.bloomKernel = 64;
        pipeline.bloomWeight = 0.3;
        pipeline.bloomScale = 0.5;

        const postprocess_entity = world_builder.create_entity();
        const crt_effect_component = postprocess_entity.add_component(CRTEffectComponent);
        crt_effect_component.time = 0;
        const crt_effect = new PostProcess(
            "crt", "./assets/shaders/crt_shader", ["screenSize", "time"], null, 1.0, camera,
        );
        crt_effect.onApply = (effect) => {
            effect.setFloat2("screenSize", window.innerWidth, window.innerHeight);
            effect.setFloat("time", crt_effect_component.time);
        };
        crt_effect_component.effect = crt_effect;

        const bad_tv_component = postprocess_entity.add_component(BadTVEffectComponent);
        bad_tv_component.time = 0;
        bad_tv_component.distortion = 0.1;
        bad_tv_component.distortion2 = 0.2;
        bad_tv_component.speed = 0.1;
        bad_tv_component.rollSpeed = 1.0;
        const bad_tv = new PostProcess(
            "badTV",
            "./assets/shaders/badTVShader",
            ["time", "distortion", "distortion2", "speed", "rollSpeed"],
            null,
            1.0,
            camera,
        );

        bad_tv.onApply = (effect) => {
            effect.setFloat("time", bad_tv_component.time);
            effect.setFloat("distortion", bad_tv_component.distortion);
            effect.setFloat("distortion2", bad_tv_component.distortion2);
            effect.setFloat("speed", bad_tv_component.speed);
            effect.setFloat("rollSpeed", bad_tv_component.rollSpeed);
        };
        bad_tv_component.effect = bad_tv;

        this.world = world_builder.build();

        engine.runRenderLoop(() => {
            this.update(engine.getDeltaTime() * 0.001);
            this.draw();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });
    }

    private update(dt: number) {
        this.world.update(dt);
        this.channels.get(this.current_channel.current)!.update(dt);
    }

    private draw() {
        this.channels.get(this.current_channel.current)!.draw();
        this.world.draw();
    }
}
