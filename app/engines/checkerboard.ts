import { Color3 } from "babylonjs";
import { Engine, Mutates, Reads } from "encompass-ecs";
import { CheckerboardComponent } from "../components/checkerboard";
import { MathHelper } from "../helpers/math";
import { SnareBeatMessage } from "../messages/snare_beat";

@Reads(SnareBeatMessage)
@Mutates(CheckerboardComponent)
export class CheckerboardEngine extends Engine {
    public update(dt: number) {
        for (const checkerboard_component of this.read_components_mutable(CheckerboardComponent).values()) {
            checkerboard_component.time += dt;

            if (this.some(SnareBeatMessage)) {
                const r = MathHelper.getRandomArbitrary(0.5, 1);
                const g = MathHelper.getRandomArbitrary(0.5, 1);
                const b = MathHelper.getRandomArbitrary(0.5, 1);
                checkerboard_component.color.set(r, g, b);
            }
        }
    }
}
