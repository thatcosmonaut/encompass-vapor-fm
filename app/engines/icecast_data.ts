import { Emits, Engine, Mutates, Reads } from "encompass-ecs";
import { IcecastTimerComponent } from "../components/icecast_timer";
import { IcecastHelper } from "../helpers/icecast";
import { ChangeArtistTextMessage } from "../messages/change_artist_text";
import { ChangeSongTextMessage } from "../messages/change_song_text";
import { ShowUIMessage } from "../messages/show_ui";

@Reads(ShowUIMessage)
@Mutates(IcecastTimerComponent)
@Emits(ChangeArtistTextMessage, ChangeSongTextMessage)
export class IcecastDataEngine extends Engine {
  private artist_text_to_update?: string;
  private song_text_to_update?: string;

  public update(dt: number) {
    if (this.artist_text_to_update) {
      this.emit_message(ChangeArtistTextMessage).text = this.artist_text_to_update.slice(0); // deep copy
      this.artist_text_to_update = undefined;
    }

    if (this.song_text_to_update) {
      this.emit_message(ChangeSongTextMessage).text = this.song_text_to_update.slice(0);
      this.song_text_to_update = undefined;
    }

    for (const icecast_timer_component of this.read_components_mutable(
      IcecastTimerComponent
    ).iterable()) {
      icecast_timer_component.time_remaining -= dt;

      if (icecast_timer_component.time_remaining < 0) {
        IcecastHelper.getSongData(data => {
          this.artist_text_to_update = data.artistName;
          this.song_text_to_update = data.songName;
        });
        icecast_timer_component.time_remaining = 10;
      }
    }
  }
}
