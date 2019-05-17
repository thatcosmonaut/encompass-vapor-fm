import { Engine, Mutates } from "encompass-ecs";
import { RippleEffectComponent } from "../components/ripple_effect";

@Mutates(RippleEffectComponent)
export class RippleEffectEngine extends Engine {
  public update(dt: number) {
    for (const component of this.read_components_mutable(
      RippleEffectComponent
    ).values()) {
      component.time += dt;
    }
  }
}
