import { Engine, Mutates, Reads } from "encompass-ecs";
import { LogoUIComponent } from "../../components/ui/logo";
import { ShowUIMessage } from "../../messages/show_ui";

@Reads(ShowUIMessage)
@Mutates(LogoUIComponent)
export class LogoDisplayEngine extends Engine {
  public update() {
    const logo_ui_component = this.read_component_mutable(LogoUIComponent);
    if (logo_ui_component) {
      if (this.some(ShowUIMessage)) {
        logo_ui_component.image.isVisible = true;
      }
    }
  }
}
