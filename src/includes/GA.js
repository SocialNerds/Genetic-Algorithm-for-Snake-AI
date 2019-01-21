import { settings } from './settings';
import SnakeGame from './SnakeGame';
import Helper from './Helper';
import * as tf from '@tensorflow/tfjs';

class GA {

    /**
     * Created the evolutianary helper class.
     */
    constructor() {
        this.helper = new Helper();
    }

    /**
     * Get the top parents of the current generation.
     * 
     * @param {Array.SnakeGame} snakeGameArray
     *   Array of snake games.
     * 
     * @return {Array.SnakeGame}
     *   Top parents.
     */
    getTopParents(snakeGameArray) {
        // The clean values of snake games.
        let snakeGameArrayValues = [];
        snakeGameArray.forEach(currentSnakeGame => {
            snakeGameArrayValues.push({
                id: currentSnakeGame.id,
                score: currentSnakeGame.snake.getScore(),
                crashed: currentSnakeGame.snake.getCrashed()
            })
        });

        snakeGameArrayValues = this.sortGames(snakeGameArrayValues);

        // The top games.
        let topSnakeGames = []
        snakeGameArray.forEach(currentSnakeGame => {
            for (let i = 0; i < settings.topParentsGenePool; i++) {
                if (snakeGameArrayValues[i].id == currentSnakeGame.id) {
                    topSnakeGames.push(currentSnakeGame);
                }
            }
        });

        return topSnakeGames;
    }

    /**
     * Sort Snake games based on score.
     * 
     * @param {Array} snakeGameArrayValues
     *   Array of values id, score, crashed.
     * 
     * @return {Array}
     *   Sorted array.
     */
    sortGames(snakeGameArrayValues) {
        return snakeGameArrayValues.sort(function (a, b) {
            return b.score - a.score;
        })
    }

    /**
     * Gets top parents and creates a crossover of their neural networks.
     * 
     * @param {Array.SnakeGame} topSnakeGames
     *   Array of top snake games.
     * 
     * @return {SnakeGame}
     *   A new snake game.
     */
    crossover(topSnakeGames) {
        // Create a gene pool.
        let weightsArray = [];
        for (let i = 0; i < settings.topParentsGenePool; i++) {
            let parentInputWeights = topSnakeGames[i].model.inputWeights.dataSync();
            let parentOutputWeights = topSnakeGames[i].model.outputWeights.dataSync();
            for (let j = 0; j < settings.topParentsGenePool - i; j++) {
                weightsArray.push({
                    inputWeights: parentInputWeights,
                    outputWeights: parentOutputWeights
                });
            }
        }

        // Get weights from gene pool.
        let parentWeightsIndexA = Math.floor(Math.random() * weightsArray.length);
        let parentWeightsIndexB = Math.floor(Math.random() * weightsArray.length);

        let mid = Math.floor(Math.random() * weightsArray[parentWeightsIndexA].inputWeights.length);
        let childInputWeights = [...weightsArray[parentWeightsIndexA].inputWeights.slice(0, mid),
        ...weightsArray[parentWeightsIndexB].inputWeights.slice(mid, weightsArray[parentWeightsIndexB].inputWeights.length)];
        let childOutputWeights = [...weightsArray[parentWeightsIndexA].outputWeights.slice(0, mid),
        ...weightsArray[parentWeightsIndexB].outputWeights.slice(mid, weightsArray[parentWeightsIndexB].outputWeights.length)];

        let childSnakeGame = new SnakeGame();

        let inputWeightsShape = topSnakeGames[0].model.inputWeights.shape;
        let outputWeightsShape = topSnakeGames[0].model.outputWeights.shape;

        childSnakeGame.model.inputWeights = tf.tensor(childInputWeights, inputWeightsShape);
        childSnakeGame.model.outputWeights = tf.tensor(childOutputWeights, outputWeightsShape);

        return childSnakeGame;
    }

    /**
     * Mutate the weights of one snake game. The game is recreated.
     * 
     * @param {SnakeGame} snakeGame
     *   Snake game to mutate.
     * 
     * @return {SnakeGame}
     *   Mutated snake game.
     */
    mutate(snakeGame) {
        let newSnakeGame = new SnakeGame();

        let mutatedInputWeights = snakeGame.model.inputWeights.dataSync().map(this.randomGaussian);
        let inputWeightsShape = snakeGame.model.inputWeights.shape;
        newSnakeGame.model.inputWeights = tf.tensor(mutatedInputWeights, inputWeightsShape);

        let mutatedOutputWeights = snakeGame.model.outputWeights.dataSync().map(this.randomGaussian);
        let outputWeightsShape = snakeGame.model.outputWeights.shape;
        newSnakeGame.model.outputWeights = tf.tensor(mutatedOutputWeights, outputWeightsShape);

        return newSnakeGame;
    }

    /**
     * Creates a new generation of skake games.
     * 
     * @param {Array.SnakeGame} snakeGameArray
     *   Array of top snake games.
     * 
     * @return {Array.SnakeGame}
     *   New generation.
     */
    createNewGeneration(snakeGameArray) {
        let topSnakeGames = this.getTopParents(snakeGameArray);

        let newGenerationSnakeGameArray = [];
        // Create games from current top game.
        for (let i = 0; i < settings.topSnakeChildren; i++) {
            newGenerationSnakeGameArray.push(this.mutate(topSnakeGames[0]));
        }

        // Create completely new games.
        for (let i = 0; i < settings.randomSnakeChildren; i++) {
            newGenerationSnakeGameArray.push(new SnakeGame());
        }

        // Create crossovers from top games.
        for (let i = 0; i < settings.population - settings.topSnakeChildren - settings.randomSnakeChildren; i++) {
            let childSnakeGame = this.crossover(topSnakeGames);
            if (Math.random() < 0.5) {
                let oldChildSnakeGame = childSnakeGame;
                childSnakeGame = this.mutate(childSnakeGame);
                this.helper.destroyGame(oldChildSnakeGame);
            }
            newGenerationSnakeGameArray.push(childSnakeGame);
        }

        this.helper.destroyGames(snakeGameArray);
        return newGenerationSnakeGameArray;
    }

    /**
     * Mutate 5% of the weights.
     * 
     * @param {number} x
     *   Weight item.
     * 
     * @return {number}
     *   New weight.
     */
    randomGaussian(weight) {
        if (Math.random() < 0.05) {
            let offset = function () {
                let w, x1, x2;
                do {
                    x1 = Math.random() * 2 - 1;
                    x2 = Math.random() * 2 - 1;
                    w = x1 * x1 + x2 * x2;
                } while (w >= 1);
                w = Math.sqrt((-2 * Math.log(w)) / w);
                return x1 * w * 0.5;
            };
            return weight + offset();
        }
        return weight;
    }
}

export default GA;
