import { StandardMaterial } from "babylonjs";
import { Component } from "encompass-ecs";

export class MaterialComponent extends Component {
    public material: StandardMaterial;
}
