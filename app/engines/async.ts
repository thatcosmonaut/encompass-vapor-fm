import { Emits, Engine, Reads } from "encompass-ecs";
import { ActivateStreamMessage } from "../messages/activate_stream";
import { LoadStreamMessage } from "../messages/load_stream";

@Reads(LoadStreamMessage)
@Emits(ActivateStreamMessage)
export class AsyncEngine extends Engine {
    private waiting_for_stream_load = false;
    private stream_loaded = false;

    public update() {
        if (this.waiting_for_stream_load && this.stream_loaded) {
            this.emit_message(ActivateStreamMessage);
        }

        if (this.read_messages(LoadStreamMessage).size > 0) {
            this.waiting_for_stream_load = true;

            document.addEventListener("canplay", () => {
                this.waiting_for_stream_load = false;
            });
        }
    }
}
