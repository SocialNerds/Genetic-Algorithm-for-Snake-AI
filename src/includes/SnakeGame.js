import Food from "./Food";
import Snake from "./Snake";
import Model from "./Model";
import { settings } from "./settings";

class SnakeGame {

    constructor() {
        this.id = this.makeId();
        this.context = null;

        let canvasContainer = document.getElementById(this.id)
        this.canvasContainer = canvasContainer === null ? this.createElements() : canvasContainer;
        this.food = new Food();
        this.snake = new Snake();
        this.model = new Model();
    }

    getCanvas() {
        return document.getElementById(this.id)
    }

    createElements() {
        let canvasContainer = document.createElement('div');
        canvasContainer.id = `container_${this.id}`;
        canvasContainer.className = 'canvas-container';
        document.getElementById('main_content').appendChild(canvasContainer);

        let canvas = document.createElement('canvas');
        canvas.id = this.id;
        canvas.className = 'canvas-item';
        canvas.width = settings.canvasSize;
        canvas.height = settings.canvasSize;
        let canvasWrapper = document.createElement('div');
        canvasWrapper.className = 'canvas-wrapper';
        canvasWrapper.appendChild(canvas);
        canvasContainer.appendChild(canvasWrapper);
        this.context = canvas.getContext('2d');
        this.drawCanvas();

        let info = document.createElement('div');
        info.id = `info_${this.id}`;
        info.className = 'info';
        canvasContainer.appendChild(info);

        return canvasContainer;
    }

    drawCanvas() {
        this.context.fillStyle = 'rgba(0, 0, 0, 1)';
        this.context.fillRect(0, 0, settings.canvasSize, settings.canvasSize);
    }

    drawFood() {
        this.context.fillStyle = 'red';
        this.context.fillRect(this.food.x, this.food.y, settings.step, settings.step);
    }

    drawSnake() {
        this.context.fillStyle = 'white';
        this.context.fillRect(this.snake.x, this.snake.y, settings.step, settings.step);

        // Draw queue.
        this.snake.queue.forEach(queueItem => {
            this.context.fillRect(queueItem.x, queueItem.y, settings.step, settings.step);
        });
    }

    updateInfo() {
        let info = document.getElementById(`info_${this.id}`);
        info.innerHTML = `Score: ${this.snake.getScore()}<br>Crashed: ${this.snake.getCrashed()}`;
    }

    /**
     * Returns an array with the state of the current game.
     */
    getState() {
        let state = [];
        for (let y = 0; y < settings.canvasSize; y += settings.step) {
            for (let x = 0; x < settings.canvasSize; x += settings.step) {
                let currentType = settings.state.black;
                if (this.snake.x == x && this.snake.y == y) {
                    currentType = settings.state.snake;
                }
                if (this.food.x == x && this.food.y == y) {
                    currentType = settings.state.food;
                }

                for (let i = 0; i < this.snake.queue.length; i++) {
                    if (this.snake.queue[0].x == x && this.snake.queue[0].y == y) {
                        currentType = settings.state.queue;
                        break;
                    }
                }

                state.push(currentType);
            }
        }

        return state;
    }

    makeId() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        do {
            for (var i = 0; i < 15; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
        } while (document.getElementById(text) !== null)

        return text;
    }
}

export default SnakeGame;
