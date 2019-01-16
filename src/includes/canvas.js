class CanvasContainer {

    constructor(id) {
        this.id = id;
    }

    create() {
        let canvas = document.createElement('canvas');
        canvas.id = this.id;
        canvas.className = 'canvas-item';
        canvas.width = 200;
        canvas.height = 200;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, 200, 200);

        let canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        document.getElementById('main_content').appendChild(canvasContainer);
        canvasContainer.appendChild(canvas);

        return canvas;
    }
}

module.exports = CanvasContainer;
