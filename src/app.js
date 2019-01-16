import { model } from './includes/model';
const CanvasContainer = require('./includes/canvas');
import './styles/styles.scss'

// Create canvases.
let canvasArray = [];
for (let i = 0; i < 10; i++) {
    let currentCanvas = new CanvasContainer(`canvas${i}`);
    canvasArray.push(currentCanvas.create());
}

console.log(canvasArray);