import {
  Color3,
  Color4,
  HemisphericLight,
  LinesBuilder,
  PassPostProcess,
  PointLight,
  Scene,
  SceneLoader,
  SpotLight,
  StandardMaterial,
  UniversalCamera,
  Vector3
} from "babylonjs";
import { OBJFileLoader } from "babylonjs-loaders";
import { World, WorldBuilder } from "encompass-ecs";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { GrowthSpeedComponent } from "../components/growth_speed";
import { MeshComponent } from "../components/mesh_component";
import { SceneComponent } from "../components/scene";
import { WrapScaleComponent } from "../components/wrap_scale";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { GrowthDetector } from "../engines/growth";
import { TransformObjectEngine } from "../engines/transform_object";
import { SceneRenderer } from "../renderers/scene";
import { Channel } from "./channel";
import { StreamManager } from "../helpers/stream_manager";
import { StreamManagerComponent } from "../components/beat_detector";
import { BeatDetectorEngine } from "../engines/beat_detector";
import { BustBeatReactEngine } from "../engines/bust_beat_react";
import { BustComponent } from "../components/bust";
import { ShrinkToSizeComponent } from "../components/shrink_to_size";
import { ShrinkToSizeEngine } from "../engines/shrink_to_size";
import { ChangeAngularVelocityEngine } from "../engines/change_angular_velocity";

export class BustState extends Channel {
  private world: World;

  public constructor(scene: Scene, stream_manager: StreamManager) {
    super(scene, stream_manager);
    const world_builder = new WorldBuilder();

    world_builder.add_engine(AngularVelocityEngine);
    world_builder.add_engine(GrowthDetector);
    world_builder.add_engine(TransformObjectEngine);
    world_builder.add_engine(BeatDetectorEngine);
    world_builder.add_engine(BustBeatReactEngine);
    world_builder.add_engine(ShrinkToSizeEngine);
    world_builder.add_engine(ChangeAngularVelocityEngine);

    world_builder.add_renderer(SceneRenderer);

    const scene_entity = world_builder.create_entity();
    const scene_component = scene_entity.add_component(SceneComponent);
    scene_component.scene = scene;

    const stream_manager_entity = world_builder.create_entity();
    const stream_manager_component = stream_manager_entity.add_component(StreamManagerComponent);
    stream_manager_component.stream_manager = stream_manager;

    const obj_loader = new OBJFileLoader();

    const camera = new UniversalCamera(
      "sceneCamera",
      new Vector3(0, 0, -6),
      scene_component.scene
    );
    camera.fov = 1.3;
    const ambientLight = new HemisphericLight(
      "ambientLight",
      new Vector3(0, 0, 1),
      scene_component.scene
    );
    const pointLight = new PointLight(
      "pointLight",
      new Vector3(10, 20, 20),
      scene_component.scene
    );
    const spotLight = new SpotLight(
      "spotLight",
      camera.position,
      new Vector3(0, 0, 1),
      Math.PI / 2,
      0.1,
      scene_component.scene
    );

    const model_entity = world_builder.create_entity();
    const object_component = model_entity.add_component(MeshComponent);
    const bust_component = model_entity.add_component(BustComponent);
    const shrink_to_size_component = model_entity.add_component(ShrinkToSizeComponent);
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
      scene_component.scene,
      container => {
        const mesh = container.meshes[0];
        const material = new StandardMaterial(
          "bustMaterial",
          scene_component.scene
        );
        material.emissiveColor = new Color3(0.1, 0.1, 0.1);
        material.diffuseColor = new Color3(0.95, 0.95, 0.95);
        mesh.material = material;
        mesh.scaling.set(0.14, 0.14, 0.14);
        mesh.position.set(0, -3.5, 0);
        object_component.mesh = mesh;
        scene_component.scene.addMesh(mesh);
      }
    );

    const line_material = new StandardMaterial(
      "lineMaterial",
      scene_component.scene
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

      scene_component.scene.addMesh(line_box_mesh);

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

    this.channelPass = new PassPostProcess("pass", 1.0, camera);

    scene_component.scene.clearColor = new Color4(0.1, 0, 1, 1);

    this.world = world_builder.build();
  }

  public update(dt: number) {
    this.world.update(dt);
  }

  public draw() {
    this.world.draw();
  }
}
