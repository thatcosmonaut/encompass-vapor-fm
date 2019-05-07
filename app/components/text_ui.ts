import { TextBlock } from "babylonjs-gui";
import { Component } from "encompass-ecs";

export class TextUIComponent extends Component {
    public text_block: TextBlock;
    public tag: string;
}
