import { Emits, Engine } from "encompass-ecs";
import { MeshComponent } from "../components/mesh_component";
import { ShrinkToSizeComponent } from "../components/shrink_to_size";
import { GrowObjectMessage } from "../messages/component/grow_object";

@Emits(GrowObjectMessage)
export class ShrinkToSizeEngine extends Engine {
  public update(dt: number) {
    for (const shrink_to_size_component of this.read_components(
      ShrinkToSizeComponent
    ).iterable()) {
      const mesh_component = this.get_entity(
        shrink_to_size_component.entity_id
      )!.get_component(MeshComponent);
      if (
        mesh_component.mesh &&
        mesh_component.mesh.scaling.x > shrink_to_size_component.size
      ) {
        const shrink_message = this.emit_component_message(
          GrowObjectMessage,
          mesh_component
        );
        shrink_message.x = -shrink_to_size_component.rate * dt;
        shrink_message.y = -shrink_to_size_component.rate * dt;
        shrink_message.z = -shrink_to_size_component.rate * dt;
      }
    }
  }
}
