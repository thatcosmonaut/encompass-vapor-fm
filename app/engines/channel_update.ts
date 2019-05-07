import { Emits, Engine, Mutates, Reads } from "encompass-ecs";
import { ChannelsComponent } from "../components/channels";
import { BadTVDistortionMessage } from "../messages/bad_tv_distortion";
import { ChangeChannelMessage } from "../messages/change_channel";

@Reads(ChangeChannelMessage)
@Emits(BadTVDistortionMessage)
@Mutates(ChannelsComponent)
export class ChannelUpdateEngine extends Engine {
    public update(dt: number) {
        for (const component of this.read_components_mutable(ChannelsComponent).iterable()) {
            for (const change_channel_message of this.read_messages(ChangeChannelMessage).iterable()) {
                component.current_index += change_channel_message.amount;
                if (component.current_index > component.start_index + component.channels.size - 1) {
                    component.current_index = component.start_index;
                }

                const message = this.emit_message(BadTVDistortionMessage);
                message.distortion = 1;
                message.distortion2 = 1;
                message.rollSpeed = 0.1;
            }

            component.channels.get(component.current_index)!.update(dt);
        }
    }
}
