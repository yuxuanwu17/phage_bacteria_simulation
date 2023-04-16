class Simulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bacteria = [];
        this.phages = [];
        this.immuneCells = [];
        this.numGens = 0;
        this.infectedBacteria = [];
        this.lifespan = null;   // define lifespan as a property of the class
        this.rounds = 0;

    }

    getBacteriaCount() {
        // Return the total number of bacteria
        return this.bacteria.length;
    }

    getPhageSize() {
        // Return the phage size
        return this.phages.length;
    }

    getInfectedBacteriaCount() {
        // Return the total number of infected bacteria
        return this.infectedBacteria.length;
    }


    // lysis the infected bacteria and generate the phage
    lysis(phageOffspring) {
        const roundOffspring = [];
        for (let q = 0; q < this.infectedBacteria.length;) {
            this.infectedBacteria[q].lysisCountDown();
            if (this.infectedBacteria[q].lysisTimer <= 0) {
                const eachOffspring = this.infectedBacteria[q].insidePhage.cycle(phageOffspring, this.lifespan);
                this.infectedBacteria.splice(q, 1);
                roundOffspring.push(...eachOffspring);
            } else {
                q++;
            }
        }
        this.phages.push(...roundOffspring);
    }


    bacReplicate(c, lifespan, bacReplicateRate) {
        const newBorn = [];
        for (const bacterium of this.bacteria) {
            bacterium.replicateCountDown();
            if (bacterium.replicateTimer <= 0) {
                bacterium.resetReplicateTimer(bacReplicateRate);
                newBorn.push(giveBirth(bacterium, lifespan, bacReplicateRate));
            }
        }
        // console.log("newborn, replicate bacteria",newBorn)
        this.bacteria.push(...newBorn);
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
                   lifespan,
                   bacReplicateRate,
                   lysisRate,
                   phageOffspring,
                   numGens,
               }) {
        this.lifespan = lifespan;
        this.bacReplicateRate = bacReplicateRate;
        this.lysisRate = lysisRate
        this.phageOffspring = phageOffspring
        this.numGens = numGens;


        for (let i = 0; i < bacNum; i++) {
            this.bacteria.push(generateBacteria(lifespan, bacReplicateRate, bacScale));
        }

        // console.log(this.bacteria)
        for (let i = 0; i < phageNum; i++) {
            this.phages.push(generatePhage(phageOffspring, phageScale, lifespan));
        }

        for (let i = 0; i < immuneCellNum; i++) {
            this.immuneCells.push(generateImmuneCell(immuneCellScale));
        }

    }

    update() {
        this.infectBacteria(this.lysisRate);
        this.lysis(this.phageOffspring);
        this.bacReplicate(this.ctx, this.lifespan, this.bacReplicateRate);

        // Move phages and other organisms
        this.phages.forEach(phage => phage.update(this.lifespan, 600, 600));
        this.phages = this.phages.filter(phage => phage.lifeSpan > 0);
        console.log(this.phages)
        this.bacteria.forEach(bacterium => bacterium.update(this.lifespan, this.bacReplicateRate, 600, 600));
        // this.bacteria.forEach(bacterium => console.log(bacterium));

        this.bacteria = this.bacteria.filter(bacterium => bacterium.lifeSpan > 0)
        // this.bacteria.forEach(bacterium => console.log(bacterium));
        // console.log(this.bacteria)

        this.infectedBacteria.forEach(bacterium => bacterium.update(this.lifespan, this.bacReplicateRate, 600, 600));
        this.infectedBacteria = this.infectedBacteria.filter(bacterium => bacterium.lifeSpan > 0)
        // this.bacteria.forEach(bacterium => console.log(bacterium));
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


}

function samePosition(p1, p2, r1, r2) {
    /*
    r1/2 = radius * scale
     */
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= r1 + r2;
}

function giveBirth(parent, lifespan, bacReplicateRate) {
    // console.log("inside the give birth")
    // let b =

    // // // give the replicate bacteria to blue (replicate)
    // b.red = 0;
    // b.green = 0;
    // b.blue = 255;

    // except the replication rate and life span, all the other is the same
    return new Bacteria(new Vec2(parent.position.x, parent.position.y),
        parent.recombinationSite,
        parent.insidePhage,
        Math.floor(Math.random() * bacReplicateRate),
        parent.lysisTimer,
        lifespan,
        5,
        parent.scale,
        parent.infected
    );
}


// a helper function used to interact the bacteria
function infectBacteria(phages, bacteria, infectedBacteria, lysisRate) {
    let updatedBacteria = [];
    for (const bacterium of bacteria) {
        let found = false;
        for (let iP = 0; iP < phages.length;) {
            if (infectPosition(phages[iP], bacterium) && canInfect(bacterium)) {
                bacterium.insidePhage = phages[iP];
                bacterium.lysisTimer = Math.floor(Math.random() * lysisRate);
                bacterium.infected = true
                bacterium.recombinationSite = "infected"
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

function infectPosition(phage, bacterium) {
    // Calculate the effective radii by multiplying the radius by the scale
    const phageEffectiveRadius = phage.radius * phage.scale;
    // console.log(phageEffectiveRadius)
    const bacteriumEffectiveRadius = bacterium.radius * bacterium.scale;
    // console.log(bacteriumEffectiveRadius)
    // Calculate the distance between the phage and bacterium centers
    const dx = phage.position.x - bacterium.position.x;
    const dy = phage.position.y - bacterium.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);


    // console.log(dx, dy, distance)
    // Check if the distance is less than or equal to the sum of their effective radii
    return distance <= phageEffectiveRadius + bacteriumEffectiveRadius;

}


function canInfect(bacterium) {
    // console.log()
    return bacterium.recombinationSite === "normal";
}
