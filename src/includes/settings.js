export const settings = {
    // Population of snakes. Minimum topSnakeChildren + randomSnakeChildren.
    population: 4000,
    // Number of children to evolve from the top snake.
    topSnakeChildren: 10,
    // Number of children with new random gene.
    randomSnakeChildren: 500,
    // Number of top parents for the next generation.
    topParentsGenePool: 100,
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
    hiddenLayerNodes: 8,
    // States reference.
    state: {
        food: 1,
        queue: -1
    }
};
