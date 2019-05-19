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

        if (this.some(KickBeatMessage)) {
            if (Math.random() < 0.02) {
                material_component.material.emissiveColor.b = 0.9;
            }
        } else {
            const blue = material_component.material.emissiveColor.b;
            material_component.material.emissiveColor.b = Math.max(blue - 0.4 * dt, 0.2);
        }
    }
}
