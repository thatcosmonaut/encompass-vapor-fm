import { Message } from "encompass-ecs";

export class ChangeSongTextMessage extends Message {
  public text: string;
}
