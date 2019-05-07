import { Emits, Engine, Reads } from "encompass-ecs";
import { ICurrentChannel } from "../interfaces/current_channel";
import { BadTVDistortionMessage } from "../messages/bad_tv_distortion";
import { ChangeChannelMessage } from "../messages/change_channel";

@Reads(ChangeChannelMessage)
@Emits(BadTVDistortionMessage)
export class ChangeChannelEngine extends Engine {
    private current_channel: ICurrentChannel;
    private start_index = 3;
    private amount = 2;
    public initialize(current_channel: ICurrentChannel) {
        this.start_index = 3;
        this.current_channel = current_channel;
    }

    public update() {
        for (const change_channel_message of this.read_messages(ChangeChannelMessage).iterable()) {
            this.current_channel.current += change_channel_message.amount;
            if (this.current_channel.current > this.start_index + this.amount - 1) {
                this.current_channel.current = this.start_index;
            }
            const message = this.emit_message(BadTVDistortionMessage);
            message.distortion = 1;
            message.distortion2 = 1;
            message.rollSpeed = 0.1;
        }
    }
}
