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

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
