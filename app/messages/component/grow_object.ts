import { ComponentMessage, Message } from "encompass-ecs";
import { MeshComponent } from "../../components/mesh_component";

export class GrowObjectMessage extends Message implements ComponentMessage {
    public component: Readonly<MeshComponent>;
    public x: number;
    public y: number;
    public z: number;
}
