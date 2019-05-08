import { Component } from "encompass-ecs";
import { TextBlock } from "babylonjs-gui";

export class ChannelNumberComponent extends Component {
    public text_block: TextBlock;
    public time: number;
}
