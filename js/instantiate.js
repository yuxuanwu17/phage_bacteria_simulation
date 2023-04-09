function getRandomPosition(maxWidth, maxHeight) {
    return {
        x: Math.random() * maxWidth,
        y: Math.random() * maxHeight
    };
}

function generatePhage(lysisStart, phageRadius, phageScale, lifespan) {
    let probability1 = Math.random();
    let shellGene = probability1 < 0.98 ? "normal" : "mutated";

    return new Phage(
        getRandomPosition(600, 600),
        shellGene,
        lysisStart,
        phageRadius,
        phageScale,
        0,
        lifespan,
    );
}

function generateBacteria(lifespan, bacReplicateRate, bacScale) {
    let probability1 = Math.random();
    let recombinationSite = probability1 < 0.95 ? "normal" : "mutated";

    return new Bacteria(
        getRandomPosition(600, 600),
        recombinationSite,
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
        50,
        8,
        immuneCellScale
    );
}
