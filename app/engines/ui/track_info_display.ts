import { Engine, Mutates, Reads } from "encompass-ecs";
import { ArtistInfoUIComponent } from "../../components/ui/artist_info";
import { SongInfoUIComponent } from "../../components/ui/song_info";
import { ChangeArtistTextMessage } from "../../messages/change_artist_text";
import { ChangeSongTextMessage } from "../../messages/change_song_text";
import { ShowUIMessage } from "../../messages/show_ui";

// can probably refactor this so artistinfoui and songinfoui are the same component?

@Reads(ShowUIMessage, ChangeArtistTextMessage, ChangeSongTextMessage)
@Mutates(ArtistInfoUIComponent, SongInfoUIComponent)
export class TrackInfoDisplayEngine extends Engine {
    public update(dt: number) {
        for (const artist_info_ui_component of this.read_components(ArtistInfoUIComponent).iterable()) {
            if (this.read_messages(ShowUIMessage).size > 0) {
                console.log("show ui");
                artist_info_ui_component.text_block.isVisible = true;
            }

            for (const change_artist_text_message of this.read_messages(ChangeArtistTextMessage).iterable()) {
                artist_info_ui_component.text_block.text = change_artist_text_message.text;
            }
        }

        for (const song_info_ui_component of this.read_components(SongInfoUIComponent).iterable()) {
            if (this.read_messages(ShowUIMessage).size > 0) {
                song_info_ui_component.text_block.isVisible = true;
            }

            for (const change_song_text_message of this.read_messages(ChangeSongTextMessage).iterable()) {
                song_info_ui_component.text_block.text = change_song_text_message.text;
            }
        }
    }
}
