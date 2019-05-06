import {
    Material,
    Mesh,
    OrthographicCamera,
    PlaneBufferGeometry,
    Scene,
    WebGLRenderer,
} from "three";

export class FullScreenQuad {
    private camera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    private geometry = new PlaneBufferGeometry(2, 2);
    private mesh: Mesh;
    private scene: Scene;

    constructor(material: Material | Material[]) {
        this.scene = new Scene();
        this.mesh = new Mesh(this.geometry, material);

        this.scene.add(this.mesh);
    }

    get material(): Material | Material[] {
        return this.mesh.material;
    }

    set material(value: Material | Material[]) {
        this.mesh.material = value;
    }

    public render(renderer: WebGLRenderer) {
        renderer.render(this.scene, this.camera);
    }
}
