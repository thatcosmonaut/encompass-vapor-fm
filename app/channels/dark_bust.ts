import {
  Color4,
  HemisphericLight,
  PointLight,
  SceneLoader,
  StandardMaterial,
  Vector3
} from "babylonjs";
import { OBJFileLoader } from "babylonjs-loaders";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { MeshComponent } from "../components/mesh_component";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { GrowthDetector } from "../engines/growth";
import { TransformObjectEngine } from "../engines/transform_object";
import { Channel } from "./channel";

export class DarkBustState extends Channel {
  protected init() {
    const world_builder = this.world_builder;

    world_builder.add_engine(AngularVelocityEngine);
    world_builder.add_engine(GrowthDetector);
    world_builder.add_engine(TransformObjectEngine);

    const obj_loader = new OBJFileLoader();

    this.camera.position.set(0, 0, -6);
    this.camera.fov = 1.3;

    const ambientLight = new HemisphericLight(
      "ambientLight",
      new Vector3(0, 0, 1),
      this.scene
    );
    const pointLight = new PointLight(
      "pointLight",
      new Vector3(10, 20, 20),
      this.scene
    );

    const model_entity = world_builder.create_entity();
    const object_component = model_entity.add_component(MeshComponent);
    const angular_velocity = model_entity.add_component(
      AngularVelocityComponent
    );
    angular_velocity.x = 0;
    angular_velocity.y = 1;
    angular_velocity.z = 0;

    SceneLoader.LoadAssetContainer(
      "assets/models/",
      "romanbustrecalc.obj",
      this.scene,
      container => {
        const mesh = container.meshes[0];
        const material = new StandardMaterial(
          "bustMaterial",
          this.scene
        );
        mesh.material = material;
        mesh.scaling.set(0.14, 0.14, 0.14);
        mesh.position.set(0, -3.5, 0);
        object_component.mesh = mesh;
        this.scene.addMesh(mesh);
      }
    );

    this.scene.clearColor = new Color4(0.01, 0, 0.01, 1);
  }
}
