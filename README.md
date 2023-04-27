# Requirements

For the presentations, I would keep it simple: tell your colleagues what the question is, why you found it interesting, why you picked to work on this, what papers you used, did you recreate their results?, did you do something extra? What was harder than anticipated, where did you struggle, what did you not expect? Tell us what you learned in the process and leave your colleagues with one (just one! :) ) piece of information to remember, the thing you found the coolest!


# Research 

https://www.sciencedirect.com/science/article/pii/S0022519317303235?via%3Dihub

![image-20230404100357952](../../../typora-user-images/image-20230404100357952.png)

- phage should be decayed
- bacteria should add some significant pattern




# Background information & Simulation logic 

The provided code is a simulation of a biological environment where different organisms interact with each other. The main organisms in this code are:

1. Bacteria (Green)
2. Phages (Yellow)
3. Immune cells (White)

The simulation is run inside the main.js, which takes several parameters and returns a series of frames that depict the state of the environment at different time steps. The primary components of the simulation are:

1. Bacteria replication and normal decay
2. Phage infection of bacteria and normal decay
3. Bacterial lysis and generate new phages
4. Immune cell hunting of bacteria
5. Organisms moving around the environment
6. Stop until the target rounds are achieved

Each frame of the simulation is computed by the Update function, which takes care of updating the state of the environment for a single time step. The following interactions are considered in the Update function:

1. Immune cells eating bacteria: EatenbyImmu function
2. Phages infecting bacteria: InfectBac function
3. Lysis of infected bacteria by phages: Lysis function
4. Replication of bacteria: BacReplicate function
5. Movement of organisms: Organism move function

In addition to these, there are several helper functions that handle various aspects of the simulation, such as checking if two organisms occupy the same position, updating the timers of bacteria, determining if a phage can infect a bacterium, and creating offspring for bacteria and phages.

Overall, this code simulates the interactions between bacteria, phages, and immune cells in a biological environment, capturing key processes such as infection, replication, and movement.



The simulation code you provided is a basic representation of a biological system involving bacteria, phages (viruses that infect bacteria), and immune cells. The simulation takes place on a grid, with each cell of the grid potentially containing a bacterium, a phage, or an immune cell. The main logic of the simulation is carried out in a loop, where at each iteration (or timestep), the simulation updates the grid based on the interactions between the different entities. Here's a general overview of how the simulation works:

1. Initialization: The grid is initialized with a specified number of bacteria, phages, and immune cells placed randomly on the grid. Each entity has a specific state - bacteria have health and reproduction time, phages have an infection timer, and immune cells have a health level.
2. Updating the grid: At each timestep, the simulation goes through each cell in the grid and updates its state based on its contents and the surrounding cells. The logic for each entity is as follows:

a. Bacteria: - If a bacterium's lifespan is greater than 0, it can reproduce. Its reproduction time decreases by 1 at each timestep. - When the reproduction time reaches 0, the bacterium tries to reproduce by placing a new bacterium in one of the neighboring cells (if available). - If a bacterium's health is 0 or less, it dies and is removed from the grid.

b. Phages: - If a phage contacts bacterium, it infects the bacterium by setting its infection timer. - The phage's infection timer decreases by 1 at each timestep. When the timer reaches 0, the infected bacterium dies, and the phage replicates, placing new phages in neighboring cells (if available). - Phages also have a specific health or lifespan, so they decay with the rounds move on

c. Immune cells: - Immune cells move randomly in the grid, and their health persist during the whole simulation. 

1. Iterating: The simulation continues for a specified number of timesteps or until a termination condition is met (e.g., no bacteria remaining).

The interactions between bacteria, phages, and immune cells model a simplified version of a real-world biological system. It demonstrates how these entities coexist and compete with each other in a dynamic environment. This type of simulation can be useful for understanding the behavior and interactions of biological systems under various conditions, or for testing hypotheses in fields like ecology, epidemiology, and immunology.



# Code section explanation

## Organism

```js
class Organism {
    constructor(position, red, green, blue, radius, scale) {
        this.position = position;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.radius = radius;
        this.scale = scale;
    }

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
```

