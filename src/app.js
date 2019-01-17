import { Model } from './includes/Model';
import Food from './includes/Food';
import './styles/styles.scss'
import SnakeGame from './includes/SnakeGame';

// Create games.
let snakeGameArray = [];
for (let i = 0; i < 10; i++) {
    let currentSnakeGame = new SnakeGame(`canvas_${i}`);
    snakeGameArray.push(currentSnakeGame);
    currentSnakeGame.drawFood();
}

// let gameLoop;
// window.onload = () => {
//     gameLoop = setInterval(game, 1000 / 16.67);
// };

// function game() {

//     redrawCanvases();

//     drawFood();
// }

// function redrawCanvases() {
//     canvasArray.forEach(currentCanvas => {
//         currentCanvas.redraw();
//     });
// }

// function drawFood() {
//     canvasArray.forEach(currentCanvas => {
//         let canvasFood = new Food(currentCanvas.canvas);
//         canvasFood.draw();
//     });
// }

// console.log(canvasArray);