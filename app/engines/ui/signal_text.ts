import { Engine, Mutates, Reads } from "encompass-ecs";
import { SignalTextComponent } from "../../components/ui/signal_message";
import { ActivateStreamMessage } from "../../messages/activate_stream";
import { LoadStreamMessage } from "../../messages/load_stream";

@Reads(LoadStreamMessage, ActivateStreamMessage)
@Mutates(SignalTextComponent)
export class SignalTextEngine extends Engine {
  public update() {
    const signal_text_component = this.read_component_mutable(SignalTextComponent);
    if (signal_text_component) {
      if (this.some(LoadStreamMessage)) {
        signal_text_component.text_block.isVisible = true;
      }

      if (this.some(ActivateStreamMessage)) {
        signal_text_component.text_block.isVisible = false;
      }
    }
  }
}
