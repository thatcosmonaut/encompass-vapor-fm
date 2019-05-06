import { World, WorldBuilder } from "encompass-ecs";
import { AmbientLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { ObjectComponent } from "../components/object_3d_component";
import { SceneComponent } from "../components/scene";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { NoiseShaderEngine } from "../engines/noise_shader";
import { RotateEngine } from "../engines/rotate";
import { SceneRenderer } from "../renderers/scene";
import { GameState } from "./gamestate";

export class BustState extends GameState {
    private world: World;

    public constructor(renderer: WebGLRenderer) {
        super(renderer);
        const world_builder = new WorldBuilder();

        world_builder.add_engine(NoiseShaderEngine);
        world_builder.add_engine(RotateEngine);
        world_builder.add_engine(AngularVelocityEngine);

        world_builder.add_renderer(SceneRenderer).initialize(
            this.renderer,
        );

        this.world = world_builder.build();

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
    }

    public update(dt: number) {
        this.world.update(dt);
    }

    public draw() {
        this.world.draw();
    }
}
