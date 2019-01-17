class Food {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.step = 10;
        this.reset();
    }

    reset() {
        let grid_number = this.canvas.width / this.step;
        this.x = Math.floor(Math.random() * grid_number) * this.step + this.step / 4;
        this.y = Math.floor(Math.random() * grid_number) * this.step + this.step / 4;
        this.eaten = false;
    }

    setEaten() {
        this.eaten = true;
    }

    getEaten() {
        return this.eaten;
    }
}

export default Food;
