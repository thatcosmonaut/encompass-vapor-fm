import {
  Color3,
  Color4,
  GlowLayer,
  HemisphericLight,
  MeshBuilder,
  PassPostProcess,
  PointLight,
  Scene,
  StandardMaterial,
  UniversalCamera,
  Vector3
} from "babylonjs";
import { World, WorldBuilder } from "encompass-ecs";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { StreamManagerComponent } from "../components/beat_detector";
import { BeatReactComponent } from "../components/beat_react";
import { MeshComponent } from "../components/mesh_component";
import { SceneComponent } from "../components/scene";
import { ShrinkToSizeComponent } from "../components/shrink_to_size";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { BeatDetectorEngine } from "../engines/beat_detector";
import { BeatReactEngine } from "../engines/beat_react";
import { ChangeAngularVelocityEngine } from "../engines/change_angular_velocity";
import { GlowEngine } from "../engines/glow";
import { ShrinkToSizeEngine } from "../engines/shrink_to_size";
import { TransformObjectEngine } from "../engines/transform_object";
import { StreamManager } from "../helpers/stream_manager";
import { SceneRenderer } from "../renderers/scene";
import { Channel } from "./channel";
import { GlowComponent } from "../components/glow";
import { MaterialComponent } from "../components/material";

export class CybergridState extends Channel {
  private world: World;

  public constructor(scene: Scene, stream_manager: StreamManager) {
    super(scene, stream_manager);
    const world_builder = new WorldBuilder();

    world_builder.add_engine(ChangeAngularVelocityEngine);
    world_builder.add_engine(AngularVelocityEngine);
    world_builder.add_engine(TransformObjectEngine);
    world_builder.add_engine(BeatDetectorEngine);
    world_builder.add_engine(BeatReactEngine);
    world_builder.add_engine(ShrinkToSizeEngine);
    world_builder.add_engine(GlowEngine);

    world_builder.add_renderer(SceneRenderer);

    const scene_entity = world_builder.create_entity();
    const scene_component = scene_entity.add_component(SceneComponent);
    scene_component.scene = scene;

    const stream_manager_entity = world_builder.create_entity();
    stream_manager_entity.add_component(StreamManagerComponent).stream_manager = stream_manager;

    const camera = new UniversalCamera(
      "sceneCamera",
      new Vector3(0, 5, -20),
      scene
    );
    camera.fov = 0.6;

    // const ambient_light = new HemisphericLight(
    //   "ambientLight",
    //   new Vector3(0, -1, -1),
    //   scene
    // );
    const point_light = new PointLight(
      "pointLight",
      new Vector3(0, 40, 0),
      scene
    );

    const glow_layer = new GlowLayer("glow", scene);

    this.generate_grid_lines(world_builder, -60, -60, 60, 60, 3);

    const pyramid = MeshBuilder.CreatePolyhedron("dodecahedron", {
      type: 3,
      size: 3.5
    });
    pyramid.position.set(0, 5, 50);
    const pyramid_material = new StandardMaterial("pyramidMaterial", scene);
    pyramid.material = pyramid_material;
    this.scene.addMesh(pyramid);

    const solid_entity = world_builder.create_entity();
    const mesh_component = solid_entity.add_component(MeshComponent);
    mesh_component.mesh = pyramid;
    const angular_velocity = solid_entity.add_component(
      AngularVelocityComponent
    );
    angular_velocity.x = 1;
    angular_velocity.y = 1;
    angular_velocity.z = 1;

    const beat_react_component = solid_entity.add_component(BeatReactComponent);
    beat_react_component.grow_amount = 0;
    beat_react_component.reverse_x = true;
    beat_react_component.reverse_y = true;
    beat_react_component.reverse_z = true;

    scene.clearColor = new Color4(0, 0, 0, 1);

    this.channelPass = new PassPostProcess("Scene copy", 1.0, camera);

    this.world = world_builder.build();
  }

  public update(dt: number) {
    this.world.update(dt);
  }

  public draw() {
    this.world.draw();
  }

  private generate_tube_material() {
    const material = new StandardMaterial("tube", this.scene);
    material.diffuseColor = new Color3(0, 0, 0);
    material.emissiveColor = new Color3(0, 0, 0.2);
    material.ambientColor = new Color3(0, 0, 0);
    material.specularColor = new Color3(0, 0, 0);
    return material;
  }

  private generate_grid_lines(
    world_builder: WorldBuilder,
    left_x: number,
    bottom_y: number,
    right_x: number,
    top_y: number,
    spacing: number
  ) {
    const radius = 0.03;

    for (
      let y = bottom_y, end = top_y, step = spacing, asc = step > 0;
      asc ? y <= end : y >= end;
      y += step
    ) {
      const line_geometry = MeshBuilder.CreateTube(
        "line " + left_x + " " + bottom_y + " " + right_x + " " + top_y,
        {
          path: [new Vector3(left_x, 0, y), new Vector3(right_x, 0, y)],
          radius,
        }
      );

      const material = this.generate_tube_material();
      line_geometry.material = material;
      this.scene.addMesh(line_geometry);
      const line_entity = world_builder.create_entity();
      line_entity.add_component(GlowComponent);
      line_entity.add_component(MaterialComponent).material = material;
    }

    for (
      let x = left_x, end1 = right_x, step1 = spacing, asc1 = step1 > 0;
      asc1 ? x <= end1 : x >= end1;
      x += step1
    ) {
      const line_geometry = MeshBuilder.CreateTube(
        "line " + left_x + " " + bottom_y + " " + right_x + " " + top_y,
        {
          path: [new Vector3(x, 0, bottom_y), new Vector3(x, 0, top_y)],
          radius,
        }
      );

      const material = this.generate_tube_material();
      line_geometry.material = material;
      this.scene.addMesh(line_geometry);
      const line_entity = world_builder.create_entity();
      line_entity.add_component(GlowComponent);
      line_entity.add_component(MaterialComponent).material = material;
    }

    for (
      let y = bottom_y, end2 = top_y, step2 = spacing, asc2 = step2 > 0;
      asc2 ? y <= end2 : y >= end2;
      y += step2
    ) {
      const line_geometry = MeshBuilder.CreateTube(
        "line " + left_x + " " + bottom_y + " " + right_x + " " + top_y,
        {
          path: [new Vector3(left_x, 10, y), new Vector3(right_x, 10, y)],
          radius,
        }
      );

      const material = this.generate_tube_material();

      line_geometry.material = material;
      this.scene.addMesh(line_geometry);
      const line_entity = world_builder.create_entity();
      line_entity.add_component(GlowComponent);
      line_entity.add_component(MaterialComponent).material = material;
    }

    for (
      let x = left_x, end3 = right_x, step3 = spacing, asc3 = step3 > 0;
      asc3 ? x <= end3 : x >= end3;
      x += step3
    ) {
      const line_geometry = MeshBuilder.CreateTube(
        "line " + left_x + " " + bottom_y + " " + right_x + " " + top_y,
        {
          path: [new Vector3(x, 10, bottom_y), new Vector3(x, 10, top_y)],
          radius,
        }
      );

      const material = this.generate_tube_material();

      line_geometry.material = material;
      this.scene.addMesh(line_geometry);
      const line_entity = world_builder.create_entity();
      line_entity.add_component(GlowComponent);
      line_entity.add_component(MaterialComponent).material = material;
    }
  }
}
