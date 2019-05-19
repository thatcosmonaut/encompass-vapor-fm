import { PassPostProcess, PostProcess, Scene, UniversalCamera, Vector3 } from "babylonjs";
import { World, WorldBuilder } from "encompass-ecs";
import { StreamManagerComponent } from "../components/beat_detector";
import { SceneComponent } from "../components/scene";
import { BeatDetectorEngine } from "../engines/beat_detector";
import { StreamManager } from "../helpers/stream_manager";
import { SceneRenderer } from "../renderers/scene";

export class Channel {
  public static create(
      scene: Scene,
      stream_manager: StreamManager
    ): Channel {
    const channel = new this(scene, stream_manager);
    channel.init();
    channel.post_init();
    return channel;
  }

  public channelPass: PostProcess;
  protected scene: Scene;
  protected camera: UniversalCamera;
  protected stream_manager: StreamManager;
  protected world_builder: WorldBuilder;
  protected world: World;

  protected constructor(scene: Scene, stream_manager: StreamManager) {
    this.scene = scene;
    this.stream_manager = stream_manager;

    this.world_builder = new WorldBuilder();
    this.world_builder.add_engine(BeatDetectorEngine);
    this.world_builder.add_renderer(SceneRenderer);
    this.world_builder.create_entity().add_component(SceneComponent).scene = scene;
    this.world_builder.create_entity().add_component(StreamManagerComponent).stream_manager = stream_manager;

    this.camera = new UniversalCamera("sceneCamera", new Vector3(), scene);
  }

  public update(dt: number) {
    this.world.update(dt);
  }

  public draw() {
    this.world.draw();
  }

  protected init(): void {}

  private post_init() {
    this.channelPass = new PassPostProcess("pass", 1.0, this.camera);
    this.world = this.world_builder.build();
  }
}
