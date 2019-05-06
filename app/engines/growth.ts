import { Detector, Emits, Entity } from "encompass-ecs";
import { GrowthSpeedComponent } from "../components/growth_speed";
import { MeshComponent } from "../components/mesh_component";
import { GrowObjectMessage } from "../messages/component/grow_object";

@Emits(GrowObjectMessage)
export class GrowthDetector extends Detector {
    public component_types = [MeshComponent, GrowthSpeedComponent];

    public detect(entity: Entity, dt: number) {
        const object_component = entity.get_component(MeshComponent);
        const growth_speed_component = entity.get_component(GrowthSpeedComponent);

        const growth_message = this.emit_component_message(GrowObjectMessage, object_component);
        growth_message.x = growth_speed_component.x * dt;
        growth_message.y = growth_speed_component.y * dt;
        growth_message.z = growth_speed_component.z * dt;
    }
}
