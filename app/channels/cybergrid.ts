import {
  Color4,
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
import { MeshComponent } from "../components/mesh_component";
import { SceneComponent } from "../components/scene";
import { AngularVelocityEngine } from "../engines/angular_velocity";
import { TransformObjectEngine } from "../engines/transform_object";
import { SceneRenderer } from "../renderers/scene";
import { Channel } from "./channel";
import { StreamManager } from "../helpers/stream_manager";

export class CybergridState extends Channel {
  private world: World;

  public constructor(scene: Scene, stream_manager: StreamManager) {
    super(scene, stream_manager);
    const world_builder = new WorldBuilder();

    world_builder.add_engine(AngularVelocityEngine);
    world_builder.add_engine(TransformObjectEngine);

    world_builder.add_renderer(SceneRenderer);

    const scene_entity = world_builder.create_entity();
    const scene_component = scene_entity.add_component(SceneComponent);
    scene_component.scene = scene;

    const camera = new UniversalCamera(
      "sceneCamera",
      new Vector3(0, 5, -20),
      scene
    );
    camera.fov = 0.6;

    const ambient_light = new HemisphericLight(
      "ambientLight",
      new Vector3(0, 0, -1),
      scene
    );
    const point_light = new PointLight(
      "pointLight",
      new Vector3(10, 40, -20),
      scene
    );

    this.generate_grid_lines(-60, -60, 60, 60, 3);

    const pyramid = MeshBuilder.CreatePolyhedron("pyramid", {
      type: 2,
      size: 3.5
    });
    pyramid.position.set(0, 5, 50);
    const pyramid_material = new StandardMaterial("pyramidMaterial", scene);
    pyramid.material = pyramid_material;
    this.scene.addMesh(pyramid);

    const pyramid_entity = world_builder.create_entity();
    const mesh_component = pyramid_entity.add_component(MeshComponent);
    mesh_component.mesh = pyramid;
    const angular_velocity = pyramid_entity.add_component(
      AngularVelocityComponent
    );
    angular_velocity.x = 0;
    angular_velocity.y = 0.2;
    angular_velocity.z = 0;

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

  private generate_grid_lines(
    left_x: number,
    bottom_y: number,
    right_x: number,
    top_y: number,
    spacing: number
  ) {
    for (
      let y = bottom_y, end = top_y, step = spacing, asc = step > 0;
      asc ? y <= end : y >= end;
      y += step
    ) {
      const line_geometry = MeshBuilder.CreateLines(
        "line " + left_x + " " + bottom_y + " " + right_x + " " + top_y,
        {
          points: [new Vector3(left_x, 0, y), new Vector3(right_x, 0, y)],
          colors: [new Color4(0, 0, 0.8, 0.8), new Color4(0, 0, 0.8, 0.8)]
        }
      );

      this.scene.addMesh(line_geometry);
    }

    for (
      let x = left_x, end1 = right_x, step1 = spacing, asc1 = step1 > 0;
      asc1 ? x <= end1 : x >= end1;
      x += step1
    ) {
      const line_geometry = MeshBuilder.CreateLines(
        "line " + left_x + " " + bottom_y + " " + right_x + " " + top_y,
        {
          points: [new Vector3(x, 0, bottom_y), new Vector3(x, 0, top_y)],
          colors: [new Color4(0, 0, 0.8, 0.8), new Color4(0, 0, 0.8, 0.8)]
        }
      );

      this.scene.addMesh(line_geometry);
    }

    for (
      let y = bottom_y, end2 = top_y, step2 = spacing, asc2 = step2 > 0;
      asc2 ? y <= end2 : y >= end2;
      y += step2
    ) {
      const line_geometry = MeshBuilder.CreateLines(
        "line " + left_x + " " + bottom_y + " " + right_x + " " + top_y,
        {
          points: [new Vector3(left_x, 10, y), new Vector3(right_x, 10, y)],
          colors: [new Color4(0, 0, 0.8, 0.8), new Color4(0, 0, 0.8, 0.8)]
        }
      );

      this.scene.addMesh(line_geometry);
    }

    for (
      let x = left_x, end3 = right_x, step3 = spacing, asc3 = step3 > 0;
      asc3 ? x <= end3 : x >= end3;
      x += step3
    ) {
      const line_geometry = MeshBuilder.CreateLines(
        "line " + left_x + " " + bottom_y + " " + right_x + " " + top_y,
        {
          points: [new Vector3(x, 10, bottom_y), new Vector3(x, 10, top_y)],
          colors: [new Color4(0, 0, 0.8, 0.8), new Color4(0, 0, 0.8, 0.8)]
        }
      );

      this.scene.addMesh(line_geometry);
    }
  }
}
