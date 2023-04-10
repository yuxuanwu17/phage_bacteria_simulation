// phage is in yellow
class Phage extends Organism {
    constructor(position, radius, scale, lysisTimer, lifeSpan) {
        super(position, 255, 255, 0, radius, scale);
        this.lysisTimer = lysisTimer;
        this.lifeSpan = lifeSpan;
    }

    lifeSpanCountDown() {
        this.lifeSpan--;
        // console.log(this)
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius * this.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.fill();
    }

    update(lifespan, width, height) {
        // console.log(this)
        // Decrease the lifespan and update the green color based on the remaining lifespan
        this.lifeSpan--;
        // control the color, with color changes, the rgb color for green would decrease until black
        this.red = Math.max(0, this.lifeSpan * 255 / lifespan);
        this.green = Math.max(0, this.lifeSpan * 255 / lifespan);
        this.move(15, width, height);
    }


    static infectPosition(phagePos, bacPos) {
        /**
         * check if the bacteria position is in close the phage's infect position (10 by 10 box)
         */
        return (
            (bacPos.x <= phagePos.x + 20) &&
            (bacPos.x >= phagePos.x - 20) &&
            (bacPos.y <= phagePos.y + 20) &&
            (bacPos.y >= phagePos.y - 20)
        );
    }

    static canInfect(bacterium) {
        return bacterium.recombinationSite === "normal";
    }

    cycle(phageOffspring, lifespan) {
        const offSpring = [];
        for (let i = 0; i < phageOffspring; i++) {
            offSpring.push(new Phage(
                new Vec2(this.position.x, this.position.y),
                5,
                this.scale,
                0,
                lifespan,
            ));
        }
        return offSpring;
    }

}
