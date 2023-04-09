// Bacteria: green
class Bacteria extends Organism {
    constructor(position, recombinationSite, insidePhage, replicateTimer, lysisTimer, lifeSpan, radius, scale, infected) {
        super(position, 0, 255, 0, radius, scale);
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

    update(lifespan, bacReplicateRate, width, height) {
        // Decrease the lifespan and update the green color based on the remaining lifespan
        this.lifeSpan--;
        // control the color, with color changes, the rgb color for green would decrease until black
        this.green = Math.max(0, this.lifeSpan * 255 / lifespan);

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