import { Engine, Reads, Emits } from "encompass-ecs";
import { BustComponent } from "../components/bust";
import { MeshComponent } from "../components/mesh_component";
import { GrowObjectMessage } from "../messages/component/grow_object";
import { KickBeatMessage } from "../messages/kick_beat";
import { ChangeAngularVelocityMessage } from "../messages/component/change_angular_velocity";
import { AngularVelocityComponent } from "../components/angular_velocity";

@Reads(KickBeatMessage)
@Emits(GrowObjectMessage, ChangeAngularVelocityMessage)
export class BustBeatReactEngine extends Engine {
    public update() {
        for (const kick_beat_message of this.read_messages(KickBeatMessage).iterable()) {
            for (const bust_component of this.read_components(BustComponent).iterable()) {
                const entity = this.get_entity(bust_component.entity_id)!;

                const grow_message = this.emit_component_message(GrowObjectMessage, entity.get_component(MeshComponent));
                grow_message.x = 0.002;
                grow_message.y = 0.002;
                grow_message.z = 0.002;

                const change_angular_velocity_message = this.emit_component_message(ChangeAngularVelocityMessage, entity.get_component(AngularVelocityComponent));
                change_angular_velocity_message.y = Math.random() < 0.5 ? -1 : 1;
            }
        }
    }
}
