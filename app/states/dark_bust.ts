import { HemisphericLight, PointLight, Scene, SceneLoader, StandardMaterial, UniversalCamera, Vector3, PassPostProcess, Color4 } from "babylonjs";
import { OBJFileLoader } from "babylonjs-loaders";
import { World, WorldBuilder } from "encompass-ecs";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { MeshComponent } from "../components/mesh_component";
import { SceneComponent } from "../components/scene";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { GrowthDetector } from "../engines/growth";
import { TransformObjectEngine } from "../engines/transform_object";
import { SceneRenderer } from "../renderers/scene";
import { GameState } from "./gamestate";

export class DarkBustState extends GameState {
    private world: World;

    public constructor(scene: Scene) {
        super(scene);
        const world_builder = new WorldBuilder();
        world_builder.add_engine(AngularVelocityEngine);
        world_builder.add_engine(GrowthDetector);
        world_builder.add_engine(TransformObjectEngine);

        world_builder.add_renderer(SceneRenderer);

        const scene_entity = world_builder.create_entity();
        const scene_component = scene_entity.add_component(SceneComponent);
        scene_component.scene = scene;

        const obj_loader = new OBJFileLoader();

        const camera = new UniversalCamera("sceneCamera", new Vector3(0, 0, -6), scene_component.scene);
        camera.fov = 1.3;
        const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 0, 1), scene_component.scene);
        const pointLight = new PointLight("pointLight", new Vector3(10, 20, 20), scene_component.scene);

        const model_entity = world_builder.create_entity();
        const object_component = model_entity.add_component(MeshComponent);
        const angular_velocity = model_entity.add_component(AngularVelocityComponent);
        angular_velocity.x = 0;
        angular_velocity.y = 1;
        angular_velocity.z = 0;

        SceneLoader.LoadAssetContainer("assets/models/", "romanbustrecalc.obj", scene_component.scene, (container) => {
            const mesh = container.meshes[0];
            const material = new StandardMaterial("bustMaterial", scene_component.scene);
            mesh.material = material;
            mesh.scaling.set(0.14, 0.14, 0.14);
            mesh.position.set(0, -3.5, 0);
            object_component.mesh = mesh;
            scene_component.scene.addMesh(mesh);
        });

        this.channelPass = new PassPostProcess("pass", 1.0, camera);
        scene_component.scene.clearColor = new Color4(0.01, 0, 0.01, 1);

        this.world = world_builder.build();
    }

    public update(dt: number) {
        this.world.update(dt);
    }

    public draw() {
        this.world.draw();
    }
}
