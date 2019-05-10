import { Engine, Reads } from "encompass-ecs";
import { StartedComponent } from "../components/started";
import { StartMessage } from "../messages/start_message";

@Reads(StartMessage)
export class StartEngine extends Engine {
    public update() {
        if (this.read_messages(StartMessage).size > 0) {
            this.create_entity().add_component(StartedComponent);
        }
    }
}
