import { Emits, Engine, Reads } from "encompass-ecs";
import { StreamManagerComponent } from "../components/beat_detector";
import { StartedComponent } from "../components/started";
import { ActivateStreamMessage } from "../messages/activate_stream";
import { ChangeChannelMessage } from "../messages/change_channel";
import { LoadStreamMessage } from "../messages/load_stream";
import { StartMessage } from "../messages/start_message";

@Reads(LoadStreamMessage)
@Emits(StartMessage, ActivateStreamMessage, ChangeChannelMessage)
export class AsyncEngine extends Engine {
  private waiting_for_stream_load = false;

  public update() {
    if (this.waiting_for_stream_load) {
      for (const stream_manager_component of this.read_components(
        StreamManagerComponent
      ).iterable()) {
        if (stream_manager_component.stream_manager.loaded) {
          const started = this.read_components(StartedComponent).size !== 0;
          if (!started) {
            this.emit_message(StartMessage);
            this.emit_message(ChangeChannelMessage).amount = 1;
          }

          this.emit_message(ActivateStreamMessage);
          this.waiting_for_stream_load = false;
        }
      }
    }

    if (this.read_messages(LoadStreamMessage).size > 0) {
      this.waiting_for_stream_load = true;
    }
  }
}
