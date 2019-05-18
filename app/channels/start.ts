import {
  Color4,
  MeshBuilder,
  PostProcess,
  Scene,
  Texture,
} from "babylonjs";
import {
  AdvancedDynamicTexture,
  Control,
  Image,
  Line,
  TextBlock
} from "babylonjs-gui";
import { RippleEffectComponent } from "../components/ripple_effect";
import { RippleEffectEngine } from "../engines/ripple_effect";
import { StreamManager } from "../helpers/stream_manager";
import { SceneRenderer } from "../renderers/scene";
import { Channel } from "./channel";

export class StartChannel extends Channel {
  protected init() {
    this.world_builder.add_engine(RippleEffectEngine);
    this.world_builder.add_renderer(SceneRenderer);

    this.scene.clearColor = new Color4(164 / 255, 213 / 255, 245 / 255, 1);

    this.camera.fov = 1.3;
    this.camera.position.z = -225;

    const plane = MeshBuilder.CreatePlane("texturePlane", {
      size: 600
    });
    plane.position.set(0, 0, 0);
    this.scene.addMesh(plane);

    const ui = AdvancedDynamicTexture.CreateForMesh(plane, 600, 600, false);
    ui.background = "#a4d5f5";

    const logo_header = new Image(
      "logoHeader",
      "/assets/images/logo_header.png"
    );
    logo_header.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    logo_header.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    logo_header.stretch = Image.STRETCH_UNIFORM;
    logo_header.top = -60;
    logo_header.width = "80%";
    ui.addControl(logo_header);

    const line = new Line("headerLine");
    line.x1 = 50;
    line.y1 = 320;
    line.x2 = 550;
    line.y2 = 320;
    line.lineWidth = 1;
    line.color = "#6ba8e5";
    ui.addControl(line);

    const spacebar_instructions = new TextBlock(
      "spacebar",
      "Spacebar or Touch to Begin"
    );
    spacebar_instructions.fontFamily = "DolphinOceanWave";
    spacebar_instructions.fontSize = 32;
    spacebar_instructions.color = "white";
    spacebar_instructions.horizontalAlignment =
      Control.HORIZONTAL_ALIGNMENT_CENTER;
    spacebar_instructions.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    spacebar_instructions.outlineColor = "black";
    spacebar_instructions.outlineWidth = 2;
    spacebar_instructions.top = 50;
    ui.addControl(spacebar_instructions);

    const right_arrow = new TextBlock(
      "rightArrow",
      "Arrows or Swipe to Change Channel"
    );
    right_arrow.fontFamily = "DolphinOceanWave";
    right_arrow.fontSize = 32;
    right_arrow.color = "white";
    right_arrow.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    right_arrow.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    right_arrow.outlineColor = "black";
    right_arrow.outlineWidth = 2;
    right_arrow.top = 100;
    ui.addControl(right_arrow);

    /*
        const text = new TextBlock("pressAnyKey", "Press any key to begin");
        text.fontFamily = "DolphinOceanWave";
        text.fontSize = 32;
        text.color = "white";
        text.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        text.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        text.top = 50;
        text.outlineColor = "black";
        text.outlineWidth = 2;
        ui.addControl(text);
        */

    // new FxaaPostProcess("fxaa", 1.0, camera);

    const postprocess_entity = this.world_builder.create_entity();
    const ripple_component = postprocess_entity.add_component(
      RippleEffectComponent
    );
    ripple_component.time = 0;
    const ripple_effect = new PostProcess(
      "ripple",
      "./assets/shaders/ripple",
      ["time", "screenSize"],
      ["iChannel1", "iChannel2"],
      1.0,
      this.camera
    );
    const noise_texture = new Texture("./assets/images/rgba-noise.png", this.scene);
    const cube_map_texture = new Texture("./assets/images/cubemap.png", this.scene);

    ripple_effect.onApply = effect => {
      effect.setFloat2("screenSize", window.innerWidth, window.innerHeight);
      effect.setTexture("iChannel1", noise_texture);
      effect.setTexture("iChannel2", cube_map_texture);
      effect.setFloat("time", ripple_component.time);
    };
    ripple_component.effect = ripple_effect;
  }
}
