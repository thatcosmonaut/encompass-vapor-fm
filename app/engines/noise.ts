import { Engine, Mutates } from "encompass-ecs";
import { NoiseComponent } from "../components/noise";

@Mutates(NoiseComponent)
export class NoiseEngine extends Engine {
  public update(dt: number) {
    for (const noise_component of this.read_components_mutable(
      NoiseComponent
    ).iterable()) {
      noise_component.time += dt;
    }
  }
}
