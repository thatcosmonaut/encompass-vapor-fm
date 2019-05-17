import { GeneralRenderer } from "encompass-ecs";
import { SceneComponent } from "../components/scene";

export class SceneRenderer extends GeneralRenderer {
  public layer = 1;

  public render() {
    for (const scene_component of this.read_components(
      SceneComponent
    ).values()) {
      scene_component.scene.render();
    }
  }
}
