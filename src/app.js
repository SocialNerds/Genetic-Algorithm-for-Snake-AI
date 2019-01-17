import { Model } from './includes/Model';
import SnakeGame from './includes/SnakeGame';
import { settings } from './includes/settings';
import './styles/styles.scss'

// Key being pressed.
let keyState = {};

// Create games.
let snakeGameArray = [];
for (let i = 0; i < settings.popupation; i++) {
    let currentSnakeGame = new SnakeGame(`canvas_${i}`);
    snakeGameArray.push(currentSnakeGame);
}

let gameLoop;
window.onload = () => {
    window.addEventListener(
        "keydown",
        e => keyState[e.keyCode || e.which] = true
        , true
    );
    gameLoop = setInterval(game, 1000 / 16.67);
};

function game() {
    snakeGameArray.forEach(currentSnakeGame => {
        let direction = getDirection();
        if (direction != 0) {
            currentSnakeGame.snake.setDirection(direction);
        }
        currentSnakeGame.drawCanvas();
        currentSnakeGame.drawFood();
        
        if (currentSnakeGame.snake.getCapture(currentSnakeGame.food.x, currentSnakeGame.food.y)) {
            currentSnakeGame.snake.expand(currentSnakeGame.food.x, currentSnakeGame.food.y);
            currentSnakeGame.food.reset();
        }
        else {
            currentSnakeGame.snake.moveQueue();
        }
        currentSnakeGame.snake.move();
        
        if (!currentSnakeGame.snake.getCrashed() && currentSnakeGame.snake.getTailCrash()) {
            currentSnakeGame.snake.setCrashed();
        }
        currentSnakeGame.drawSnake();
    });
}

function getDirection() {
    let direction = 0;
    if (settings.ai) {

    }
    else {
        if (keyState[38]) {
            direction = 1;
        } else if (keyState[39]) {
            direction = 2;
        } else if (keyState[40]) {
            direction = 3;
        } else if (keyState[37]) {
            direction = 4;
        }
        keyState = {};
    }
    return direction;
}
