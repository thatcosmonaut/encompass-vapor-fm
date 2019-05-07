import { Component } from "encompass-ecs";
import { GameState } from "../states/gamestate";

export class ChannelsComponent extends Component {
    public start_index: number;
    public current_index: number;
    public channels: Map<number, GameState>;
}
