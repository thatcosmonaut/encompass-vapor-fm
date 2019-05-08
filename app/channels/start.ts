import { Channel } from "./channel";
import { World, WorldBuilder } from "encompass-ecs";
import { Scene, PassPostProcess, UniversalCamera, Vector3, Color4, MeshBuilder, PostProcess, BaseTexture, Texture } from "babylonjs";
import { StreamManager } from "../helpers/stream_manager";
import { SceneComponent } from "../components/scene";
import { SceneRenderer } from "../renderers/scene";
import { AdvancedDynamicTexture, Image, Control, Line, TextBlock } from "babylonjs-gui";
import { RippleEffectComponent } from "../components/ripple_effect";
import { RippleEffectEngine } from "../engines/ripple_effect";

export class StartChannel extends Channel {
    private world: World;

    public constructor(scene: Scene, stream_manager: StreamManager) {
        super(scene, stream_manager);

        const world_builder = new WorldBuilder();

        world_builder.add_engine(RippleEffectEngine);

        world_builder.add_renderer(SceneRenderer);

        const scene_entity = world_builder.create_entity();
        const scene_component = scene_entity.add_component(SceneComponent);
        scene_component.scene = scene;

        scene.clearColor = new Color4(164 / 255, 213 / 255, 245 / 255, 1);

        const camera = new UniversalCamera("startChannelCamera", new Vector3(), scene);
        camera.fov = 1.3;

        const plane = MeshBuilder.CreatePlane("texturePlane", {
            size: 600
        });
        plane.position.set(0, 0, 0);
        scene.addMesh(plane);

        camera.position.z = -225;

        const ui = AdvancedDynamicTexture.CreateForMesh(plane, 600, 600, false);
        ui.background = "#a4d5f5";

        const logo_header = new Image("logoHeader", "/assets/images/logo_header.png");
        logo_header.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        logo_header.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        logo_header.stretch = Image.STRETCH_UNIFORM;
        logo_header.top = -60;
        logo_header.width = "80%";
        ui.addControl(logo_header);

        const line = new Line("headerLine");
        line.x1 = 50;
        line.y1 = 320;
        line.x2 = 550;
        line.y2 = 320;
        line.lineWidth = 1;
        line.color = "#6ba8e5";
        ui.addControl(line);

        const text = new TextBlock("pressAnyKey", "Press any key to begin");
        text.fontFamily = "DolphinOceanWave";
        text.fontSize = 32;
        text.color = "white";
        text.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        text.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        text.top = 50;
        text.outlineColor = "black";
        text.outlineWidth = 2;
        ui.addControl(text);

        const postprocess_entity = world_builder.create_entity();
        const ripple_component = postprocess_entity.add_component(RippleEffectComponent);
        ripple_component.time = 0;
        const ripple_effect = new PostProcess(
            "ripple",
            "./assets/shaders/ripple",
            ["time", "screenSize"],
            ["iChannel1", "iChannel2"],
            1.0,
            camera
        );
        const noise_texture = new Texture("./assets/images/rgba-noise.png", scene);
        const cube_map_texture = new Texture("./assets/images/cubemap.png", scene);

        ripple_effect.onApply = effect => {
            effect.setFloat2("screenSize", window.innerWidth, window.innerHeight);
            effect.setTexture("iChannel1", noise_texture);
            effect.setTexture("iChannel2", cube_map_texture);
            effect.setFloat("time", ripple_component.time);
        };
        ripple_component.effect = ripple_effect;

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
