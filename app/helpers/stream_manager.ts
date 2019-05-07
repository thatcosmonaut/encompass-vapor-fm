import { BeatDetector } from "./beat_detector";

export class StreamManager {
    context: AudioContext;
    public analyser: AnalyserNode;
    public frequencyData: Uint8Array;
    public floats: Float32Array;

    public beat_detector: BeatDetector;

    audio_element: HTMLAudioElement;
    loading: boolean;
    loaded: boolean;
    load_check_timeout: number;

    constructor() {
        this.loading = false;
        this.audio_element = document.getElementById("stream") as HTMLAudioElement;

        this.add_can_play_listener();
        this.stop_and_unload_audio();
    }

    init_audio_context() {
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.85;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.floats = new Float32Array(this.analyser.frequencyBinCount);
    }

    update() {
        if (this.loaded) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            this.analyser.getFloatTimeDomainData(this.floats);
            this.beat_detector.update(this.floats);
        }
    }

    stop_and_unload_audio() {
        window.clearTimeout(this.load_check_timeout);

        this.audio_element.pause();
        const original_src = this.audio_element.src;
        this.audio_element.src = "about:blank";
        this.audio_element.load();
        this.audio_element.remove();
        this.audio_element = document.createElement("audio");
        this.audio_element.setAttribute("id", "stream");
        this.audio_element.setAttribute("preload", "none");
        this.audio_element.setAttribute("crossorigin", "anonymous");
        document.getElementById("audioContainer")!.append(this.audio_element);
        this.audio_element = document.getElementById("stream") as HTMLAudioElement;
        this.audio_element.src = original_src;

        this.add_can_play_listener();
        this.add_stalled_listener();

        this.loaded = false;
        this.loading = false;
    }

    add_stalled_listener() {
        this.audio_element.addEventListener("stalled", () => {
            this.stop_and_unload_audio();
            this.load_and_play_audio();
        });
    }

    load_and_play_audio() {
        console.log("starting stream");
        this.init_audio_context();
        this.loading = true;
        this.audio_element.setAttribute("preload", "auto"); //firefox hack
        this.audio_element.load();
        window.clearTimeout(this.load_check_timeout);
        this.load_check_timeout = window.setTimeout(this.check_loaded, 8000);
    }

    check_loaded() {
        if (this.loading) {
            this.audio_element.load();
            this.load_check_timeout = window.setTimeout(this.check_loaded, 8000);
        }
    }

    add_can_play_listener() {
        const audio_loaded = new Event("audioLoaded");
        const listener = () => {
            window.dispatchEvent(audio_loaded);
            this.loaded = true;
            this.loading = false;
            const source = this.context.createMediaElementSource(this.audio_element);
            source.connect(this.analyser);
            source.connect(this.context.destination);

            this.beat_detector = new BeatDetector(
                this.analyser.frequencyBinCount,
                this.context.sampleRate,
                this.floats
            );
            this.beat_detector.setSensitivity(300);

            this.audio_element.play();

            // firefox hack b/c firefox fires canplay event a million times for no reason lol web dev
            this.audio_element.removeEventListener("canplay", listener);
        };

        this.audio_element.addEventListener("canplay", listener);
    }
}
