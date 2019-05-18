import { Color3, PostProcess } from "babylonjs";
import { Component } from "encompass-ecs";

export class CheckerboardComponent extends Component {
    public effect: PostProcess;
    public time: number;
    public color: Color3;
}
