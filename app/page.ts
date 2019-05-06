import { World, WorldBuilder } from "encompass-ecs";
import {
    AmbientLight,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
    WebGLRenderTarget,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { AngularVelocityComponent } from "./components/angular_velocity";
import { NoiseShaderComponent } from "./components/noise_shader";
import { ObjectComponent } from "./components/object_3d_component";
import { SceneComponent } from "./components/scene";
import { AngularVelocityEngine } from "./engines/angular_velocity";
import { NoiseShaderEngine } from "./engines/noise_shader";
import { RotateEngine } from "./engines/rotate";
import { NoiseRenderer } from "./renderers/noise";
import { SceneRenderer } from "./renderers/scene";

export class Page {
    private renderer: WebGLRenderer;
    private noise_world: World;

    public load() {
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const render_target = new WebGLRenderTarget(window.innerWidth, window.innerHeight);

        const world_builder = new WorldBuilder();

        // ADD YOUR ENGINES HERE...
        world_builder.add_engine(NoiseShaderEngine);
        world_builder.add_engine(RotateEngine);
        world_builder.add_engine(AngularVelocityEngine);

        // ADD YOUR RENDERERS HERE...
        world_builder.add_renderer(NoiseRenderer).initialize(
            this.renderer,
            render_target,
        );

        world_builder.add_renderer(SceneRenderer).initialize(
            this.renderer,
        );

        const object_loader = new OBJLoader();

        const scene_entity = world_builder.create_entity();
        const scene_component = scene_entity.add_component(SceneComponent);
        scene_component.scene = new Scene();
        scene_component.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        scene_component.camera.position.z = 6;

        const ambientLight = new AmbientLight(0x404040);
        scene_component.scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 20, 20);
        scene_component.scene.add(pointLight);

        const model_entity = world_builder.create_entity();
        const object_component = model_entity.add_component(ObjectComponent);
        const angular_velocity = model_entity.add_component(AngularVelocityComponent);
        angular_velocity.x = 0;
        angular_velocity.y = 2;
        angular_velocity.z = 0;

        object_loader.load("models/romanbustrecalc.obj", (object) => {
            const bustMaterial = new MeshPhongMaterial({color: 0xffffff, wireframe: false});

            object.traverse((child) => {
                if (child instanceof Mesh) {
                    child.material = bustMaterial;
                }
            });
            object.scale.set(0.14, 0.14, 0.14);
            object.position.set(0, -3.5, 0);
            object_component.object = object;
            scene_component.scene.add(object);
        });

        // const noise_shader_entity = world_builder.create_entity();
        // noise_shader_entity.add_component(NoiseShaderComponent);

        this.noise_world = world_builder.build();
    }

    public update(dt: number) {
        this.noise_world.update(dt);
    }

    public draw() {
        this.renderer.clear();
        this.noise_world.draw();
    }
}
