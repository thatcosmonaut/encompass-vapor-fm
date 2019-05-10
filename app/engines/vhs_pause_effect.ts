import { Engine, Mutates, Reads } from "encompass-ecs";
import { ActivatedStreamComponent } from "../components/activated_stream";
import { StartedComponent } from "../components/started";
import { VHSPauseComponent } from "../components/vhs_pause";
import { DeactivateStreamMessage } from "../messages/deactivate_stream";

@Reads(DeactivateStreamMessage)
@Mutates(VHSPauseComponent)
export class VHSPauseEffectEngine extends Engine {
    public update(dt: number) {
        const started = this.read_components(StartedComponent).size !== 0;
        const activated = this.read_components(ActivatedStreamComponent).size !== 0;

        if (started) {
            for (const vhs_pause_component of this.read_components_mutable(VHSPauseComponent).iterable()) {
                if (!activated) {
                    vhs_pause_component.amount = 1;
                    vhs_pause_component.time += dt;
                } else {
                    vhs_pause_component.amount = 0;
                }
            }
        }
    }
}
