import { ComponentMessage, Message } from "encompass-ecs";
import { ObjectComponent } from "../../components/object_3d_component";

export class GrowObjectMessage extends Message implements ComponentMessage {
    public component: Readonly<ObjectComponent>;
    public x: number;
    public y: number;
    public z: number;
}
