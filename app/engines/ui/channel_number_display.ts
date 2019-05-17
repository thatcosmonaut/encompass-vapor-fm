import { Engine, Mutates, Reads } from "encompass-ecs";
import { ChannelNumberComponent } from "../../components/channel_number";
import { ChangeChannelNumberMessage } from "../../messages/change_channel_number";
import { ShowChannelNumberMessage } from "../../messages/show_channel_number";

@Reads(ShowChannelNumberMessage, ChangeChannelNumberMessage)
@Mutates(ChannelNumberComponent)
export class ChannelNumberDisplayEngine extends Engine {
  public update(dt: number) {
    for (const channel_number_component of this.read_components_mutable(
      ChannelNumberComponent
    ).values()) {
      if (channel_number_component.text_block.isVisible) {
        channel_number_component.time -= dt;

        if (channel_number_component.time < 0) {
          channel_number_component.text_block.isVisible = false;
        }
      }

      for (const show_channel_number_message of this.read_messages(
        ShowChannelNumberMessage
      ).values()) {
        channel_number_component.text_block.isVisible = true;
        channel_number_component.time = 5;
      }

      for (const change_channel_number_message of this.read_messages(
        ChangeChannelNumberMessage
      ).values()) {
        channel_number_component.text_block.text = change_channel_number_message.channel_number.toString();
      }
    }
  }
}
