import { Detector, Emits, Entity } from "encompass-ecs";
import { AngularVelocityComponent } from "../components/angular_velocity";
import { ObjectComponent } from "../components/object_3d_component";
import { RotateObjectMessage } from "../messages/component/rotate_object";

@Emits(RotateObjectMessage)
export class AngularVelocityEngine extends Detector {
    public component_types = [ObjectComponent, AngularVelocityComponent];

    public detect(entity: Entity, dt: number) {
        const object = entity.get_component(ObjectComponent);
        const angular_velocity_component = entity.get_component(AngularVelocityComponent);

        const message = this.emit_component_message(RotateObjectMessage, object);
        message.x = angular_velocity_component.x * dt;
        message.y = angular_velocity_component.y * dt;
        message.z = angular_velocity_component.z * dt;
    }
}
