import {
  BlurPostProcess,
  Color4,
  DefaultRenderingPipeline,
  Engine,
  PostProcess,
  Scene,
  UniversalCamera,
  Vector2,
  Vector3
} from "babylonjs";
import {
  AdvancedDynamicTexture,
  Control,
  Image,
  TextBlock
} from "babylonjs-gui";
import { World, WorldBuilder } from "encompass-ecs";
import { BustState } from "./channels/bust";
import { Channel } from "./channels/channel";
import { CybergridState } from "./channels/cybergrid";
import { DarkBustState } from "./channels/dark_bust";
import { StartChannel } from "./channels/start";
import { BadTVEffectComponent } from "./components/bad_tv_effect";
import { StreamManagerComponent } from "./components/beat_detector";
import { ChannelNumberComponent } from "./components/channel_number";
import { ChannelsComponent } from "./components/channels";
import { CRTEffectComponent } from "./components/crt_effect";
import { IcecastTimerComponent } from "./components/icecast_timer";
import { SceneComponent } from "./components/scene";
import { ArtistInfoUIComponent } from "./components/ui/artist_info";
import { LogoUIComponent } from "./components/ui/logo";
import { SongInfoUIComponent } from "./components/ui/song_info";
import { BadTVEffectEngine } from "./engines/bad_tv_effect";
import { ChannelUpdateEngine } from "./engines/channel_update";
import { CRTEffectEngine } from "./engines/crt_effect";
import { IcecastDataEngine } from "./engines/icecast_data";
import { InputHandlerEngine } from "./engines/input_handler";
import { StartEngine } from "./engines/start";
import { StreamEngine } from "./engines/stream";
import { ChannelNumberDisplayEngine } from "./engines/ui/channel_number_display";
import { LogoDisplayEngine } from "./engines/ui/logo_display";
import { TrackInfoDisplayEngine } from "./engines/ui/track_info_display";
import { StreamManager } from "./helpers/stream_manager";
import { ChannelRenderer } from "./renderers/channel";
import { SceneRenderer } from "./renderers/scene";
import { AsyncEngine } from "./engines/async";

export class Page {
  private world: World;
  private stream_manager: StreamManager;
  private running = false;

  public load() {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 0);
    const camera = new UniversalCamera("camera", new Vector3(), scene);

    const world_builder = new WorldBuilder();

    world_builder.add_engine(IcecastDataEngine);
    world_builder.add_engine(InputHandlerEngine).initialize();
    world_builder.add_engine(ChannelUpdateEngine);
    world_builder.add_engine(CRTEffectEngine);
    world_builder.add_engine(BadTVEffectEngine);
    world_builder.add_engine(ChannelNumberDisplayEngine);
    world_builder.add_engine(TrackInfoDisplayEngine);
    world_builder.add_engine(LogoDisplayEngine);
    world_builder.add_engine(StreamEngine);
    world_builder.add_engine(StartEngine);
    world_builder.add_engine(AsyncEngine);

    world_builder.add_renderer(ChannelRenderer);
    world_builder.add_renderer(SceneRenderer);

    this.stream_manager = new StreamManager();
    world_builder.create_entity().add_component(StreamManagerComponent).stream_manager = this.stream_manager;

    const start_channel = new StartChannel(new Scene(engine), this.stream_manager);
    const bust_state = new BustState(new Scene(engine), this.stream_manager);
    const cybergrid_state = new CybergridState(new Scene(engine), this.stream_manager);
    const dark_bust_state = new DarkBustState(new Scene(engine), this.stream_manager);

    const channels = new Map<number, Channel>();
    channels.set(2, start_channel);
    channels.set(3, bust_state);
    channels.set(4, cybergrid_state);
    channels.set(5, dark_bust_state);

    const channels_entity = world_builder.create_entity();
    const channels_component = channels_entity.add_component(ChannelsComponent);
    channels_component.channels = channels;
    channels_component.start_index = 2;
    channels_component.current_index = 2;

    const scene_entity = world_builder.create_entity();
    scene_entity.add_component(SceneComponent).scene = scene;

    const postProcess1 = new PostProcess(
      "Final compose",
      "./assets/shaders/compose",
      [],
      ["sceneSampler0"],
      1,
      camera
    );
    postProcess1.onApply = effect => {
      effect.setTextureFromPostProcess(
        "sceneSampler0",
        channels_component.channels.get(channels_component.current_index)!
          .channelPass
      );
    };

    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    const channel_number_entity = world_builder.create_entity();
    const channel_number_outline_component = channel_number_entity.add_component(ChannelNumberComponent);
    const channel_number_outline_text = new TextBlock(
      "channelNumOutline",
      channels_component.current_index.toString()
    );
    channel_number_outline_text.fontFamily = "TelegramaRaw";
    channel_number_outline_text.fontSize = 130;
    channel_number_outline_text.color = "black";
    channel_number_outline_text.textHorizontalAlignment =
      Control.HORIZONTAL_ALIGNMENT_RIGHT;
    channel_number_outline_text.textVerticalAlignment =
      Control.VERTICAL_ALIGNMENT_TOP;
    channel_number_outline_text.top = 10;
    channel_number_outline_text.left = -25;
    channel_number_outline_text.isVisible = false;
    ui.addControl(channel_number_outline_text);
    channel_number_outline_component.text_block = channel_number_outline_text;
    channel_number_outline_component.time = 0;

