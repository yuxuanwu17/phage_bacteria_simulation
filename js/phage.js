// phage is in yellow
class Phage extends Organism {
    constructor(position, shellGene, lysisStart, radius, scale, lysisTimer, lifeSpan) {
        super(position, 255, 255, 0, radius, scale);
        this.shellGene = shellGene;
        this.lysisStart = lysisStart;
        this.lysisTimer = lysisTimer;
        this.lifeSpan = lifeSpan;
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

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * this.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.fill();
    }

    static infectPosition(phagePos, bacPos) {
        /**
         * check if the bacteria position is in close the phage's infect position (10 by 10 box)
         */
        return (
            (bacPos.x <= phagePos.x + 10) &&
            (bacPos.x >= phagePos.x - 10) &&
            (bacPos.y <= phagePos.y + 10) &&
            (bacPos.y >= phagePos.y - 10)
        );
    }

    static canInfect(bacterium) {
        return bacterium.recombinationSite === "normal";
    }

    cycle(phageOffspring) {
        const offSpring = [];
        for (let i = 0; i < phageOffspring; i++) {
            offSpring.push(new Phage(
                new Vec2(this.position.x, this.position.y),
                this.shellGene,
                this.lysisStart,
                this.radius,
                this.scale,
                this.lysisTimer,
                this.lifeSpan,
                this.lifeSpan,
            ));
        }
        return offSpring;
    }

}
