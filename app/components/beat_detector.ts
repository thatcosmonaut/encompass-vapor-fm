import { Component } from "encompass-ecs";
import { StreamManager } from "../helpers/stream_manager";

export class StreamManagerComponent extends Component {
  public stream_manager: StreamManager;
}
