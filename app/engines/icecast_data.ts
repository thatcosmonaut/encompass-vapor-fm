import { Engine, Mutates } from "encompass-ecs";
import { IcecastTimerComponent } from "../components/icecast_timer";
import { TextUIComponent } from "../components/text_ui";
import { IcecastHelper } from "../helpers/icecast";

@Mutates(IcecastTimerComponent)
export class IcecastDataEngine extends Engine {
    public update(dt: number) {
        for (const icecast_timer_component of this.read_components_mutable(IcecastTimerComponent).iterable()) {
            const entity = this.get_entity(icecast_timer_component.entity_id)!;
            const text_components = entity.get_components(TextUIComponent);
            let artist_text_component: TextUIComponent;
            let song_text_component: TextUIComponent;

            for (const [_, component] of text_components.iterable()) {
                if (component.tag === "artist") {
                    artist_text_component = component;
                } else if (component.tag === "song") {
                    song_text_component = component;
                }
            }

            icecast_timer_component.time_remaining -= dt;

            if (icecast_timer_component.time_remaining < 0) {
                IcecastHelper.getSongData((data) => {
                    // this is evil
                    artist_text_component.text_block.text = data.artistName;
                    song_text_component.text_block.text = data.songName;
                });
                icecast_timer_component.time_remaining = 10;
            }
        }
    }
}
