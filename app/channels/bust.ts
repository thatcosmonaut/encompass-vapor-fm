import {
  Color3,
  Color4,
  HemisphericLight,
  LinesBuilder,
  PointLight,
  SceneLoader,
  SpotLight,
  StandardMaterial,
  Vector3
} from "babylonjs";
import { OBJFileLoader } from "babylonjs-loaders";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { BeatReactComponent } from "../components/beat_react";
import { GrowthSpeedComponent } from "../components/growth_speed";
import { MeshComponent } from "../components/mesh_component";
import { ShrinkToSizeComponent } from "../components/shrink_to_size";
import { WrapScaleComponent } from "../components/wrap_scale";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { BeatReactEngine } from "../engines/beat_react";
import { ChangeAngularVelocityEngine } from "../engines/change_angular_velocity";
import { GrowthDetector } from "../engines/growth";
import { ShrinkToSizeEngine } from "../engines/shrink_to_size";
import { TransformObjectEngine } from "../engines/transform_object";
import { Channel } from "./channel";

export class BustState extends Channel {
  protected init() {
    const world_builder = this.world_builder;

    world_builder.add_engine(AngularVelocityEngine);
    world_builder.add_engine(GrowthDetector);
    world_builder.add_engine(TransformObjectEngine);
    world_builder.add_engine(BeatReactEngine);
    world_builder.add_engine(ShrinkToSizeEngine);
    world_builder.add_engine(ChangeAngularVelocityEngine);

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
    const spotLight = new SpotLight(
      "spotLight",
      this.camera.position,
      new Vector3(0, 0, 1),
      Math.PI / 2,
      0.1,
      this.scene
    );

    const model_entity = world_builder.create_entity();
    const object_component = model_entity.add_component(MeshComponent);
    const beat_react_component = model_entity.add_component(BeatReactComponent);
    beat_react_component.grow_amount = 0.002;
    beat_react_component.reverse_y = true;
    const shrink_to_size_component = model_entity.add_component(
      ShrinkToSizeComponent
    );
    shrink_to_size_component.rate = 0.02;
    shrink_to_size_component.size = 0.14;
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
        material.emissiveColor = new Color3(0.1, 0.1, 0.1);
        material.diffuseColor = new Color3(0.95, 0.95, 0.95);
        mesh.material = material;
        mesh.scaling.set(0.14, 0.14, 0.14);
        mesh.position.set(0, -3.5, 0);
        object_component.mesh = mesh;
        this.scene.addMesh(mesh);
      }
    );

    const line_material = new StandardMaterial(
      "lineMaterial",
      this.scene
    );
    line_material.emissiveColor = new Color3(1, 1, 1);

    for (let i = 0; i < 20; i++) {
      const line_box_mesh = LinesBuilder.CreateLines("line " + i, {
        points: [
          new Vector3(-20, 10, 10),
          new Vector3(20, 10, 10),
          new Vector3(20, -10, 10),
          new Vector3(-20, -10, 10),
          new Vector3(-20, 10, 10)
        ]
      });

      line_box_mesh.enableEdgesRendering();
      line_box_mesh.edgesWidth = 5;
      line_box_mesh.edgesColor = new Color4(1, 1, 1, 1);

      const scale_factor = i * 0.5 * 0.2;
      line_box_mesh.scaling.set(scale_factor, scale_factor, scale_factor);

      this.scene.addMesh(line_box_mesh);

      const line_entity = world_builder.create_entity();
      const line_object_component = line_entity.add_component(MeshComponent);
      const grow_component = line_entity.add_component(GrowthSpeedComponent);
      grow_component.x = 0.2;
      grow_component.y = 0.2;
      grow_component.z = 0.2;
      const wrap_scale_component = line_entity.add_component(
        WrapScaleComponent
      );
      wrap_scale_component.x = 1.5;
      wrap_scale_component.y = 1.5;
      wrap_scale_component.z = 1.5;
      line_object_component.mesh = line_box_mesh;
    }

    this.scene.clearColor = new Color4(0.1, 0, 1, 1);
  }
}
