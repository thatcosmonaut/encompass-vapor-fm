import { GeneralRenderer } from "encompass-ecs";
import { WebGLRenderer } from "three";
import { SceneComponent } from "../components/scene";

export class SceneRenderer extends GeneralRenderer {
    public layer = 0;
    private renderer: WebGLRenderer;

    public initialize(renderer: WebGLRenderer) {
        this.renderer = renderer;
    }

    public render() {
        for (const scene_component of this.read_components(SceneComponent).iterable()) {
            this.renderer.render(scene_component.scene, scene_component.camera);
        }
    }
}
