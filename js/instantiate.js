function getRandomPosition(maxWidth, maxHeight) {
    return {
        x: Math.random() * maxWidth,
        y: Math.random() * maxHeight
    };
}

function generatePhage(lysisRate, phageOffspring, phageScale) {
    let probability1 = Math.random();
    let shellGene = probability1 < 0.98 ? "normal" : "mutated";

    let probability2 = Math.random();
    let otherGene = probability2 < 0.8 ? "normal" : "mutated";

    return new Phage(
        getRandomPosition(600, 600),
        shellGene,
        otherGene,
        lysisRate,
        phageOffspring,
        phageScale,
    );
}

function generateBacteria(bacLifespan, bacReplicateRate, bacScale) {
    let probability1 = Math.random();
    let recombinationSite = probability1 < 0.95 ? "normal" : "mutated";

    let probability2 = Math.random();
    let bacteriaType;
    if (probability2 <= 0.3) {
        bacteriaType = "A";
    } else if (probability2 <= 0.6) {
        bacteriaType = "B";
    } else if (probability2 <= 0.95) {
        bacteriaType = "C";
    } else {
        bacteriaType = "D";
    }

    return new Bacteria(
        getRandomPosition(600, 600),
        bacteriaType,
        recombinationSite,
        null,
        Math.random() * bacReplicateRate,
        0,
        bacLifespan,
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
