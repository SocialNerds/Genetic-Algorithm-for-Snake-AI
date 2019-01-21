export const settings = {
    // Population of snakes. Minimum topSnakeChildren + randomSnakeChildren.
    popupation: 1000,
    // Number of children to evolve from the top snake.
    topSnakeChildren: 50,
    // Number of children with new random gene.
    randomSnakeChildren: 10,
    // Number of top parents for the next generation.
    topParentsGenePool: 10,
    // Grid size.
    step: 20,
    // Each game canvas size. It has to be multiple of step.
    canvasSize: 300,
    // Lifecycle of each run.
    gameFrames: 400,
    // Interval of game loop.
    interval: 1,
    // Games to show.
    gamesShowing: 8,
    // NN settings.
    inputWeightsNum: 16,
    hiddenLayerNodes: 16,
    outputWeightsNum: 16,
    // States reference.
    state: {
        snake: 1,
        food: 2,
        queue: 3
    },
    // If we want to have AI to control the snakes.
    ai: true,
};
