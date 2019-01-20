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

    updateMainInfo(generation, currentFrame, snakeGameArray) {
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

        info.innerHTML = `Generation: ${generation}, Frame: ${currentFrame}, Top score: ${topScore}, Crashed: ${numCrashed}`;
    }
}

export default Helper;
