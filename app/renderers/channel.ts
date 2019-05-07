import { GeneralRenderer } from "encompass-ecs";
import { ChannelsComponent } from "../components/channels";

export class ChannelRenderer extends GeneralRenderer {
    public layer = 0;

    public render() {
        for (const channel_component of this.read_components(ChannelsComponent).iterable()) {
            channel_component.channels.get(channel_component.current_index)!.draw();
        }
    }
}
