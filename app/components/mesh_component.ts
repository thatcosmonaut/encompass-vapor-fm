import { AbstractMesh } from "babylonjs";
import { Component } from "encompass-ecs";

export class MeshComponent extends Component {
  public mesh: AbstractMesh;
}
