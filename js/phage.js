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