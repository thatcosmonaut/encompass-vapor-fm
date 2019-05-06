import { Component } from "encompass-ecs";
import { Camera, Scene } from "three";

export class SceneComponent extends Component {
    public scene: Scene;
    public camera: Camera;
}
