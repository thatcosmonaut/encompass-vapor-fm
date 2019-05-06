import { Clock } from "three";
import { Page } from "./app/page";

const page = new Page();
page.load();

const clock = new Clock();

function animate() {
    requestAnimationFrame(animate);

    page.update(clock.getDelta());
    page.draw();
}

animate();
