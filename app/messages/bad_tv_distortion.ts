import { Message } from "encompass-ecs";

export class BadTVDistortionMessage extends Message {
  public distortion: number;
  public distortion2: number;
  public rollSpeed: number;
}
