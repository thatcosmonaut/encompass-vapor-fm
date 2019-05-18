import { Color3, PostProcess } from "babylonjs";
import { CheckerboardComponent } from "../components/checkerboard";
import { CheckerboardEngine } from "../engines/checkerboard";
import { Channel } from "./channel";

export class EndlessHallChannel extends Channel {
    protected init() {
        const world_builder = this.world_builder;
        this.world_builder.add_engine(CheckerboardEngine);

        const postprocess_entity = world_builder.create_entity();
        const checkerboard_component = postprocess_entity.add_component(CheckerboardComponent);
        checkerboard_component.time = 0;
        checkerboard_component.color = new Color3(1, 1, 1);
        const checkerboard_effect = new PostProcess(
            "checkerboard",
            "./assets/shaders/checkerboard",
            ["time", "lightColor"],
            null,
            1.0,
            this.camera
        );
        checkerboard_effect.onApply = effect => {
            effect.setFloat("time", checkerboard_component.time);
            effect.setColor3("lightColor", checkerboard_component.color);
        };
        checkerboard_component.effect = checkerboard_effect;
    }
}
