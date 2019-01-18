import { settings } from "./settings";

class Food {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.reset();
    }

    reset() {
        let grid_number = settings.canvasWidth / settings.step;
        this.x = Math.floor(Math.random() * grid_number) * settings.step;
        this.y = Math.floor(Math.random() * grid_number) * settings.step;
    }
}

export default Food;
