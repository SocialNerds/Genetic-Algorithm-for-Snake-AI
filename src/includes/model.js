import * as tf from '@tensorflow/tfjs';
import { settings } from './settings';

class Model {

    /**
     * Creates the neural network, which is the brain of the snake.
     */
    constructor() {
        let outputLayerNodes = 4;
        this.inputLayerNodes = 16;
        this.inputWeights = tf.randomNormal([this.inputLayerNodes, settings.hiddenLayerNodes]);
        this.outputWeights = tf.randomNormal([settings.hiddenLayerNodes, outputLayerNodes]);
    }

    /**
     * Predict the next move using current's neural network weights.
     * 
     * @param {Array} data
     *   Current state as created by SnakeGame.getState().
     * 
     * @return {number}
     *   Next direction of the snake. 1 for up, 2 for right etc.
     */
    predict(data) {
        let output;
        tf.tidy(() => {
            let inputLayer = this.convert(data);
            let hiddenLayer = inputLayer.matMul(this.inputWeights).sigmoid();
            let outputLayer = hiddenLayer.matMul(this.outputWeights).sigmoid();
            output = tf.argMax(outputLayer, 1).dataSync()[0] + 1;
        });

        return output;
    }

    /**
     * Convert data to onehot array.
     * 
     * @param {Array} data
     *   Current state as created by SnakeGame.getState().
     * 
     * @return {import('@tensorflow/tfjs').Tensor2D}
     *   Onehot array as tensor.
     */
    convert(data) {
        let onehot = [];
        let snake = data.shift();
        onehot.push(snake[0] / settings.canvasSize, snake[1] / settings.canvasSize);
        let foodDirection = data.shift();
        onehot.push(foodDirection[0], foodDirection[1]);
        for (let i = 0; i < data.length; i++) {
            if (data[i][0] == settings.state.food) {
                onehot.push(0, 1, data[i][1] / settings.canvasSize);
            } else if (data[i][0] == settings.state.queue) {
                onehot.push(1, 0, data[i][1] / settings.canvasSize);
            } else {
                onehot.push(0, 0, 0);
            }
        }
        return tf.tensor2d(onehot, [1, this.inputLayerNodes]);
    }
}

export default Model;