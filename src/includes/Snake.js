import { settings } from './settings';

class Snake {

    /**
     * Creates a new snake for current game.
     */
    constructor() {
        this.x = 0;
        this.y = 0;
        this.queue = [];
        // 1, 2, 3, 4.
        this.direction = Math.floor(Math.random() * 4) + 1;
        this.crashed = false;
        this.score = 0;
    }

    /**
     * Moves snake according to selected direction.
     */
    move() {
        if (this.crashed) {
            return;
        }
        if (this.direction == 1) {
            if (this.y <= 0) {
                this.y = settings.canvasSize - settings.step;
            }
            else {
                this.y -= settings.step;
            }
        }
        else if (this.direction == 2) {
            if (this.x >= settings.canvasSize - settings.step) {
                this.x = 0;
            }
            else {
                this.x += settings.step;
            }
        }
        else if (this.direction == 3) {
            if (this.y >= settings.canvasSize - settings.step) {
                this.y = 0;
            }
            else {
                this.y += settings.step;
            }
        }
        else if (this.direction == 4) {
            if (this.x <= 0) {
                this.x = settings.canvasSize - settings.step;
            }
            else {
                this.x -= settings.step;
            }
        }
    }

    /**
     * Get if snake has captured food.
     * 
     * @param {number} fx
     *   Food x value.
     * @param {number} fy
     *   Food y value.
     * 
     * @return {boolean}
     *   True if food hs been captured. 
     */
    getCapture(fx, fy) {
        if (this.detectCollision(
            this.x,
            this.y,
            fx,
            fy
        )) {
            return true;
        }
    }

    /**
     * Expand snake and increase score.
     */
    expand() {
        this.queue.unshift({
            x: this.x,
            y: this.y
        });
        this.score++;
    }

    /**
     * Move queue according to previous snake head location.
     */
    moveQueue() {
        if (this.crashed) {
            return;
        }
        if (this.queue.length) {
            this.queue.unshift({
                x: this.x,
                y: this.y
            });
            this.queue.pop();
        }
    }

    /**
     * Get if snake has crashed to its tail.
     * 
     * @return {boolean}
     *   True if it has crashed.
     */
    getTailCrash() {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.detectCollision(
                this.x,
                this.y,
                this.queue[i].x,
                this.queue[i].y
            )) {
                return true;
            }
        }
    }

    /**
     * Set snake as crashed.
     */
    setCrashed() {
        this.crashed = true;
        this.direction = 0;
    }

    /**
     * Get if snake is crashed.
     */
    getCrashed() {
        return this.crashed;
    }

    /**
     * Get current snake score.
     * 
     * @return {number}
     *   Score.
     */
    getScore() {
        return this.score;
    }

    /**
     * Set snake direction.
     * 
     * @param {number} direction
     *   1 for up, 2 for right etc.
     */
    setDirection(direction) {
        // Don't allow 180 direction change.
        let $dc1 = this.direction == 1 && direction == 3;
        let $dc2 = this.direction == 3 && direction == 1;
        let $dc3 = this.direction == 2 && direction == 4;
        let $dc4 = this.direction == 4 && direction == 2;
        if ($dc1 || $dc2 || $dc3 || $dc4) {
            return;
        }
        this.direction = direction;
    }

    /**
     * Detect collision of objects.
     * 
     * @param {number} x1
     *   X of first object.
     * @param {number} y1 
     *   Y of first object.
     * @param {number} x2 
     *   X of second object.
     * @param {number} y2
     *   Y of second object.
     * 
     * @return {boolean}
     *   True if there is a collision.
     */
    detectCollision(x1, y1, x2, y2) {
        return x1 == x2 && y1 == y2;
    }
}

export default Snake;
