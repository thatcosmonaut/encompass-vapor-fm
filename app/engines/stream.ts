import { Emits, Engine, Reads } from "encompass-ecs";
import { ActivatedStreamComponent } from "../components/activated_stream";
import { StreamManagerComponent } from "../components/beat_detector";
import { ActivateStreamMessage } from "../messages/activate_stream";
import { DeactivateStreamMessage } from "../messages/deactivate_stream";
import { LoadStreamMessage } from "../messages/load_stream";
import { ShowUIMessage } from "../messages/show_ui";

@Emits(ShowUIMessage)
@Reads(ActivateStreamMessage, LoadStreamMessage, DeactivateStreamMessage)
export class StreamEngine extends Engine {
  public update() {
    const stream_manager_component = this.read_component(StreamManagerComponent);

    if (this.some(ActivateStreamMessage)) {
      this.emit_message(ShowUIMessage);
      this.create_entity().add_component(ActivatedStreamComponent);
    }

    if (stream_manager_component && this.some(LoadStreamMessage)) {
      stream_manager_component.stream_manager.load_and_play_audio();
    }

    if (this.some(DeactivateStreamMessage)) {
      for (const activated_stream_components of this.read_components(
        ActivatedStreamComponent
      ).values()) {
        this.get_entity(activated_stream_components.entity_id)!.destroy();
      }

      if (stream_manager_component) {
        stream_manager_component.stream_manager.stop_and_unload_audio();
      }
    }
  }
}
