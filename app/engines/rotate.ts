import { ComponentModifier, Mutates, Reads } from "encompass-ecs";
import { GCOptimizedSet } from "tstl-gc-optimized-collections";
import { ObjectComponent } from "../components/object_3d_component";
import { RotateObjectMessage } from "../messages/component/rotate_object";

@Reads(RotateObjectMessage)
@Mutates(ObjectComponent)
export class RotateEngine extends ComponentModifier {
    public component_message_type = RotateObjectMessage;
    public modify(object_component: ObjectComponent, messages: GCOptimizedSet<RotateObjectMessage>, dt: number) {
        for (const message of messages.iterable()) {
            object_component.object.rotateX(message.x);
            object_component.object.rotateY(message.y);
            object_component.object.rotateZ(message.z);
        }
    }
}
