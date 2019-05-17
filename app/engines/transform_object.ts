import { Engine, Mutates, Reads } from "encompass-ecs";
import { MeshComponent } from "../components/mesh_component";
import { WrapScaleComponent } from "../components/wrap_scale";
import { GrowObjectMessage } from "../messages/component/grow_object";
import { RotateObjectMessage } from "../messages/component/rotate_object";
import { Vector3, Space } from "babylonjs";

@Reads(GrowObjectMessage, RotateObjectMessage)
@Mutates(MeshComponent)
export class TransformObjectEngine extends Engine {
  public update(dt: number) {
    const grow_object_messages = this.read_messages(GrowObjectMessage);
    const rotate_object_messages = this.read_messages(RotateObjectMessage);

    for (const grow_object_message of grow_object_messages.values()) {
      const component = grow_object_message.component;
      if (component.mesh !== undefined) {
        let new_x_scale = grow_object_message.component.mesh.scaling.x;
        let new_y_scale = grow_object_message.component.mesh.scaling.y;
        let new_z_scale = grow_object_message.component.mesh.scaling.z;

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

        grow_object_message.component.mesh.scaling.x = new_x_scale;
        grow_object_message.component.mesh.scaling.y = new_y_scale;
        grow_object_message.component.mesh.scaling.z = new_z_scale;
      }
    }

    for (const rotate_object_message of rotate_object_messages.values()) {
      const component = rotate_object_message.component;
      if (component.mesh !== undefined) {
        rotate_object_message.component.mesh.rotate(
          Vector3.Right(),
          rotate_object_message.x,
          Space.LOCAL
        );
        rotate_object_message.component.mesh.rotate(
          Vector3.Up(),
          rotate_object_message.y,
          Space.LOCAL
        );
        rotate_object_message.component.mesh.rotate(
          Vector3.Forward(),
          rotate_object_message.z,
          Space.LOCAL
        );
      }
    }
  }
}
