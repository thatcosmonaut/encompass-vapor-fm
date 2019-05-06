import { DrawComponent } from "encompass-ecs";
import { Material, ShaderMaterial } from "three";
import { NoiseShader } from "../assets/shaders/noise_shader";
import { FullScreenQuad } from "../helpers/full_screen_quad";

export class NoiseShaderComponent extends DrawComponent {
    public shader: NoiseShader;
    public time: number;
    public material: Material;
    public full_screen_quad: FullScreenQuad;

    protected on_initialize() {
        this.shader = new NoiseShader();
        this.shader.uniforms.amount.value = 1;

        this.material = new ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader,
            depthWrite: false,
            depthTest: false,
        });

        this.full_screen_quad = new FullScreenQuad(this.material);
    }
}
