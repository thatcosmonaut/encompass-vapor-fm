import { PostProcess, Scene } from "babylonjs";
import { StreamManager } from "../helpers/stream_manager";

export abstract class Channel {
  public channelPass: PostProcess;
  protected scene: Scene;
  protected stream_manager: StreamManager;

  constructor(scene: Scene, stream_manager: StreamManager) {
    this.scene = scene;
    this.stream_manager = stream_manager;
  }

  public abstract update(dt: number): void;

  public abstract draw(): void;
}
