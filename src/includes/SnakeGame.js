import Food from "./Food";

class SnakeGame {

    constructor(id) {
        this.id = id;
        
        let canvasContainer = document.getElementById(id)
        this.canvasContainer = canvasContainer === null ? this.createCanvas() : canvasContainer;
        this.food = new Food(id);
    }

    getCanvas() {
        return document.getElementById(this.id)
    }

    createCanvas() {
        let canvas = document.createElement('canvas');
        canvas.id = this.id;
        canvas.className = 'canvas-item';
        canvas.width = 200;
        canvas.height = 200;

        let canvasContainer = document.createElement('div');
        canvasContainer.id = `container_${this.id}`;
        canvasContainer.className = 'canvas-container';
        document.getElementById('main_content').appendChild(canvasContainer);
        canvasContainer.appendChild(canvas);

        this.redraw();

        return canvasContainer;
    }

    redraw() {
        let ctx = this.getCanvas().getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, 200, 200);
    }

    getFoodEaten() {
        if (this.food.getEaten) {
            return true;
        }
    }

    createFood() {
        if (this.getFoodEaten()) {
            this.food.reset();
        }
    }

    setFoodEaten() {
        this.food.setEaten();
    }

    drawFood() {
        let ctx = this.getCanvas().getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(this.food.x, this.food.y, this.food.step / 2, this.food.step / 2);
        ctx.stroke();
    }
}

export default SnakeGame;
