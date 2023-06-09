function getRandomPosition(maxWidth, maxHeight) {
    return {
        x: Math.random() * maxWidth,
        y: Math.random() * maxHeight
    };
}

function generatePhage(phageOffspring, phageScale, lifespan) {
    return new Phage(
        getRandomPosition(600, 600),
        6,
        phageScale,
        lifespan,
    );
}

function generateBacteria(lifespan, bacReplicateRate, bacScale) {
    // let probability1 = Math.random();
    // let recombinationSite = probability1 < 0.95 ? "normal" : "infected";

    return new Bacteria(
        getRandomPosition(600, 600),
        "normal",
        null,
        Math.random() * bacReplicateRate,
        0,
        lifespan,
        5,
        bacScale,
        false
    );
}

function generateImmuneCell(immuneCellScale) {
    return new ImmuneCell(
        getRandomPosition(600, 600),
        8,
        immuneCellScale
    );
}
