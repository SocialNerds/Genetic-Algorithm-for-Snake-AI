import Food from "./Food";
import Snake from "./Snake";
import Model from "./Model";
import { settings } from "./settings";

class SnakeGame {

    constructor(id) {
        this.id = id;

        let canvasContainer = document.getElementById(id)
        this.canvasContainer = canvasContainer === null ? this.createCanvas() : canvasContainer;
        this.food = new Food(id);
        this.snake = new Snake(id);
        this.model = new Model(id);
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
            ctx.fillRect(queueItem.x, queueItem.y, settings.step, settings.step);
            ctx.stroke();
        });
    }

    /**
     * Returns an array with the state of the current game.
     */
    getState() {
        let state = [];
        for (let y = 0; y < settings.canvasHeight; y += settings.step) {
            for (let x = 0; x < settings.canvasWidth; x += settings.step) {
                let currentType = settings.state.black;
                if (this.snake.x == x && this.snake.y == y) {
                    currentType = settings.state.snake;
                }
                if (this.food.x == x && this.food.y == y) {
                    currentType = settings.state.food;
                }

                for (let i = 0; i < this.snake.queue.length; i++) {
                    if (this.snake.queue[0][x] == x && this.snake.queue[0][y] == y) {
                        currentType = settings.state.queue;
                        break;
                    }
                }

                state.push(currentType);
            }
        }

        return state;
    }
}

export default SnakeGame;
