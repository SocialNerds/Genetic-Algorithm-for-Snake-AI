import * as tf from '@tensorflow/tfjs';
import { settings } from './settings';

class Model {

    /**
     * Creates the neural network, which is the brain of the snake.
     */
    constructor() {
        let outputLayerNodes = 4;
        this.inputLayerNodes = 11;
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
        let direction;
        tf.tidy(() => {
            let inputLayer = this.convert(data);
            let hiddenLayer = inputLayer.matMul(this.inputWeights).sigmoid();
            let outputLayer = hiddenLayer.matMul(this.outputWeights).sigmoid();
            direction = outputLayer.dataSync();
        });

        return direction;
    }

    /**
     * Convert data to tensor.
     * 
     * @param {Array} data
     *   Current state as created by SnakeGame.getState().
     * 
     * @return {import('@tensorflow/tfjs').Tensor2D}
     *   Values as a tensor
     */
    convert(data) {
        let tensor = [];
        for (let i = 0; i < data.length; i++) {
            tensor.push(...data[i]);
        }
        return tf.tensor2d(tensor, [1, this.inputLayerNodes]);
    }
}

export default Model;