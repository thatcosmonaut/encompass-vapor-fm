import { Component } from "encompass-ecs";
import { Channel } from "../channels/channel";

export class ChannelsComponent extends Component {
  public start_index: number;
  public current_index: number;
  public channels: Map<number, Channel>;
}