This code defines a class called `Organism`, which represents a generic organism in a 2D environment. Each organism has a position, color, radius, and scale. The class has two methods: `getEaten` and `move`. Let's break down each part of the class and its methods.

1. Constructor: The constructor initializes an instance of the `Organism` class. It takes the following parameters:

   - `position`: An object with `x` and `y` properties representing the organism's position in the 2D environment.
   - `red`, `green`, `blue`: The color components of the organism, representing the red, green, and blue channels, respectively. They should be integers ranging from 0 to 255.
   - `radius`: The base radius of the organism.
   - `scale`: A scaling factor for the organism's size, which is multiplied by the radius to determine the actual size of the organism.

2. getEaten(deadZone): This method checks if the organism is in the same position as any of the organisms in the `deadZone` array. If it is, the organism is considered to be eaten, and the method returns `true`. Otherwise, it returns `false`. It takes the following parameter:

   - `deadZone`: An array of other `Organism` instances that the organism could potentially be eaten by.

   It uses the helper function `samePosition` to determine if the positions of the organisms are the same within the bounds of their radii multiplied by their respective scaling factors.

3. move(speed, width, height): This method updates the organism's position by randomly moving it within the 2D environment. The movement is constrained by the width and height of the environment, ensuring that the organism stays within bounds. It takes the following parameters:

   - `speed`: A scalar value that determines how fast the organism can move in each step.
   - `width`: The width of the 2D environment.
   - `height`: The height of the 2D environment.

   The `move` method updates the organism's position by adding a random value between `-speed` and `speed` to both the `x` and `y` coordinates. Then, it clamps the position to ensure it stays within the bounds of the environment.

This class can be used as a base class for modeling different types of organisms in a 2D environment. Each organism can move around and interact with other organisms (e.g., being eaten by others in the deadZone). You can extend this class or create instances of it to simulate a variety of ecological or biological systems.



## Phage organism

```js
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
            (bacPos.x <= phagePos.x + 2) &&
            (bacPos.x >= phagePos.x - 2) &&
            (bacPos.y <= phagePos.y + 2) &&
            (bacPos.y >= phagePos.y - 2)
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
                this.scale
            ));
        }
        return offSpring;
    }

}
```

This code defines a class called `Phage`, which represents a type of virus that infects bacteria in a 2D environment. This class extends the `Organism` class, meaning it inherits its properties and methods. In addition to the properties and methods from the `Organism` class, the `Phage` class has a few extra properties and methods:

1. Constructor: The constructor initializes an instance of the `Phage` class. It takes the following parameters:

   - `position`: An object with `x` and `y` properties representing the phage's position in the 2D environment.
   - `shellGene`: Represents the phage's shell gene, which might be relevant for simulation purposes (e.g., to determine the phage's resistance or infectivity).
   - `otherGene`: Represents the phage's other gene, which might be relevant for simulation purposes (e.g., to determine the phage's resistance or infectivity).
   - `lysisStart`: Represents the start of the phage's lysis cycle.
   - `radius`: The base radius of the phage.
   - `scale`: A scaling factor for the phage's size, which is multiplied by the radius to determine the actual size of the phage.

   The constructor calls the `super()` method to initialize the `Organism` base class with a yellow color (255, 255, 0).

2. draw(ctx): This method draws the phage in the provided 2D rendering context. It takes the following parameter:

   - `ctx`: The 2D rendering context to draw the phage in.

   The method draws a circle at the phage's position with the specified radius, scale, and color.

3. Static methods:

   - `infectPosition(phagePos, bacPos)`: A helper function that checks if a phage can infect a bacterium based on their positions. It takes two position objects (`phagePos` and `bacPos`) and returns `true` if the bacterium is within a certain range of the phage, and `false` otherwise. The range is defined as a 4x4 square around the phage's position.
   - `canInfect(bacterium)`: Determines if a phage can infect a given bacterium based on the bacterium's properties. It takes a `bacterium` object and returns `true` if the bacterium's type is not "D" and its recombination site is "normal", and `false` otherwise.

