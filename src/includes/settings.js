export const settings = {
    // Population of snakes. Minimum topSnakeChildren + randomSnakeChildren.
    population: 2000,
    // Number of children to evolve from the top snake.
    topSnakeChildren: 20,
    // Number of children with new random gene.
    randomSnakeChildren: 50,
    // Number of top parents for the next generation.
    topParentsGenePool: 5,
    // Grid size.
    step: 20,
    // Each game canvas size. It has to be multiple of step.
    canvasSize: 400,
    // Lifecycle of each run.
    gameFrames: 200,
    // Interval of game loop.
    interval: 1,
    // Games to show.
    gamesShowing: 6,
    // NN settings.
    hiddenLayerNodes: 32,
    // States reference.
    state: {
        wall: [1, 0],
        queue: [0, 1]
    }
};
