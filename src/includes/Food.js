import { settings } from './settings';
import Snake from './Snake';

class Food {

    /**
     * Creates the food.
     * 
     * @param {Snake} snake
     *   Snake in the same canvas.
     */
    constructor(snake) {
        this.snake = snake;
        this.gridNumber = settings.canvasSize / settings.step - 2;
        this.image = new Image();
        this.image.src = '../images/socialnerds.png';
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
            this.x = Math.floor(Math.random() * this.gridNumber) * settings.step + settings.step;
            this.y = Math.floor(Math.random() * this.gridNumber) * settings.step + settings.step;

            let occupied = [[this.snake.x, this.snake.y], ...this.snake.queue];
            for (let i = 0; i < occupied.length; i++) {
                if (this.x == occupied[i].x && this.y == occupied[i].y) {
                    conflict = true;
                    break;
                }
            }
        } while (conflict === true);
    }
}

export default Food;
