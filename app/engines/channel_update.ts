import { Emits, Engine, Mutates, Reads } from "encompass-ecs";
import { ChannelsComponent } from "../components/channels";
import { PauseComponent } from "../components/pause_component";
import { BadTVDistortionMessage } from "../messages/bad_tv_distortion";
import { ChangeChannelMessage } from "../messages/change_channel";
import { ChangeChannelNumberMessage } from "../messages/change_channel_number";
import { TogglePauseMessage } from "../messages/pause";

@Reads(ChangeChannelMessage, TogglePauseMessage)
@Emits(BadTVDistortionMessage, ChangeChannelNumberMessage)
@Mutates(ChannelsComponent)
export class ChannelUpdateEngine extends Engine {
  public update(dt: number) {
    for (const component of this.read_components_mutable(
      ChannelsComponent
    ).values()) {
      if (this.read_messages(TogglePauseMessage).size > 0) {
        const pause_components = this.read_components(PauseComponent);

        if (pause_components.size > 0) {
          for (const pause_component of pause_components.values()) {
            this.get_entity(pause_component.entity_id)!.destroy();
          }
        } else {
          const pause_entity = this.create_entity();
          pause_entity.add_component(PauseComponent);
          return;
        }
      }

      if (this.read_components(PauseComponent).size > 0) {
        return;
      }

      for (const change_channel_message of this.read_messages(
        ChangeChannelMessage
      ).values()) {
        component.current_index += change_channel_message.amount;
        if (
          component.current_index >
          component.start_index + component.channels.size - 1
        ) {
          component.current_index = component.start_index;
        } else if (component.current_index < component.start_index) {
          component.current_index =
            component.start_index + component.channels.size - 1;
        }

        this.emit_message(ChangeChannelNumberMessage).channel_number =
          component.current_index;

        const message = this.emit_message(BadTVDistortionMessage);
        message.distortion = 1;
        message.distortion2 = 10;
        message.rollSpeed = 0.1;
      }

      component.channels.get(component.current_index)!.update(dt);
    }
  }
}
