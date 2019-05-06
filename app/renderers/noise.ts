import { Entity, EntityRenderer } from "encompass-ecs";
import { RenderTarget, WebGLRenderer } from "three";
import { NoiseShaderComponent } from "../components/noise_shader";

export class NoiseRenderer extends EntityRenderer {
    public component_types = [];
    public draw_component_type = NoiseShaderComponent;

    private renderer: WebGLRenderer;
    private renderTarget: RenderTarget;

    public initialize(renderer: WebGLRenderer, renderTarget: RenderTarget) {
        this.renderer = renderer;
        this.renderTarget = renderTarget;
    }

    public render(entity: Entity) {
        const noise_shader = entity.get_component(NoiseShaderComponent);
        noise_shader.full_screen_quad.render(this.renderer);
    }
}
