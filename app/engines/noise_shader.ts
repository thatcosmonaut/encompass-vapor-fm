import { Engine, Mutates } from "encompass-ecs";
import { NoiseShaderComponent } from "../components/noise_shader";

@Mutates(NoiseShaderComponent)
export class NoiseShaderEngine extends Engine {
    public update(dt: number) {
        for (const noise_shader_component of this.read_components_mutable(NoiseShaderComponent).iterable()) {
            noise_shader_component.shader.uniforms.time.value += dt;
        }
    }
}
