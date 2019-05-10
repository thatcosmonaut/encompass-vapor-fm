import { Engine, Mutates, Reads } from "encompass-ecs";
import { SignalTextComponent } from "../../components/ui/signal_message";
import { ActivateStreamMessage } from "../../messages/activate_stream";
import { LoadStreamMessage } from "../../messages/load_stream";

@Reads(LoadStreamMessage, ActivateStreamMessage)
@Mutates(SignalTextComponent)
export class SignalTextEngine extends Engine {
  public update() {
    if (this.read_messages(LoadStreamMessage).size > 0) {
      for (const signal_text_component of this.read_components_mutable(
        SignalTextComponent
      ).iterable()) {
        signal_text_component.text_block.isVisible = true;
      }
    }

    if (this.read_messages(ActivateStreamMessage).size > 0) {
      for (const signal_text_component of this.read_components_mutable(
        SignalTextComponent
      ).iterable()) {
        signal_text_component.text_block.isVisible = false;
      }
    }
  }
}
