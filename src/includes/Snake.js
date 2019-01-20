import { settings } from "./settings";

class Snake {

    constructor() {
        this.x = 0;
        this.y = 0;
        this.queue = [];
        // 1, 2, 3, 4.
        this.direction = Math.floor(Math.random() * 4) + 1;
        this.crashed = false;
        this.score = 0;
    }

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
            if (this.y >= settings.canvasSize  - settings.step) {
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

    expand() {
        this.queue.unshift({
            x: this.x,
            y: this.y
        });
        this.score++;
    }

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

    setCrashed() {
        this.crashed = true;
        this.direction = 0;
    }

    getCrashed() {
        return this.crashed;
    }

    getScore() {
        return this.score;
    }

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

    detectCollision(x1, y1, x2, y2) {
        return x1 == x2 && y1 == y2;
    }
}

export default Snake;
