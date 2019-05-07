import { PostProcess } from "babylonjs";
import { Component } from "encompass-ecs";

export class CRTEffectComponent extends Component {
    public effect: PostProcess;
    public time: number;
}
