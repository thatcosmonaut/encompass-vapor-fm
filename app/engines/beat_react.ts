import { Emits, Engine, Reads } from "encompass-ecs";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { BeatReactComponent } from "../components/beat_react";
import { MeshComponent } from "../components/mesh_component";
import { ChangeAngularVelocityMessage } from "../messages/component/change_angular_velocity";
import { GrowObjectMessage } from "../messages/component/grow_object";
import { KickBeatMessage } from "../messages/kick_beat";

@Reads(KickBeatMessage)
@Emits(GrowObjectMessage, ChangeAngularVelocityMessage)
export class BeatReactEngine extends Engine {
  public update() {
    for (const kick_beat_message of this.read_messages(
      KickBeatMessage
    ).iterable()) {
      for (const beat_react_component of this.read_components(
        BeatReactComponent
      ).iterable()) {
        const entity = this.get_entity(beat_react_component.entity_id)!;

        const grow_message = this.emit_component_message(
          GrowObjectMessage,
          entity.get_component(MeshComponent)
        );
        grow_message.x = beat_react_component.grow_amount;
        grow_message.y = beat_react_component.grow_amount;
        grow_message.z = beat_react_component.grow_amount;

        const angular_velocity = entity.get_component(AngularVelocityComponent);
        const change_angular_velocity_message = this.emit_component_message(
          ChangeAngularVelocityMessage,
          angular_velocity
        );

        if (beat_react_component.reverse_x) {
          change_angular_velocity_message.x = angular_velocity.x * (Math.random() < 0.5 ? -1 : 1);
        }
        if (beat_react_component.reverse_y) {
          change_angular_velocity_message.y = angular_velocity.y * (Math.random() < 0.5 ? -1 : 1);
          console.log(change_angular_velocity_message.y);
        }
        if (beat_react_component.reverse_z) {
          change_angular_velocity_message.z = angular_velocity.z * (Math.random() < 0.5 ? -1 : 1);
        }
      }
    }
  }
}
