import { PostProcess } from "babylonjs";
import { NoiseComponent } from "../components/noise";
import { NoiseEngine } from "../engines/noise";
import { Channel } from "./channel";

export class NoiseChannel extends Channel {
  protected init() {
    this.world_builder.add_engine(NoiseEngine);

    const postprocess_entity = this.world_builder.create_entity();

    const noise_component = postprocess_entity.add_component(NoiseComponent);
    noise_component.time = 0;
    noise_component.amount = 1;
    const noise_effect = new PostProcess(
      "noise",
      "./assets/shaders/noise",
      ["time", "amount"],
      null,
      1.0,
      this.camera
    );
    noise_effect.onApply = effect => {
      effect.setFloat("time", noise_component.time);
      effect.setFloat("amount", noise_component.amount);
    };
    noise_component.effect = noise_effect;
  }
}
