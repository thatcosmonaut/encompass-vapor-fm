import { Component } from "encompass-ecs";
import { Object3D } from "three";

export class ObjectComponent extends Component {
    public object: Object3D;
}