4. cycle(phageOffspring): This method simulates the phage's replication cycle, generating a specified number of offspring. It takes the following parameter:

   - `phageOffspring`: The number of offspring to generate.

   The method creates an array of new `Phage` instances with the same properties as the current phage and returns the array.

In summary, the `Phage` class represents a virus that infects bacteria in a 2D environment. It extends the `Organism` class to inherit its properties and methods while adding additional properties and methods specific to phages, such as the ability to infect bacteria and replicate.


Lytic cycle: In this cycle, the phage infects the bacterium, takes control of the bacterial machinery, and starts producing copies of itself. Eventually, the bacterial cell bursts (lyses), releasing the newly formed phage particles that can go on to infect other bacteria. In this case, the infected bacterium replicates the phage but does not replicate itself.

Lysogenic cycle: In this cycle, the phage integrates its genetic material into the bacterial genome, forming a prophage. The prophage remains dormant, and the bacterial cell can continue to replicate and divide as normal, passing the prophage to its daughter cells. At some point, the prophage can be induced to exit the bacterial genome and initiate the lytic cycle, leading to the production of new phage particles and bacterial cell lysis. In this case, both the infected bacterium and the phage can replicate, but the phage replication is delayed.


```js
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

        // Add this condition to update the color of infected bacteria
        if (this.insidePhage) {
            ctx.fillStyle = 'rgba(255, 165, 0, 1)'; // Set color to orange when infected
        } else {
            ctx.fillStyle = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.opacity})`;
        }
        ctx.fill();


    }

    update(lifespan, bacReplicateRate, width, height) {
        // Decrease the lifespan and update the green color based on the remaining lifespan
        this.lifeSpan--;
        // control the color
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
```

it is better to know what is the lysis timer









## infectBacteria

```js
function infectBacteria(phages, bacteria, infectedBacteria, lysisRate) {
    let updatedBacteria = [];
    for (const bacterium of bacteria) {
        let found = false;
        for (let iP = 0; iP < phages.length;) {
            if (Phage.infectPosition(phages[iP].position, bacterium.position) && Phage.canInfect(bacterium)) {
                bacterium.insidePhage = phages[iP];
                bacterium.lysisTimer = Math.floor(Math.random() * lysisRate);
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
    return {phages, updatedBacteria, infectedBacteria};
}
```

This `infectBacteria()` function takes four arguments: `phages`, `bacteria`, `infectedBacteria`, and `lysisRate`. The goal of this function is to simulate the infection process of bacteria by phages and update the lists of phages, bacteria, and infected bacteria accordingly.

1. `updatedBacteria` is initialized as an empty list. This will store the bacteria that have not been infected by phages during this infection round.
2. The function iterates through each bacterium in the `bacteria` list using a `for...of` loop.
3. For each bacterium, the function initializes a `found` variable to `false`. This variable will be used to track if a phage has infected the current bacterium.
4. A nested loop iterates through the `phages` list with an index `iP`. This loop checks if a phage can infect the current bacterium.
5. If the phage infects the bacterium (i.e., they are in the same position and the phage can infect the bacterium), the following steps are executed: a. The bacterium's `insidePhage` property is set to the infecting phage. b. The bacterium's `lysisTimer` is set to a random integer in the range `[0, lysisRate)`. c. The bacterium is added to the `infectedBacteria` list. d. The infecting phage is removed from the `phages` list using the `splice()` method. e. The `found` variable is set to `true`, and the inner loop breaks.
6. If the `found` variable remains `false`, it means the bacterium was not infected by any phages in the current round, so the bacterium is added to the `updatedBacteria` list.
7. After all bacteria have been checked for infection, the function returns an object containing the updated `phages`, `updatedBacteria`, and `infectedBacteria` lists.

This function essentially simulates the infection process of phages on bacteria and updates the state of the simulation according to the infection events that occurred.


# Problems to be solved

- [ ] why the infection not work
- [ ] infect case should be orange 
- [ ] try to understand the inner mechanisms behind this simulation


# Readme

- radius for bacteria: 5, scale 1
- radius for phage: 4: 0.7
- replicate bacterial: blue
- infected bacterial: orange