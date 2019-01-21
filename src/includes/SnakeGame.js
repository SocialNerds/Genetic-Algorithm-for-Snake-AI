import Food from './Food';
import Snake from './Snake';
import Model from './Model';
import { settings } from './settings';

class SnakeGame {

    /**
     * Creates a snake game with dom elements, canvas and snake.
     */
    constructor() {
        this.id = this.makeId();
        this.context = null;
        this.visible = false;

        let canvasContainer = document.getElementById(this.id)
        this.canvasContainer = canvasContainer === null ? this.createElements() : canvasContainer;
        this.snake = new Snake();
        this.food = new Food(this.snake);
        this.model = new Model();
    }

    /**
     * Get current canvas.
     * 
     * @return {HTMLCanvasElement}
     *   Canvas object.
     */
    getCanvas() {
        return document.getElementById(this.id)
    }

    /**
     * Creates snake game dom elements.
     * 
     * @return {HTMLDivElement}
     *   Canvas container.
     */
    createElements() {
        let canvasContainer = document.createElement('div');
        canvasContainer.id = `container_${this.id}`;
        canvasContainer.className = 'canvas-container hidden';
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

    /**
     * Sets current game visible.
     */
    setVisible() {
        this.visible = true;
        this.canvasContainer.classList.remove('hidden');
    }

    /**
     * Get if this snake game is visible.
     * 
     * @return {boolean}
     *   True if visible.
     */
    isVisible() {
        return this.visible;
    }

    /**
     * Draws current game canvas.
     */
    drawCanvas() {
        this.context.fillStyle = 'rgba(0, 0, 0, 1)';
        this.context.fillRect(0, 0, settings.canvasSize, settings.canvasSize);
    }

    /**
     * Draws current game food.
     */
    drawFood() {
        this.context.drawImage(this.food.image, this.food.x, this.food.y, settings.step, settings.step);
    }

    /**
     * Draws current game snake.
     */
    drawSnake() {
        this.context.fillStyle = 'blue';
        this.context.beginPath();
        this.context.arc(this.snake.x + settings.step / 2, this.snake.y + settings.step / 2, settings.step / 2, 0, 2 * Math.PI);
        this.context.fill();

        // Draw queue.
        this.snake.queue.forEach(queueItem => {
            this.context.fillStyle = 'white';
            this.context.beginPath();
            this.context.arc(queueItem.x + settings.step / 2, queueItem.y + settings.step / 2, settings.step / 2, 0, 2 * Math.PI);
            this.context.fill();
        });
    }

    /**
     * Updates current game info.
     */
    updateInfo() {
        let info = document.getElementById(`info_${this.id}`);
        info.innerHTML = `Score: ${this.snake.getScore()}<br>Crashed: ${this.snake.getCrashed()}`;
    }

    /**
     * Returns an array with the state of the current game.
     * 
     * @return {array}
     *   Array that contains,
     *     - x, y array of snake
     *     - general food direction
     *     - Arrays of objects arround the snake
     */
    getState() {
        let state = [];

        // Helper variable to get state of snake's adjacent grid boxes.
        let currentState = null;

        // Get snake coordinates.
        state.push([this.snake.x, this.snake.y]);

        // Set a generic dicection of the food in relation to the snake (head).
        state.push([
            this.snake.x > this.food.x ? -1 : 1,
            this.snake.y > this.food.y ? -1 : 1
        ]);

        // Get what is above.
        currentState = null;
        if (this.snake.y >= settings.step) {
            for (let i = this.snake.y - settings.step; i >= 0; i -= settings.step) {
                currentState = this.getStateOfGridBox(this.snake.x, i);
                if (currentState !== null) {
                    state.push([currentState, this.snake.y - i - settings.step]);
                    break;
                }
            }
        }
        if (this.snake.y == 0) {
            currentState = this.getStateOfGridBox(this.snake.x, settings.canvasSize - settings.step);
            if (currentState !== null) {
                state.push([currentState, 0]);
            }
        }
        if (currentState === null) {
            state.push([0, 0]);
        }

        // Get what is right of the snake.
        currentState = null;
        if (this.snake.x < settings.canvasSize - settings.step) {
            for (let i = this.snake.x + settings.step; i < settings.canvasSize; i += settings.step) {
                currentState = this.getStateOfGridBox(i, this.snake.y);
                if (currentState !== null) {
                    state.push([currentState, i - this.snake.x - settings.step]);
                    break;
                }
            }
        }
        if (this.snake.x == settings.canvasSize - settings.step) {
            currentState = this.getStateOfGridBox(0, this.snake.y);
            if (currentState !== null) {
                state.push([currentState, 0]);
            }
        }
        if (currentState === null) {
            state.push([0, 0]);
        }

        // Get what is below the snake.
        currentState = null;
        if (this.snake.y < settings.canvasSize - settings.step) {
            for (let i = this.snake.y + settings.step; i < settings.canvasSize; i += settings.step) {
                currentState = this.getStateOfGridBox(this.snake.x, i);
                if (currentState !== null) {
                    state.push([currentState, i - this.snake.y - settings.step]);
                    break;
                }
            }
        }
        if (this.snake.y == settings.canvasSize - settings.step) {
            currentState = this.getStateOfGridBox(this.snake.x, 0);
            if (currentState !== null) {
                state.push([currentState, 0]);
            }
        }
        if (currentState === null) {
            state.push([0, 0]);
        }

        // Get what is left of the snake.
        currentState = null;
        if (this.snake.x >= settings.step) {
            for (let i = this.snake.x - settings.step; i >= 0; i -= settings.step) {
                currentState = this.getStateOfGridBox(i, this.snake.y);
                if (currentState !== null) {
                    state.push([currentState, this.snake.x - i - settings.step]);
                    break;
                }
            }
        }
        if (this.snake.x == 0) {
            currentState = this.getStateOfGridBox(settings.canvasSize - settings.step, this.snake.y);
            if (currentState !== null) {
                state.push([currentState, 0]);
            }
        }
        if (currentState === null) {
            state.push([0, 0]);
        }

        return state;
    }

    /**
     * Get if there is something on given coordinates.
     * 
     * @param {number} x
     * @param {number} y 
     * 
     * @return {number}
     *   Type of object.
     */
    getStateOfGridBox(x, y) {
        if (this.snake.x == x && this.snake.y == y) {
            return settings.state.snake;
        }

        if (this.food.x == x && this.food.y == y) {
            return settings.state.food;
        }

        for (let i = 0; i < this.snake.queue.length; i++) {
            if (this.snake.queue[i].x == x && this.snake.queue[i].y == y) {
                return settings.state.queue;
            }
        }

        return null;
    }

    /**
     * Creates a random id for this game.
     * 
     * @return {string}
     *   Random string id.
     */
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
