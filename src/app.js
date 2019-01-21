import { settings } from './includes/settings';
import Helper from './includes/Helper';
import './styles/styles.scss'
import GA from './includes/GA';
import * as tf from '@tensorflow/tfjs';

// Set WwbGL backend.
tf.setBackend('cpu', false);

// Key being pressed.
let keyState = {};

// Initialize.
let helper = new Helper();
let snakeGameArray = helper.initializeGames();
let snakeGameVisibleArray = helper.getRandomVisibleSnakeGames(snakeGameArray);

// Genetic algorith.
let ga = new GA();

let currentFrame = 0;
let generation = 1;

let previousGenetationScore = 0;

let gameLoop;
window.onload = () => {
    window.addEventListener(
        'keydown',
        e => keyState[e.keyCode || e.which] = true
        , true
    );
    startGame();
};

/**
 * A function to start or restart gameloop.
 */
function startGame() {
    gameLoop = setInterval(game, settings.interval);
}

/**
 * A function to stop gameloop.
 */
function stopGame() {
    clearInterval(gameLoop);
}

function game() {
    if (currentFrame < settings.gameFrames) {
        snakeGameArray.forEach(currentSnakeGame => {
            if (!currentSnakeGame.snake.getCrashed()) {
                // currentSnakeGame.drawCanvas();
                // currentSnakeGame.drawFood();

                if (settings.ai) {
                    let direction = currentSnakeGame.model.predict(currentSnakeGame.getState());
                    currentSnakeGame.snake.setDirection(direction);
                } else {
                    let direction = getDirection();
                    if (direction != 0) {
                        currentSnakeGame.snake.setDirection(direction);
                    }
                }

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
                // currentSnakeGame.drawSnake();
                currentSnakeGame.updateInfo();

                // if (currentSnakeGame.snake.getCrashed()) {
                //     currentSnakeGame.drawCanvas();
                //     currentSnakeGame.drawFood();
                //     currentSnakeGame.drawSnake();
                //     console.log(currentSnakeGame);
                //     console.log(currentSnakeGame.getState());
                //     console.log(currentSnakeGame.model.convert(currentSnakeGame.getState()).dataSync());
                //     stopGame();
                // }
            }
        });

        snakeGameVisibleArray.forEach(currentSnakeGame => {
            currentSnakeGame.drawCanvas();
            currentSnakeGame.drawFood();
            currentSnakeGame.drawSnake();
        });
        
        helper.updateMainInfo(generation, currentFrame, snakeGameArray, previousGenetationScore);
        currentFrame++;
    } else {
        currentFrame = 0;
        stopGame();
        // Keep total score for the next generation.
        previousGenetationScore = helper.getTotalScore(snakeGameArray);
        snakeGameArray = ga.createNewGeneration(snakeGameArray);
        snakeGameVisibleArray = helper.getRandomVisibleSnakeGames(snakeGameArray);
        startGame();
        generation++;
    }
}

function getDirection() {
    let direction = 0;
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
    return direction;
}
