import { PostProcess } from "babylonjs";
import { Component } from "encompass-ecs";

export class NoiseComponent extends Component {
  public effect: PostProcess;
  public time: number;
  public amount: number;
}
