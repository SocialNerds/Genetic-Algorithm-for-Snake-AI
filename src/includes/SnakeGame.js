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

    /**
     * Sets current game visible.
     */
    setVisible() {
        this.visible = true;
        this.canvasContainer = this.createElements();
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
        this.context.fillStyle = this.snake.getCrashed() ? '#B00020' : 'rgba(0, 0, 0, 1)';
        this.context.fillRect(0, 0, settings.canvasSize, settings.canvasSize);

        this.context.fillStyle = '#888888';
        this.context.fillRect(0, 0, settings.canvasSize, settings.step);
        this.context.fillRect(0, settings.step, settings.step, settings.canvasSize - settings.step * 2);
        this.context.fillRect(0, settings.canvasSize - settings.step, settings.canvasSize, settings.step);
        this.context.fillRect(settings.canvasSize - settings.step, settings.step, settings.step, settings.canvasSize - settings.step * 2);
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
        let queueLength = this.snake.queue.length;
        for (let i = 0; i < queueLength; i++) {
            this.context.fillStyle = `rgba(255, 255, 255, ${1 / (i / queueLength + 1)})`;
            this.context.beginPath();
            this.context.arc(this.snake.queue[i].x + settings.step / 2, this.snake.queue[i].y + settings.step / 2, settings.step / 2, 0, 2 * Math.PI);
            this.context.fill();
        }
    }

    /**
     * Updates current game info.
     */
    updateInfo() {
        if (this.isVisible()) {
            let info = document.getElementById(`info_${this.id}`);
            info.innerHTML = `Score: ${this.snake.getScore()}<br>Crashed: ${this.snake.getCrashed()}`;
        }
    }

    /**
     * Returns an array with the state of the current game.
     * 
     * @return {array}
     *   Array that contains,
     *     - direction of the snake
     *     - x, y array of snake
     *     - general food direction
     *     - Arrays of objects arround the snake
     */
    getState() {
        let state = [];

        // Get snake coordinates.
        state.push([this.snake.x / settings.canvasSize, this.snake.y / settings.canvasSize]);

        // Get snake size/score.
        state.push([this.snake.getScore() / (Math.pow(settings.canvasSize, 2) / Math.pow(settings.step, 2))]);

        // Set a generic dicection of the food in relation to the snake (head).
        state.push([
            this.snake.y > this.food.y ? 1 : 0,
            this.snake.x < this.food.x ? 1 : 0,
            this.snake.y < this.food.y ? 1 : 0,
            this.snake.x > this.food.x ? 1 : 0
        ]);

        // Helper variable to get state of snake's adjacent grid boxes.
        let currentState = null;
        // Get what is above.
        currentState = null;
        if (this.snake.y >= settings.step) {
            for (let i = this.snake.y - settings.step; i >= 0; i -= settings.step) {
                currentState = this.getStateOfGridBox(this.snake.x, i);
                if (currentState !== null) {
                    state.push([(this.snake.y - i - settings.step) / settings.canvasSize]);
                    break;
                }
            }
        }
        if (currentState === null) {
            // state.push([...settings.state.wall, (this.snake.y - settings.step) / settings.canvasSize]);
            state.push([(this.snake.y - settings.step) / settings.canvasSize]);
        }

        // Get what is right of the snake.
        currentState = null;
        if (this.snake.x < settings.canvasSize - settings.step) {
            for (let i = this.snake.x + settings.step; i < settings.canvasSize; i += settings.step) {
                currentState = this.getStateOfGridBox(i, this.snake.y);
                if (currentState !== null) {
                    // state.push([...currentState, (i - this.snake.x - settings.step) / settings.canvasSize]);
                    state.push([(i - this.snake.x - settings.step) / settings.canvasSize]);
                    break;
                }
            }
        }
        if (currentState === null) {
            // state.push([...settings.state.wall, (settings.canvasSize - this.snake.x - settings.step) / settings.canvasSize]);
            state.push([(settings.canvasSize - this.snake.x - settings.step) / settings.canvasSize]);
        }

        // Get what is below the snake.
        currentState = null;
        if (this.snake.y < settings.canvasSize - settings.step) {
            for (let i = this.snake.y + settings.step; i < settings.canvasSize; i += settings.step) {
                currentState = this.getStateOfGridBox(this.snake.x, i);
                if (currentState !== null) {
                    // state.push([...currentState, (i - this.snake.y - settings.step) / settings.canvasSize]);
                    state.push([(i - this.snake.y - settings.step) / settings.canvasSize]);
                    break;
                }
            }
        }
        if (currentState === null) {
            // state.push([...settings.state.wall, (settings.canvasSize - this.snake.y - settings.step) / settings.canvasSize]);
            state.push([(settings.canvasSize - this.snake.y - settings.step) / settings.canvasSize]);
        }

        // Get what is left of the snake.
        currentState = null;
        if (this.snake.x >= settings.step) {
            for (let i = this.snake.x - settings.step; i >= 0; i -= settings.step) {
                currentState = this.getStateOfGridBox(i, this.snake.y);
                if (currentState !== null) {
                    // state.push([...currentState, (this.snake.x - i - settings.step) / settings.canvasSize]);
                    state.push([(this.snake.x - i - settings.step) / settings.canvasSize]);
                    break;
                }
            }
        }
        if (currentState === null) {
            // state.push([...settings.state.wall, (this.snake.x - settings.step) / settings.canvasSize]);
            state.push([(this.snake.x - settings.step) / settings.canvasSize]);
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
        for (let i = 0; i < this.snake.queue.length; i++) {
            if (this.snake.queue[i].x == x && this.snake.queue[i].y == y) {
                return settings.state.queue;
            }
        }

        return null;
    }

    /**
     * Keep model and reset everything else.
     */
    reset() {
        this.snake.reset();
        this.food.reset();
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
