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
