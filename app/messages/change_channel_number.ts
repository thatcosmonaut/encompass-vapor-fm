import { Message } from "encompass-ecs";

export class ChangeChannelNumberMessage extends Message {
    public channel_number: number;
}
