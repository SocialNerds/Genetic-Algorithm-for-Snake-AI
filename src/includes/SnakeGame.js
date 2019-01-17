import Food from "./Food";
import Snake from "./Snake";
import { settings } from "./settings";

class SnakeGame {

    constructor(id) {
        this.id = id;
        
        let canvasContainer = document.getElementById(id)
        this.canvasContainer = canvasContainer === null ? this.createCanvas() : canvasContainer;
        this.food = new Food(id);
        this.snake = new Snake(id);
    }

    getCanvas() {
        return document.getElementById(this.id)
    }

    createCanvas() {
        let canvas = document.createElement('canvas');
        canvas.id = this.id;
        canvas.className = 'canvas-item';
        canvas.width = settings.canvasWidth;
        canvas.height = settings.canvasHeight;

        let canvasContainer = document.createElement('div');
        canvasContainer.id = `container_${this.id}`;
        canvasContainer.className = 'canvas-container';
        document.getElementById('main_content').appendChild(canvasContainer);
        canvasContainer.appendChild(canvas);

        this.drawCanvas();

        return canvasContainer;
    }

    drawCanvas() {
        let ctx = this.getCanvas().getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, settings.canvasWidth, settings.canvasHeight);
    }

    drawFood() {
        let ctx = this.getCanvas().getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(this.food.x, this.food.y, settings.step, settings.step);
        ctx.stroke();
    }

    drawSnake() {
        let ctx = this.getCanvas().getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(this.snake.x, this.snake.y, settings.step, settings.step);
        ctx.stroke();

        // Draw queue.
        this.snake.queue.forEach(queueItem => {
            ctx.fillRect(queueItem[0], queueItem[1], settings.step, settings.step);
            ctx.stroke();
        });
    }
}

export default SnakeGame;
