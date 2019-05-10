import { Message } from "encompass-ecs";
import { AngularVelocityComponent } from "../../components/angular_velocity";

export class ChangeAngularVelocityMessage extends Message {
  public component: Readonly<AngularVelocityComponent>;
  public x: number;
  public y: number;
  public z: number;
}
