import { World, WorldBuilder } from "encompass-ecs";
import {
    AmbientLight,
    BackSide,
    BoxGeometry,
    Geometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { GrowthSpeedComponent } from "../components/growth_speed";
import { ObjectComponent } from "../components/object_3d_component";
import { SceneComponent } from "../components/scene";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { GrowthDetector } from "../engines/growth";
import { NoiseShaderEngine } from "../engines/noise_shader";
import { TransformObjectEngine } from "../engines/transform_object";
import { SceneRenderer } from "../renderers/scene";
import { GameState } from "./gamestate";
import { WrapScaleComponent } from "../components/wrap_scale";

export class BustState extends GameState {
    private world: World;

    public constructor(renderer: WebGLRenderer) {
        super(renderer);
        const world_builder = new WorldBuilder();

        world_builder.add_engine(NoiseShaderEngine);
        world_builder.add_engine(AngularVelocityEngine);
        world_builder.add_engine(GrowthDetector);
        world_builder.add_engine(TransformObjectEngine);

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

        const line_material = new LineBasicMaterial({color: 0xffffff, linewidth: 2});
        for (let i = 0; i < 20; i++) {
            const line_box_geometry = new Geometry();
            line_box_geometry.vertices.push(new Vector3(-20, 10, -10));
            line_box_geometry.vertices.push(new Vector3(20, 10, -10));
            line_box_geometry.vertices.push(new Vector3(20, -10, -10));
            line_box_geometry.vertices.push(new Vector3(-20, -10, -10));
            line_box_geometry.vertices.push(new Vector3(-20, 10, -10));
            const line_box = new Line(line_box_geometry, line_material);

            const scale_factor = (i * 0.5) * 0.2;
            line_box.scale.set(scale_factor, scale_factor, scale_factor);

            scene_component.scene.add(line_box);

            const line_entity = world_builder.create_entity();
            const line_object_component = line_entity.add_component(ObjectComponent);
            const grow_component = line_entity.add_component(GrowthSpeedComponent);
            grow_component.x = 0.2;
            grow_component.y = 0.2;
            grow_component.z = 0.2;
            const wrap_scale_component = line_entity.add_component(WrapScaleComponent);
            wrap_scale_component.x = 1.5;
            wrap_scale_component.y = 1.5;
            wrap_scale_component.z = 1.5;
            line_object_component.object = line_box;
        }

        const skybox_geometry = new BoxGeometry(500, 500, 500);
        const skybox_material = new MeshBasicMaterial({color: 0x1100ff, side: BackSide});
        const skybox = new Mesh(skybox_geometry, skybox_material);
        scene_component.scene.add(skybox);

        const skybox_entity = world_builder.create_entity();
        const skybox_object_component = skybox_entity.add_component(ObjectComponent);
        skybox_object_component.object = skybox;

        this.world = world_builder.build();
    }

    public update(dt: number) {
        this.world.update(dt);
    }

    public draw() {
        this.world.draw();
    }
}
