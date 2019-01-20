import * as tf from '@tensorflow/tfjs';
import { settings } from './settings';

class Model {
    constructor() {
        let outputLayerNodes = 4;
        this.inputLayerNodes = settings.canvasSize * settings.canvasSize / settings.step / settings.step * outputLayerNodes;
        this.inputWeights = tf.randomNormal([this.inputLayerNodes, settings.hiddenLayerNodes]);
        this.outputWeights = tf.randomNormal([settings.hiddenLayerNodes, outputLayerNodes]);
    }

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

    convert(data) {
        let onehot = [];
        data.forEach(item => {
            if (item == 0) {
                onehot.push(0, 0, 0, 0);
            } else if (item == 1) {
                onehot.push(1, 0, 0, 0);
            } else if (item == 2) {
                onehot.push(0, 1, 0, 0);
            } else if (item == 3) {
                onehot.push(0, 0, 1, 0);
            } else if (item == 4) {
                onehot.push(0, 0, 0, 1);
            }
        });

        return tf.tensor2d(onehot, [1, this.inputLayerNodes]);
    }
}

export default Model;