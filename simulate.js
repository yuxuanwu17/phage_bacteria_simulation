class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Organism {
    constructor(position, red, green, blue, radius, scale) {
        this.position = position;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.radius = radius;
        this.scale = scale;
    }

    // check whether the organism is inside the deadZone by immuneCell and get eaten methods
    getEaten(deadZone) {
        for (const dot of deadZone) {
            if (samePosition(this.position, dot, this.radius * this.scale, dot.radius * dot.scale)) {
                return true;
            }
        }
        return false;
    }

    move(speed, width, height) {
        this.position.x += (Math.random() * 2 - 1) * speed;
        this.position.y += (Math.random() * 2 - 1) * speed;

        this.position.x = Math.max(Math.min(this.position.x, width), 0);
        this.position.y = Math.max(Math.min(this.position.y, height), 0);
    }
}

// phage is in yellow
class Phage extends Organism {
    constructor(position, shellGene, otherGene, lysisStart, radius, scale) {
        super(position, 255, 255, 0, radius, scale);
        this.shellGene = shellGene;
        this.otherGene = otherGene;
        this.lysisStart = lysisStart;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * this.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.fill();
    }

    static infectPosition(phagePos, bacPos) {
        return (
            (bacPos.x <= phagePos.x + 10) &&
            (bacPos.x >= phagePos.x - 10) &&
            (bacPos.y <= phagePos.y + 10) &&
            (bacPos.y >= phagePos.y - 10)
        );
    }

    static canInfect(bacterium) {
        return (bacterium.bacteriaType !== "D") && bacterium.recombinationSite === "normal";
    }

    cycle(phageOffspring) {
        const offSpring = [];
        for (let i = 0; i < phageOffspring; i++) {
            offSpring.push(new Phage(
                new Vec2(this.position.x, this.position.y),
                this.shellGene,
                this.otherGene,
                this.lysisStart,
                this.radius,
                this.scale,
                this.red = 255,
                this.green = 0,
                this.blue = 0,
            ));
        }
        return offSpring;
    }

}

// Bacteria: green
class Bacteria extends Organism {
    constructor(position, bacteriaType, recombinationSite, insidePhage, replicateTimer, lysisTimer, lifeSpan, radius, scale, infected) {
        super(position, 0, 255, 0, radius, scale);
        this.bacteriaType = bacteriaType;
        this.recombinationSite = recombinationSite;
        this.insidePhage = insidePhage;
        this.replicateTimer = replicateTimer;
        this.lysisTimer = lysisTimer;
        this.lifeSpan = lifeSpan;
        this.infected = infected;
    }

    lysisCountDown() {
        this.lysisTimer--;
    }

    lifeSpanCountDown() {
        this.lifeSpan--;
    }

    replicateCountDown() {
        this.replicateTimer--;
    }

