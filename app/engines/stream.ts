import { Engine, Reads } from "encompass-ecs";
import { ActivatedStreamComponent } from "../components/activated_stream";
import { StreamManagerComponent } from "../components/beat_detector";
import { DeactivateStreamMessage } from "../messages/deactivate_stream";
import { LoadStreamMessage } from "../messages/load_stream";

@Reads(LoadStreamMessage, DeactivateStreamMessage)
export class StreamEngine extends Engine {
    public update() {
        if (this.read_messages(LoadStreamMessage).size > 0) {
            this.create_entity().add_component(ActivatedStreamComponent);

            for (const stream_manager_component of this.read_components(StreamManagerComponent).iterable()) {
                stream_manager_component.stream_manager.load_and_play_audio();
            }
        }

        if (this.read_messages(DeactivateStreamMessage).size > 0) {
            for (const activated_stream_components of this.read_components(ActivatedStreamComponent).iterable()) {
                this.get_entity(activated_stream_components.entity_id)!.destroy();
            }

            for (const stream_manager_component of this.read_components(StreamManagerComponent).iterable()) {
                stream_manager_component.stream_manager.stop_and_unload_audio();
            }
        }
    }
}
