import { Engine, Mutates, Reads } from "encompass-ecs";
import { BadTVEffectComponent } from "../components/bad_tv_effect";
import { BadTVDistortionMessage } from "../messages/bad_tv_distortion";

@Reads(BadTVDistortionMessage)
@Mutates(BadTVEffectComponent)
export class BadTVEffectEngine extends Engine {
  public update(dt: number) {
    for (const component of this.read_components_mutable(
      BadTVEffectComponent
    ).values()) {
      component.time += dt;
      for (const message of this.read_messages(
        BadTVDistortionMessage
      ).values()) {
        component.distortion = message.distortion;
        component.distortion2 = message.distortion2;
        component.rollSpeed = message.rollSpeed;
      }
      component.distortion = Math.max(component.distortion - 1 * dt, 0.001);
      component.distortion2 = Math.max(component.distortion2 - 10 * dt, 0.001);
      component.rollSpeed = Math.max(component.rollSpeed - 0.6 * dt, 0);
    }
  }
}