    resetReplicateTimer(bacReplicateRate) {
        this.replicateTimer = Math.floor(Math.random() * bacReplicateRate);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * this.scale, 0, Math.PI * 2);
        if (this.infected) {
            ctx.fillStyle = 'rgba(255, 165, 0, 1)'; // Set color to orange when infected
        } else {
            ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue}`;
        }
        ctx.fill();
    }

    update(bacLifespan, bacReplicateRate, width, height) {
        // Decrease the lifespan and update the green color based on the remaining lifespan
        this.lifeSpan--;
        // control the color, with color changes, the rgb color for green would decrease until black
        this.green = Math.max(0, this.lifeSpan * 255 / bacLifespan);

        // Replicate the bacteria if the replicate timer reaches 0
        if (this.replicateTimer <= 0) {
            // Reset the replicate timer based on the bacReplicateRate parameter
            this.replicateTimer = bacReplicateRate;

            // Add the logic to replicate the bacteria here
        } else {
            // Decrease the replicate timer
            this.replicateTimer--;
        }
        this.move(5, width, height);
    }
}

class ImmuneCell extends Organism {
    constructor(position, huntingRange, radius, scale) {
        super(position, 255, 255, 255, radius, scale);
        this.huntingRange = huntingRange;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * this.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.fill();
    }

    update(bacteria, infectedBacteria, phages, width, height) {
        {
            this.move(10, width, height);

            // Eat bacteria within hunting range
            for (let i = 0; i < bacteria.length; i++) {
                if (samePosition(this.position, bacteria[i].position, this.radius * this.scale, bacteria[i].radius * bacteria[i].scale)) {
                    bacteria.splice(i, 1);
                    i--;
                }
            }

            // Eat infected bacteria within hunting range
            for (let i = 0; i < infectedBacteria.length; i++) {
                if (samePosition(this.position, infectedBacteria[i].position, this.radius * this.scale, infectedBacteria[i].radius * infectedBacteria[i].scale)) {
                    infectedBacteria.splice(i, 1);
                    i--;
                }
            }

            // Eat phages within hunting range
            for (let i = 0; i < phages.length; i++) {
                if (samePosition(this.position, phages[i].position, this.radius * this.scale, phages[i].radius * phages[i].scale)) {
                    phages.splice(i, 1);
                    i--;
                }
            }
        }

    }
}


class Simulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bacteria = [];
        this.phages = [];
        this.immuneCells = [];
        this.numGens = 0;
        this.infectedBacteria = [];
        this.bacLifespan = null;   // define bacLifespan as a property of the class
        this.rounds = 0;

    }

    // calculate the hunting region of immune cells
    static deadZone(immuneCells) {
        let deadZone = [];
        for (const immuneCell of immuneCells) {
            for (let x = immuneCell.position.x - immuneCell.huntingRange; x <= immuneCell.position.x + immuneCell.huntingRange; x++) {
                for (let y = immuneCell.position.y - immuneCell.huntingRange; y <= immuneCell.position.y + immuneCell.huntingRange; y++) {
                    deadZone.push(new Vec2(x, y));
                }
            }
        }
        return deadZone;
    }

    lysis(phageOffspring) {
        const roundOffspring = [];
        for (let q = 0; q < this.infectedBacteria.length;) {
            this.infectedBacteria[q].lysisCountDown();
            if (this.infectedBacteria[q].lysisTimer === 0) {
                const eachOffspring = this.infectedBacteria[q].insidePhage.cycle(phageOffspring);
                this.infectedBacteria.splice(q, 1);
                roundOffspring.push(...eachOffspring);
            } else {
                q++;
            }
        }
        this.phages.push(...roundOffspring);
    }

    updateLifespan() {
        for (let iB = 0; iB < this.bacteria.length;) {
            this.bacteria[iB].lifeSpanCountDown();
            if (this.bacteria[iB].lifeSpan === 0) {
                this.bacteria.splice(iB, 1);
            } else {
                iB++;
            }
        }
    }

    bacReplicate(c, bacLifespan, bacReplicateRate) {
        const newBorn = [];
        for (const bacterium of this.bacteria) {
            bacterium.replicateCountDown();
            if (bacterium.replicateTimer <= 0) {
                bacterium.resetReplicateTimer(bacReplicateRate);
                newBorn.push(giveBirth(bacterium, bacLifespan, bacReplicateRate));
            }
        }
        console.log(newBorn)
        this.bacteria.push(...newBorn);
    }

    eatenByImmune() {
        const {
            phages,
            bacteria,
            infectedBacteria
        } = eatenByImmune(this.phages, this.bacteria, this.infectedBacteria, this.immuneCells);
        this.phages = phages;
        this.bacteria = bacteria;
        this.infectedBacteria = infectedBacteria;
    }


    infectBacteria(lysisRate) {
        const {
            phages,
            updatedBacteria,
            infectedBacteria
        } = infectBacteria(this.phages, this.bacteria, this.infectedBacteria, lysisRate);
        this.phages = phages;
        this.bacteria = updatedBacteria;
        this.infectedBacteria = infectedBacteria;
    }

    // Update the initialize method
    initialize({
                   bacNum,
                   bacScale,
                   phageNum,
                   phageScale,
                   immuneCellNum,
                   immuneCellScale,
                   bacLifespan,
                   bacReplicateRate,
                   lysisRate,
                   phageOffspring,
                   numGens,
               }) {
        this.bacLifespan = bacLifespan;
        this.bacReplicateRate = bacReplicateRate;
        this.lysisRate = lysisRate
        this.phageOffspring = phageOffspring
        this.numGens = numGens;


        for (let i = 0; i < bacNum; i++) {
            this.bacteria.push(generateBacteria(bacLifespan, bacReplicateRate, bacScale));
        }

        // console.log(this.bacteria)
        for (let i = 0; i < phageNum; i++) {
            this.phages.push(generatePhage(lysisRate, phageOffspring, phageScale));
        }
        console.log(this.phages)

        for (let i = 0; i < immuneCellNum; i++) {
            this.immuneCells.push(generateImmuneCell(immuneCellScale));
        }

    }

    update() {
        this.eatenByImmune();
        this.infectBacteria(this.lysisRate);
        this.lysis(this.phageOffspring);
        this.updateLifespan();
        this.bacReplicate(this.ctx, this.bacLifespan, this.bacReplicateRate);

        // Move phages and other organisms
        this.phages.forEach(phage => phage.move(15, 600, 600));
        this.bacteria.forEach(bacterium => bacterium.update(this.bacLifespan, this.bacReplicateRate, 600, 600));
        this.infectedBacteria.forEach(bacterium => bacterium.update(this.bacLifespan, this.bacReplicateRate, 600, 600));
        this.immuneCells.forEach(immuneCell => immuneCell.update(this.bacteria, this.infectedBacteria, this.phages, 600, 600));
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (const bacterium of this.bacteria) {
            bacterium.draw(this.ctx);
        }


        // Draw infected bacteria
        for (const infectedBacterium of this.infectedBacteria) {
            infectedBacterium.draw(this.ctx);
        }

        for (const phage of this.phages) {
            phage.draw(this.ctx);
        }

        for (const immuneCell of this.immuneCells) {
            immuneCell.draw(this.ctx);
        }
    }

    run() {
        if (this.rounds < this.numGens) {
            this.draw();
            this.update();
            this.rounds++;
            document.getElementById("roundsCounter").innerText = this.rounds;
            requestAnimationFrame(() => this.run());
        } else {
            console.log("Simulation completed.");
            return
        }
    }

}

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

function samePosition(p1, p2, r1, r2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= r1 + r2;
}

function giveBirth(parent, bacLifespan, bacReplicateRate) {
    // console.log("inside the give birth")
    let b = new Bacteria(new Vec2(parent.position.x, parent.position.y),
        parent.bacteriaType,
        parent.recombinationSite,
        null,
        Math.floor(Math.random() * bacReplicateRate),
        0,
        bacLifespan,
        5,
        parent.scale,
        false
    )

    let probability1 = Math.random();
    if (parent.recombinationSite === "normal") {
        b.recombinationSite = probability1 < 0.95 ? "normal" : "mutated";
    } else if (parent.recombinationSite === "mutated") {
        b.recombinationSite = probability1 < 0.5 ? "mutated" : "normal";
    }
    let probability2 = Math.random();
    if (parent.bacteriaType !== "D") {
        if (probability2 <= 0.3) {
            b.bacteriaType = "A";
        } else if (probability2 > 0.3 && probability2 <= 0.6) {
            b.bacteriaType = "B";
        } else if (probability2 > 0.6 && probability2 <= 0.95) {
            b.bacteriaType = "C";
        } else {
            b.bacteriaType = "D";
        }
    } else if (parent.bacteriaType === "D") {
        if (probability2 <= 0.2) {
            b.bacteriaType = "A";
        } else if (probability2 > 0.2 && probability2 <= 0.4) {
            b.bacteriaType = "B";
        } else if (probability2 > 0.4 && probability2 <= 0.6) {
            b.bacteriaType = "C";
        } else {
            b.bacteriaType = "D";
        }
    }

    // // give the replicate bacteria to blue (replicate)
    // b.red = 0;
    // b.green = 0;
    // b.blue = 255;

    return b;
}

function eatenByImmune(phages, bacteria, infectedBacteria, immuneCells) {
    const deadZonePositions = Simulation.deadZone(immuneCells);

    phages = phages.filter(phage => !phage.getEaten(deadZonePositions));
    bacteria = bacteria.filter(bacterium => !bacterium.getEaten(deadZonePositions));
    infectedBacteria = infectedBacteria.filter(infected => !infected.getEaten(deadZonePositions));

    return {phages, bacteria, infectedBacteria};
}

function infectBacteria(phages, bacteria, infectedBacteria, lysisRate) {
    let updatedBacteria = [];
    for (const bacterium of bacteria) {
        let found = false;
        for (let iP = 0; iP < phages.length;) {
            if (Phage.infectPosition(phages[iP].position, bacterium.position) && Phage.canInfect(bacterium)) {
                bacterium.insidePhage = phages[iP];
                bacterium.lysisTimer = Math.floor(Math.random() * lysisRate);
                bacterium.infected = true
                infectedBacteria.push(bacterium);

                phages.splice(iP, 1);
                found = true;
                break;
            } else {
                iP++;
            }
        }
        if (!found) {
            updatedBacteria.push(bacterium);
        }
    }
    // console.log("infected bacteria list:"+infectedBacteria)
    return {phages, updatedBacteria, infectedBacteria};
}

const canvas = document.getElementById('simulationCanvas');
const simulation = new Simulation(canvas);
const runSimulationButton = document.getElementById("runSimulation");

runSimulationButton.addEventListener("click", () => {
    const bacNum = parseInt(document.getElementById("bacNum").value);
    const bacScale = parseFloat(document.getElementById("bacScale").value);
    const phageNum = parseInt(document.getElementById("phageNum").value);
    const phageScale = parseFloat(document.getElementById("phageScale").value);
    const immuneCellNum = parseInt(document.getElementById("immuneCellNum").value);
    const immuneCellScale = parseFloat(document.getElementById("immuneCellScale").value);
    const bacLifespan = parseInt(document.getElementById("bacLifespan").value);
    const bacReplicateRate = parseInt(document.getElementById("bacReplicateRate").value);
    const lysisRate = parseInt(document.getElementById("lysisRate").value);
    const phageOffspring = parseInt(document.getElementById("phageOffspring").value);
    const numGens = parseInt(document.getElementById("numGens").value);

    simulation.initialize({
        bacNum: bacNum,
        bacScale: bacScale,
        phageNum: phageNum,
        phageScale: phageScale,
        immuneCellNum: immuneCellNum,
        immuneCellScale: immuneCellScale,
        bacLifespan: bacLifespan,
        bacReplicateRate: bacReplicateRate,
        lysisRate: lysisRate,
        phageOffspring: phageOffspring,
        numGens: numGens,
    });

    simulation.run();
});