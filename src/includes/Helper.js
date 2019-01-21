import SnakeGame from './SnakeGame';
import { settings } from './settings';

class Helper {

    initializeGames() {
        let snakeGameArray = [];
        for (let i = 0; i < settings.popupation; i++) {
            let currentSnakeGame = new SnakeGame();
            snakeGameArray.push(currentSnakeGame);
        }

        return snakeGameArray;
    }

    destroyCurrentGames(snakeGameArray) {
        snakeGameArray.forEach(currentSnakeGame => {
            this.destroyGame(currentSnakeGame);
        });
    }

    destroyGame(SnakeGame) {
        let container = document.getElementById(`container_${SnakeGame.id}`);
        container.parentNode.removeChild(container);
    }

    updateMainInfo(generation, currentFrame, snakeGameArray, previousGenetationScore) {
        let info = document.getElementById('main_info');

        let topScore = 0;
        let numCrashed = 0;
        snakeGameArray.forEach(currentSnakeGame => {
            let currentScore = currentSnakeGame.snake.getScore();
            if (currentScore > topScore) {
                topScore = currentScore;
            }
            if (currentSnakeGame.snake.getCrashed() === true) {
                numCrashed++;
            }
        });

        info.innerHTML = `
            Generation: ${generation},
            Frame: ${currentFrame},
            Top score: ${topScore},
            Total score: ${this.getTotalScore(snakeGameArray)},
            Previous generation score: ${previousGenetationScore},
            Crashed: ${numCrashed}`;
    }

    /**
     * Get total score of all snake games combined.
     * 
     * @param {Array} snakeGameArray
     *  Array of SnakeGame
     * 
     * @return {number}
     *  Total score.
     */
    getTotalScore(snakeGameArray) {
        let totalScore = 0;
        snakeGameArray.forEach(currentSnakeGame => {
            totalScore += currentSnakeGame.snake.getScore();
        });

        return totalScore;
    }

    /**
     * Get random snake games for display.
     * 
     * @param {Array} snakeGameArray
     *  Array of SnakeGame
     * 
     * @return {Array}
     *  Array of random selected snake games.
     */
    getRandomVisibleSnakeGames(snakeGameArray) {
        let randomSnakeGameArray = [];
        do {
            let index = Math.floor(Math.random() * snakeGameArray.length);
            let gameExists = randomSnakeGameArray.filter(function (item) {
                return item.id == snakeGameArray[index].id;
            });
            if (gameExists.length == 0) {
                snakeGameArray[index].setVisible();
                randomSnakeGameArray.push(snakeGameArray[index]);
            }
        } while (randomSnakeGameArray.length < settings.gamesShowing);

        return randomSnakeGameArray;
    }
}

export default Helper;
