import { Engine, Mutates, Reads } from "encompass-ecs";
import { LogoUIComponent } from "../../components/ui/logo";
import { ShowUIMessage } from "../../messages/show_ui";

@Reads(ShowUIMessage)
@Mutates(LogoUIComponent)
export class LogoDisplayEngine extends Engine {
  public update(dt: number) {
    for (const logo_ui_component of this.read_components_mutable(
      LogoUIComponent
    ).iterable()) {
      if (this.read_messages(ShowUIMessage).size > 0) {
        logo_ui_component.image.isVisible = true;
      }
    }
  }
}
