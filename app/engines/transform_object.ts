import { Engine, Mutates, Reads } from "encompass-ecs";
import { ObjectComponent } from "../components/object_3d_component";
import { WrapScaleComponent } from "../components/wrap_scale";
import { GrowObjectMessage } from "../messages/component/grow_object";
import { RotateObjectMessage } from "../messages/component/rotate_object";

@Reads(GrowObjectMessage, RotateObjectMessage)
@Mutates(ObjectComponent)
export class TransformObjectEngine extends Engine {
    public update(dt: number) {
        const grow_object_messages = this.read_messages(GrowObjectMessage);
        const rotate_object_messages = this.read_messages(RotateObjectMessage);

        for (const grow_object_message of grow_object_messages.iterable()) {
            const component = grow_object_message.component;
            let new_x_scale = grow_object_message.component.object.scale.x;
            let new_y_scale = grow_object_message.component.object.scale.y;
            let new_z_scale = grow_object_message.component.object.scale.z;

            new_x_scale += grow_object_message.x;
            new_y_scale += grow_object_message.y;
            new_z_scale += grow_object_message.z;

            const entity = this.get_entity(component.entity_id)!;
            if (entity.has_component(WrapScaleComponent)) {
                const wrap_scale_component = entity.get_component(WrapScaleComponent);
                if (wrap_scale_component.x !== undefined) {
                    new_x_scale %= wrap_scale_component.x;
                }
                if (wrap_scale_component.y !== undefined) {
                    new_y_scale %= wrap_scale_component.y;
                }
                if (wrap_scale_component.z !== undefined) {
                    new_z_scale %= wrap_scale_component.z;
                }
            }

            grow_object_message.component.object.scale.x = new_x_scale;
            grow_object_message.component.object.scale.y = new_y_scale;
            grow_object_message.component.object.scale.z = new_z_scale;
        }

        for (const rotate_object_message of rotate_object_messages.iterable()) {
            rotate_object_message.component.object.rotateX(rotate_object_message.x);
            rotate_object_message.component.object.rotateY(rotate_object_message.y);
            rotate_object_message.component.object.rotateZ(rotate_object_message.z);
        }
    }
}
