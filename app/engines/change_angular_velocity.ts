import { ComponentModifier, Mutates, Reads } from "encompass-ecs";
import { GCOptimizedSet } from "tstl-gc-optimized-collections";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { ChangeAngularVelocityMessage } from "../messages/component/change_angular_velocity";
import { TogglePauseMessage } from "../messages/pause";

@Reads(ChangeAngularVelocityMessage, TogglePauseMessage)
@Mutates(AngularVelocityComponent)
export class ChangeAngularVelocityEngine extends ComponentModifier {
  public component_message_type = ChangeAngularVelocityMessage;

  protected modify(
    component: AngularVelocityComponent,
    messages: GCOptimizedSet<ChangeAngularVelocityMessage>,
    dt: number
  ) {
    for (const message of messages.entries()) {
      if (message.x) {
        component.x = message.x;
      }
      if (message.y) {
        component.y = message.y;
      }
      if (message.z) {
        component.z = message.y;
      }
    }
  }
}
