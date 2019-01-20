import { settings } from "./settings";

class Food {

    constructor() {
        this.reset();
    }

    reset() {
        let grid_number = settings.canvasSize / settings.step;
        this.x = Math.floor(Math.random() * grid_number) * settings.step;
        this.y = Math.floor(Math.random() * grid_number) * settings.step;
    }
}

export default Food;
