import { Engine, Mutates } from "encompass-ecs";
import { CRTEffectComponent } from "../components/crt_effect";

@Mutates(CRTEffectComponent)
export class CRTEffectEngine extends Engine {
  public update(dt: number) {
    for (const component of this.read_components_mutable(
      CRTEffectComponent
    ).iterable()) {
      component.time += dt;
    }
  }
}
