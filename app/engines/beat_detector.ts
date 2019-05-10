import { Engine, Mutates, Emits } from "encompass-ecs";
import { StreamManagerComponent } from "../components/beat_detector";
import { KickBeatMessage } from "../messages/kick_beat";
import { SnareBeatMessage } from "../messages/snare_beat";

@Emits(KickBeatMessage, SnareBeatMessage)
@Mutates(StreamManagerComponent)
export class BeatDetectorEngine extends Engine {
  public update() {
    for (const stream_manager_component of this.read_components(
      StreamManagerComponent
    ).iterable()) {
      stream_manager_component.stream_manager.update();

      if (stream_manager_component.stream_manager.beat_detector) {
        if (stream_manager_component.stream_manager.beat_detector.isKick()) {
          this.emit_message(KickBeatMessage);
        }

        if (stream_manager_component.stream_manager.beat_detector.isSnare()) {
          this.emit_message(SnareBeatMessage);
        }
      }
    }
  }
}
