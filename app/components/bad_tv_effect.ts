import { PostProcess } from "babylonjs";
import { Component } from "encompass-ecs";

export class BadTVEffectComponent extends Component {
    public effect: PostProcess;
    public time: number;
    public distortion: number;
    public distortion2: number;
    public speed: number;
    public rollSpeed: number;
}
