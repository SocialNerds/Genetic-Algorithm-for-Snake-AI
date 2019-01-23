import * as tf from '@tensorflow/tfjs';
import GA from './includes/GA';
import Helper from './includes/Helper';
import { settings } from './includes/settings';
import './styles/styles.scss'

// Set WebGL backend.
tf.setBackend('cpu', false);

// Initialize.
let helper = new Helper();
let snakeGameArray = helper.initializeGames();
helper.setVisibleSnakeGames(snakeGameArray);

// Genetic algorith.
let ga = new GA();

let currentFrame = 1;
let generation = 1;
let previousGenetationScore = 0;

let gameLoop;
window.onload = () => { startGame() };

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

/**
 * Gameloop function.
 */
function game() {
    if (currentFrame <= settings.gameFrames) {
        snakeGameArray.forEach(currentSnakeGame => {
            if (!currentSnakeGame.snake.getCrashed()) {
                currentSnakeGame.snake.setDirection(
                    currentSnakeGame.model.predict(currentSnakeGame.getState())
                );

                if (currentSnakeGame.snake.getCapture(currentSnakeGame.food.x, currentSnakeGame.food.y)) {
                    currentSnakeGame.snake.expand(currentSnakeGame.food.x, currentSnakeGame.food.y);
                    currentSnakeGame.food.reset();
                }
                else {
                    currentSnakeGame.snake.moveQueue();
                }
                currentSnakeGame.snake.move();

                if (currentSnakeGame.snake.getTailCrash()) {
                    currentSnakeGame.snake.setCrashed(true);
                }

                if (currentSnakeGame.isVisible()) {
                    currentSnakeGame.drawCanvas();
                    currentSnakeGame.drawFood();
                    currentSnakeGame.drawSnake();
                }

                currentSnakeGame.updateInfo();
                // if (currentSnakeGame.snake.queue.length == 8) {
                //     currentSnakeGame.drawCanvas();
                //     currentSnakeGame.drawFood();
                //     currentSnakeGame.drawSnake();
                //     let state = currentSnakeGame.getState();
                //     console.log(currentSnakeGame.id);
                //     console.log(state);
                //     console.log(currentSnakeGame.model.convert(state).dataSync());
                //     stopGame();
                // }
            }
        });

        helper.updateMainInfo(generation, currentFrame, snakeGameArray, previousGenetationScore);
        currentFrame++;
    } else {
        stopGame();
        // Keep total score for the next generation.
        previousGenetationScore = helper.getTotalScore(snakeGameArray);
        snakeGameArray = ga.createNewGeneration(snakeGameArray);
        helper.setVisibleSnakeGames(snakeGameArray);
        startGame();
        currentFrame = 1;
        generation++;
    }
}
