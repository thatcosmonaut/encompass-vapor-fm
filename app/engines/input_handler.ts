import { Emits, Engine } from "encompass-ecs";
import { GCOptimizedMap } from "tstl-gc-optimized-collections";
import { ChangeChannelMessage } from "../messages/change_channel";

enum KeyState {
    Up,
    Pressed,
    Down,
    Released,
}

@Emits(ChangeChannelMessage)
export class InputHandlerEngine extends Engine {
    private key_states = new GCOptimizedMap<number, KeyState>();

    public initialize() {
        this.register_key(39);

        document.onkeydown = (e) => {
            if (this.key_states.has(e.keyCode)) {
                this.key_states.set(e.keyCode, KeyState.Pressed);
            }
        };

        document.onkeyup = (e) => {
            if (this.key_states.has(e.keyCode)) {
                this.key_states.set(e.keyCode, KeyState.Released);
            }
        };
    }

    public update() {
        if (this.key_pressed(39)) {
            const message = this.emit_message(ChangeChannelMessage);
            message.amount = 1;
        }

        for (const [key, key_state] of this.key_states.iterable()) {
            switch (key_state) {
                case KeyState.Pressed:
                    this.key_states.set(key, KeyState.Down);
                    break;

                case KeyState.Released:
                    this.key_states.set(key, KeyState.Up);
                    break;
            }
        }
    }

    private register_key(keyCode: number) {
        this.key_states.set(keyCode, KeyState.Up);
    }

    private key_pressed(keyCode: number) {
        return this.key_states.get(keyCode)! === KeyState.Pressed;
    }

    private key_down(keyCode: number) {
        return this.key_states.get(keyCode)! === KeyState.Down;
    }
}
