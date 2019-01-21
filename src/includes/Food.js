import { settings } from './settings';
import Snake from './Snake';

class Food {

    /**
     * Creates the food.
     * 
     * @param {Snake} snake
     *  Snake in the same canvas.
     */
    constructor(snake) {
        this.snake = snake;
        this.gridNumber = settings.canvasSize / settings.step;
        this.reset();
    }

    /**
     * Sets random position for the food inside the canvas. We also avoid
     * coordinates that are occupied by the snake.
     */
    reset() {
        let conflict;
        do {
            conflict = false;
            this.x = Math.floor(Math.random() * this.gridNumber) * settings.step;
            this.y = Math.floor(Math.random() * this.gridNumber) * settings.step;

            // Check that there is no confict.
            if (this.x == this.snake.x && this.y == this.snake.y) {
                conflict = true;
                continue;
            }
            for (let i = 0; i < this.snake.queue.length; i++) {
                if (this.x == this.snake.queue[i].x && this.y == this.snake.queue[i].y) {
                    conflict = true;
                    break;
                }
            }
        } while (conflict === true);
    }
}

export default Food;
