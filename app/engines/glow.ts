import { Color3 } from "babylonjs";
import { Detector, Entity, Reads } from "encompass-ecs";
import { GlowComponent } from "../components/glow";
import { MaterialComponent } from "../components/material";
import { KickBeatMessage } from "../messages/kick_beat";

@Reads(KickBeatMessage)
export class GlowEngine extends Detector {
    public component_types = [ MaterialComponent, GlowComponent ];
    public detect(entity: Entity, dt: number) {
        const material_component = entity.get_component(MaterialComponent);
        const glow_component = entity.get_component(GlowComponent);

        if (this.read_messages(KickBeatMessage).size > 0) {
            if (Math.random() < 0.02) {
                material_component.material.emissiveColor = new Color3(0, 0, 0.8);
            }
        } else {
            const blue = material_component.material.emissiveColor.b;
            material_component.material.emissiveColor = new Color3(0, 0, Math.max(blue - 0.4 * dt, 0.2));
        }
    }
}
