import SnakeGame from './SnakeGame';
import { settings } from './settings';

class Helper {

    /**
     * Initialize games.
     * 
     * @return {Array.SnakeGame}
     *   New snake games.
     */
    initializeGames() {
        let snakeGameArray = [];
        for (let i = 0; i < settings.population; i++) {
            let currentSnakeGame = new SnakeGame();
            snakeGameArray.push(currentSnakeGame);
        }

        return snakeGameArray;
    }

    /**
     * Destroy multiple games.
     * 
     * @param {Array.SnakeGame} snakeGameArray
     *   Snake games.
     */
    destroyGames(snakeGameArray) {
        snakeGameArray.forEach(currentSnakeGame => {
            this.destroyGame(currentSnakeGame);
        });
    }

    /**
     * Destroy a snake game.
     * 
     * @param {SnakeGame} snakeGame 
     *   Snake game.
     */
    destroyGame(snakeGame) {
        let container = document.getElementById(`container_${snakeGame.id}`);
        container.parentNode.removeChild(container);
    }

    /**
     * Updates and displays status information.
     * 
     * @param {number} generation
     *   Current generation.
     * @param {number} currentFrame
     *   Current frame. 
     * @param {Array.SnakeGame} snakeGameArray 
     *   Array of snake games.
     * @param {number} previousGenetationScore
     *   Previous generation score.
     */
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
            <span class="label">Generation:</span> <span class="value">${generation}</span>,
            <span class="label">Frame:</span> <span class="value">${currentFrame}</span>,
            <span class="label">Top score:</span> <span class="value">${topScore}</span>,
            <span class="label">Total score:</span> <span class="value">${this.getTotalScore(snakeGameArray)}</span>,
            <span class="label">Previous generation score:</span> <span class="value">${previousGenetationScore}</span>,
            <span class="label">Crashed:</span> <span class="value">${numCrashed}</span>, 
            <span class="label">Showing</span> <span class="value">${settings.gamesShowing}</span> <span class="label">of</span> <span class="value">${settings.population}</span>`;
    }

    /**
     * Get total score of all snake games combined.
     * 
     * @param {Array.SnakeGame} snakeGameArray
     *   Array of SnakeGame
     * 
     * @return {number}
     *   Total score.
     */
    getTotalScore(snakeGameArray) {
        let totalScore = 0;
        snakeGameArray.forEach(currentSnakeGame => {
            totalScore += currentSnakeGame.snake.getScore();
        });

        return totalScore;
    }

    /**
     * Set random snake games for display.
     * 
     * @param {Array.SnakeGame} snakeGameArray
     *   Array of SnakeGame
     * 
     * @return {Array.SnakeGame}
     *   Array of random selected snake games.
     */
    setRandomVisibleSnakeGames(snakeGameArray) {
        let randomGamesNumber = 0;
        do {
            let index = Math.floor(Math.random() * snakeGameArray.length);
            if (snakeGameArray[index].visible === false) {
                snakeGameArray[index].setVisible();
                randomGamesNumber++;
            } 
        } while (randomGamesNumber < settings.gamesShowing);
    }
}

export default Helper;
