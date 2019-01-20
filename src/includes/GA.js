import { settings } from './settings';
import SnakeGame from './SnakeGame';
import Helper from './Helper';
import * as tf from '@tensorflow/tfjs';

class GA {

    constructor() {
        this.helper = new Helper();
    }

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
        
        // The top two games.
        let topSnakeGames = []
        snakeGameArray.forEach(currentSnakeGame => {
            if (snakeGameArrayValues[0].id == currentSnakeGame.id
                || snakeGameArrayValues[1].id == currentSnakeGame.id) {
                topSnakeGames.push(currentSnakeGame);
            }
        });
        
        return topSnakeGames;
    }

    sortGames(snakeGameArrayValues) {
        return snakeGameArrayValues.sort(function (a, b) {
            return b.score - a.score;
        })
    }

    crossover(topSnakeGames) {
        let parentInputWeightsA = topSnakeGames[0].model.inputWeights.dataSync();
        let parentOutputWeightsA = topSnakeGames[0].model.outputWeights.dataSync();
        let parentInputWeightsB = topSnakeGames[1].model.inputWeights.dataSync();
        let parentOutputWeightsB = topSnakeGames[1].model.outputWeights.dataSync();

        let mid = Math.floor(Math.random() * parentInputWeightsA.length);
        let childInputWeights = [...parentInputWeightsA.slice(0, mid), ...parentInputWeightsB.slice(mid, parentInputWeightsB.length)];
        let childOutputWeights = [...parentOutputWeightsA.slice(0, mid), ...parentOutputWeightsB.slice(mid, parentOutputWeightsB.length)];

        let childSnakeGame = new SnakeGame();

        let inputWeightsShape = topSnakeGames[0].model.inputWeights.shape;
        let outputWeightsShape = topSnakeGames[0].model.outputWeights.shape;

        childSnakeGame.model.inputWeights = tf.tensor(childInputWeights, inputWeightsShape);
        childSnakeGame.model.outputWeights = tf.tensor(childOutputWeights, outputWeightsShape);

        return childSnakeGame;
    }

    mutate(childSnakeGame) {

        let mutatedSnakeGame = new SnakeGame();

        let mutatedInputWeights = childSnakeGame.model.inputWeights.dataSync().map(fn);
        let inputWeightsShape = childSnakeGame.model.inputWeights.shape;
        mutatedSnakeGame.model.inputWeights = tf.tensor(mutatedInputWeights, inputWeightsShape);

        let mutatedOutputWeights = childSnakeGame.model.outputWeights.dataSync().map(fn);
        let outputWeightsShape = childSnakeGame.model.outputWeights.shape;
        mutatedSnakeGame.model.outputWeights = tf.tensor(mutatedOutputWeights, outputWeightsShape);

        return mutatedSnakeGame;
    }

    reproduce(childSnakeGame) {
        let newGenerationSnakeGames = [];
        for (let i = 0; i < settings.popupation - 10; i++) {
            newGenerationSnakeGames.push(this.mutate(childSnakeGame));
        }

        // Also create 10 completelly random to avoid bad genome evolution.
        for (let i = 0; i < 10; i++) {
            newGenerationSnakeGames.push(new SnakeGame());
        }

        this.helper.destroyGame(childSnakeGame);
        return newGenerationSnakeGames;
    }

    // randomGaussian(x) {
    //     if (Math.random() < 0.05) {
    //         let offset = () => {
    //             let w, x1, x2;
    //             do {
    //                 x1 = Math.random() * 2 - 1;
    //                 x2 = Math.random() * 2 - 1;
    //                 w = x1 * x1 + x2 * x2;
    //             } while (w >= 1);
    //             w = Math.sqrt((-2 * Math.log(w)) / w);
    //             return x1 * w * 0.5;
    //         };
    //         let newx = x + offset;
    //         return newx;
    //     }
    //     return x;
    // }
}

function fn(x) {
    if (Math.random() < 0.05) {
        let offset = randomGaussian() * 0.5;
        let newx = x + offset;
        return newx;
    }
    return x;
}

function randomGaussian() {
    let w, x1, x2;
    do {
        x1 = Math.random() * 2 - 1;
        x2 = Math.random() * 2 - 1;
        w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt((-2 * Math.log(w)) / w);
    return x1 * w;
}

export default GA;
