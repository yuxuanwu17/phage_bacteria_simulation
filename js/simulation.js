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

    // lysis the infected bacteria and generate the phage
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
        // update the bacteria
        for (let iB = 0; iB < this.bacteria.length;) {
            this.bacteria[iB].lifeSpanCountDown();
            if (this.bacteria[iB].lifeSpan === 0) {
                this.bacteria.splice(iB, 1);
            } else {
                iB++;
            }
        }

        // update the phage
        for (let iP = 0; iP < this.phages.length;) {
            this.phages[iP].lifeSpanCountDown();
            if (this.phages[iP].lifeSpan === 0) {
                this.phages.splice(iP, 1);
            } else {
                iP++;
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
        // console.log("newborn, replicate bacteria",newBorn)
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
        }
    }

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

    // // give the replicate bacteria to blue (replicate)
    // b.red = 0;
    // b.green = 0;
    // b.blue = 255;

    return b;
}

function eatenByImmune(phages, bacteria, infectedBacteria, immuneCells) {
    /**
     * Only the phages and bacteria would get involved in the immune cell
     * @type {*[]}
     */
    const deadZonePositions = Simulation.deadZone(immuneCells);

    phages = phages.filter(phage => !phage.getEaten(deadZonePositions));
    bacteria = bacteria.filter(bacterium => !bacterium.getEaten(deadZonePositions));
    infectedBacteria = infectedBacteria.filter(infected => !infected.getEaten(deadZonePositions));

    return {phages, bacteria, infectedBacteria};
}

// a helper function used to interact the bacteria
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