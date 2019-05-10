import { PostProcess } from "babylonjs";
import { Component } from "encompass-ecs";

export class VHSPauseComponent extends Component {
    public effect: PostProcess;
    public time: number;
    public amount: number;
}
