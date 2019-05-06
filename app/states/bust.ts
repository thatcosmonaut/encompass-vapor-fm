import { World, WorldBuilder } from "encompass-ecs";
import { Engine as BabylonEngine, Scene, UniversalCamera, Vector3, HemisphericLight, PointLight, SceneLoader, MeshBuilder, StandardMaterial } from "babylonjs";
import { OBJFileLoader } from "babylonjs-loaders";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { GrowthSpeedComponent } from "../components/growth_speed";
import { MeshComponent } from "../components/mesh_component";
import { SceneComponent } from "../components/scene";
import { WrapScaleComponent } from "../components/wrap_scale";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { GrowthDetector } from "../engines/growth";
import { TransformObjectEngine } from "../engines/transform_object";
import { SceneRenderer } from "../renderers/scene";
import { GameState } from "./gamestate";

export class BustState extends GameState {
    private world: World;

    public constructor(engine: BabylonEngine) {
        super(engine);
        const world_builder = new WorldBuilder();

        world_builder.add_engine(AngularVelocityEngine);
        world_builder.add_engine(GrowthDetector);
        world_builder.add_engine(TransformObjectEngine);

        world_builder.add_renderer(SceneRenderer);

        const scene_entity = world_builder.create_entity();
        const scene_component = scene_entity.add_component(SceneComponent);
        scene_component.scene = new Scene(engine);

        const obj_loader = new OBJFileLoader();

        const camera = new UniversalCamera("sceneCamera", new Vector3(0, 0, -6), scene_component.scene);
        camera.fov = 1.3;
        const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 0, 1), scene_component.scene);
        const pointLight = new PointLight("pointLight", new Vector3(10, 20, 20), scene_component.scene);

        const model_entity = world_builder.create_entity();
        const object_component = model_entity.add_component(MeshComponent);
        const angular_velocity = model_entity.add_component(AngularVelocityComponent);
        angular_velocity.x = 0;
        angular_velocity.y = 2;
        angular_velocity.z = 0;

        SceneLoader.LoadAssetContainer("models/", "romanbustrecalc.obj", scene_component.scene, (container) => {
            const mesh = container.meshes[0];
            mesh.material = new StandardMaterial("bustMaterial", scene_component.scene);
            mesh.scaling.set(0.14, 0.14, 0.14);
            mesh.position.set(0, -3.5, 0);
            object_component.mesh = mesh;
            scene_component.scene.addMesh(mesh);
        });

        // object_loader.load("models/romanbustrecalc.obj", (object) => {
        //     const bustMaterial = new MeshPhongMaterial({color: 0xffffff, wireframe: false});

        //     object.traverse((child) => {
        //         if (child instanceof Mesh) {
        //             child.material = bustMaterial;
        //         }
        //     });
        //     object.scale.set(0.14, 0.14, 0.14);
        //     object.position.set(0, -3.5, 0);
        //     object_component.object = object;
        //     scene_component.scene.add(object);
        // });

        // const line_material = new LineBasicMaterial({color: 0xffffff, linewidth: 2});
        // for (let i = 0; i < 20; i++) {
        //     const line_box_geometry = new Geometry();
        //     line_box_geometry.vertices.push(new Vector3(-20, 10, -10));
        //     line_box_geometry.vertices.push(new Vector3(20, 10, -10));
        //     line_box_geometry.vertices.push(new Vector3(20, -10, -10));
        //     line_box_geometry.vertices.push(new Vector3(-20, -10, -10));
        //     line_box_geometry.vertices.push(new Vector3(-20, 10, -10));
        //     const line_box = new Line(line_box_geometry, line_material);

        //     const scale_factor = (i * 0.5) * 0.2;
        //     line_box.scale.set(scale_factor, scale_factor, scale_factor);

        //     scene_component.scene.add(line_box);

        //     const line_entity = world_builder.create_entity();
        //     const line_object_component = line_entity.add_component(ObjectComponent);
        //     const grow_component = line_entity.add_component(GrowthSpeedComponent);
        //     grow_component.x = 0.2;
        //     grow_component.y = 0.2;
        //     grow_component.z = 0.2;
        //     const wrap_scale_component = line_entity.add_component(WrapScaleComponent);
        //     wrap_scale_component.x = 1.5;
        //     wrap_scale_component.y = 1.5;
        //     wrap_scale_component.z = 1.5;
        //     line_object_component.object = line_box;
        // }

        // const skybox_geometry = new BoxGeometry(500, 500, 500);
        // const skybox_material = new MeshBasicMaterial({color: 0x1100ff, side: BackSide});
        // const skybox = new Mesh(skybox_geometry, skybox_material);
        // scene_component.scene.add(skybox);

        // const skybox_entity = world_builder.create_entity();
        // const skybox_object_component = skybox_entity.add_component(ObjectComponent);
        // skybox_object_component.object = skybox;

        this.world = world_builder.build();
    }

    public update(dt: number) {
        this.world.update(dt);
    }

    public draw() {
        this.world.draw();
    }
}
