import { Component } from "encompass-ecs";
import { PostProcess } from "babylonjs";

export class RippleEffectComponent extends Component {
    effect: PostProcess;
    time: number;
}
