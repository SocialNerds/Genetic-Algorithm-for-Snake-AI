import * as tf from '@tensorflow/tfjs';
import { settings } from "./settings";

class Model {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.model = new tf.Sequential();

        this.inputNum = settings.canvasWidth * settings.canvasHeight / settings.step / settings.step * 4;
        
        this.model.add(tf.layers.dense({units: 256, inputShape: [this.inputNum]}));
        this.model.add(tf.layers.dense({units: 256, inputShape: [256]}));
        this.model.add(tf.layers.dense({units: 4, inputShape: [256]}));
    }

    predict(data) {
        let prediction = this.model.predict(this.convert(data));
        return tf.argMax(prediction, 1).dataSync()[0] + 1;
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

        return tf.tensor2d(onehot, [1, this.inputNum]);
    }
}


export default Model;