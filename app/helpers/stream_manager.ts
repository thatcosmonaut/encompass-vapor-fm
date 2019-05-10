import { BeatDetector } from "./beat_detector";

export class StreamManager {
    public beat_detector: BeatDetector;
    private _loading: boolean;
    private _loaded: boolean;

    private audio_element: HTMLAudioElement;
    private context: AudioContext;
    private analyser: AnalyserNode;
    private frequencyData: Uint8Array;
    private floats: Float32Array;
    private load_check_timeout: number;

    get loading() {
        return this._loading;
    }

    get loaded() {
        return this._loaded;
    }

    constructor() {
        this._loading = false;
        this.audio_element = document.getElementById("stream") as HTMLAudioElement;

        this.stop_and_unload_audio();
    }

    public update() {
        if (this._loaded) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            this.analyser.getFloatTimeDomainData(this.floats);
            this.beat_detector.update(this.floats);
        }
    }

    public stop_and_unload_audio() {
        window.clearTimeout(this.load_check_timeout);

        this.audio_element.pause();
        const original_src = this.audio_element.src;
        this.audio_element.src = "about:blank";
        this.audio_element.load();
        this.audio_element.remove();
        this.audio_element = document.createElement("audio");
        this.audio_element.setAttribute("id", "stream");
        // this.audio_element.setAttribute("preload", "none");
        this.audio_element.setAttribute("crossorigin", "anonymous");
        document.getElementById("audioContainer")!.append(this.audio_element);
        this.audio_element = document.getElementById("stream") as HTMLAudioElement;
        this.audio_element.src = original_src;

        this._loaded = false;
        this._loading = false;
    }

    public load_and_play_audio() {
        this.init_audio_context();
        this.add_can_play_listener();
        this.add_stalled_listener();

        this._loading = true;
        // this.audio_element.setAttribute("preload", "auto"); //firefox hack
        this.audio_element.load();
        window.clearTimeout(this.load_check_timeout);
        this.load_check_timeout = window.setTimeout(this.check_loaded, 8000);
    }

    private init_audio_context() {
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.85;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.floats = new Float32Array(this.analyser.frequencyBinCount);
    }

    private add_stalled_listener() {
        this.audio_element.addEventListener("stalled", () => {
            this.stop_and_unload_audio();
            this.load_and_play_audio();
        });
    }

    private check_loaded() {
        if (this._loading) {
            this.audio_element.load();
            this.load_check_timeout = window.setTimeout(this.check_loaded, 8000);
        }
    }

    private add_can_play_listener() {
        const audio_loaded = new Event("audioLoaded");
        const listener = () => {
            window.dispatchEvent(audio_loaded);
            this._loaded = true;
            this._loading = false;
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