    const channel_number_component = channel_number_entity.add_component(ChannelNumberComponent);
    const channel_number_text = new TextBlock(
      "channelNum",
      channels_component.current_index.toString()
    );
    channel_number_text.fontFamily = "TelegramaRaw";
    channel_number_text.fontSize = 120;
    channel_number_text.color = "white";
    channel_number_text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    channel_number_text.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    channel_number_text.top = 10;
    channel_number_text.left = -20;
    channel_number_text.isVisible = false;
    ui.addControl(channel_number_text);
    channel_number_component.text_block = channel_number_text;
    channel_number_component.time = 0;

    const logo_entity = world_builder.create_entity();
    const logo_component = logo_entity.add_component(LogoUIComponent);
    const logo = new Image("logo", "/assets/images/logo.png");
    logo.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    logo.alpha = 0.5;
    logo.width = "100px";
    logo.height = "100px";
    logo.left = -20;
    logo.top = -20;
    logo.isVisible = false;
    ui.addControl(logo);
    logo_component.image = logo;

    const text_ui_entity = world_builder.create_entity();
    const icecast_timer_component = text_ui_entity.add_component(
      IcecastTimerComponent
    );
    icecast_timer_component.time_remaining = 0;

    const artist_ui_component = text_ui_entity.add_component(ArtistInfoUIComponent);

    const artist_name = new TextBlock("artistName", "kosumonotto");
    artist_name.fontFamily = "TelegramaRaw";
    artist_name.fontSize = 50;
    artist_name.color = "white";
    artist_name.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    artist_name.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    artist_name.top = -90;
    artist_name.left = 25;
    artist_name.outlineColor = "black";
    artist_name.outlineWidth = 10;
    artist_name.isVisible = false;
    ui.addControl(artist_name);
    artist_ui_component.text_block = artist_name;

    const song_ui_component = text_ui_entity.add_component(SongInfoUIComponent);

    const song_name = new TextBlock(
      "artistName",
      "really really really really really long"
    );
    song_name.fontFamily = "TelegramaRaw";
    song_name.fontSize = 50;
    song_name.color = "white";
    song_name.outlineColor = "black";
    song_name.outlineWidth = 10;
    song_name.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    song_name.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    song_name.top = -20;
    song_name.left = 25;
    song_name.isVisible = false;
    ui.addControl(song_name);
    song_ui_component.text_block = song_name;

    // const horz_blur = new BlurPostProcess(
    //   "horzBlur",
    //   new Vector2(1.0, 0),
    //   16,
    //   2.0,
    //   camera
    // );
    // const vert_blur = new BlurPostProcess(
    //   "vertBlur",
    //   new Vector2(0, 1.0),
    //   16,
    //   2.0,
    //   camera
    // );

    const pipeline = new DefaultRenderingPipeline("pipeline", true);
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.2;
    pipeline.bloomKernel = 64;
    pipeline.bloomWeight = 0.3;
    pipeline.bloomScale = 0.5;

    const postprocess_entity = world_builder.create_entity();
    const crt_effect_component = postprocess_entity.add_component(
      CRTEffectComponent
    );
    crt_effect_component.time = 0;
    const crt_effect = new PostProcess(
      "crt",
      "./assets/shaders/crt_shader",
      ["screenSize", "time"],
      null,
      1.0,
      camera
    );
    crt_effect.onApply = effect => {
      effect.setFloat2("screenSize", window.innerWidth, window.innerHeight);
      effect.setFloat("time", crt_effect_component.time);
    };
    crt_effect_component.effect = crt_effect;

    const bad_tv_component = postprocess_entity.add_component(
      BadTVEffectComponent
    );
    bad_tv_component.time = 0;
    bad_tv_component.distortion = 0.1;
    bad_tv_component.distortion2 = 0.2;
    bad_tv_component.speed = 0.1;
    bad_tv_component.rollSpeed = 0;
    const bad_tv = new PostProcess(
      "badTV",
      "./assets/shaders/badTVShader",
      ["time", "distortion", "distortion2", "speed", "rollSpeed"],
      null,
      1.0,
      camera
    );

    bad_tv.onApply = effect => {
      effect.setFloat("time", bad_tv_component.time);
      effect.setFloat("distortion", bad_tv_component.distortion);
      effect.setFloat("distortion2", bad_tv_component.distortion2);
      effect.setFloat("speed", bad_tv_component.speed);
      effect.setFloat("rollSpeed", bad_tv_component.rollSpeed);
    };
    bad_tv_component.effect = bad_tv;

    this.world = world_builder.build();

    const run_engine = () => {
      if (!this.running) {
        engine.runRenderLoop(() => {
          // if the user was tabbed out for a while dont want to get crazy values
          if (engine.getDeltaTime() < 500) {
            this.update(engine.getDeltaTime() * 0.001);
            this.draw();
          }
        });
        this.running = true;
      }
    }

    // document.addEventListener("click", () => {
    //   if (!this.stream_manager.loading && !this.stream_manager.loaded) {
    //     this.stream_manager.load_and_play_audio();
    //   }
    // })

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        engine.stopRenderLoop();
        this.running = false;
      } else {
        run_engine();
      }
    })

    window.addEventListener("resize", () => {
      engine.resize();
    });

    run_engine();
  }

  private update(dt: number) {
    this.world.update(dt);
  }

  private draw() {
    this.world.draw();
  }
}
