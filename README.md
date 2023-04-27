
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

1. Initialization: The grid is initialized with a specified number of bacteria, phages, and immune cells placed randomly on the grid. Each entity has a specific state - bacteria have lifespan and reproduction time, phages have lifespan and immune cells would persist permanently during the simulation.
2. Updating the grid: At each timestep, the simulation goes through each cell in the grid and updates its state based on its contents and the surrounding cells. The logic for each entity is as follows:
   -  Bacteria: - If a bacterium's lifespan is greater than 0, it can reproduce. Its reproduction time decreases by 1 at each timestep. - When the reproduction time reaches 0, the bacterium tries to reproduce by placing a new bacterium in one of the neighboring cells (if available). - If a bacterium's health is 0 or less, it dies and is removed from the grid.
   -  Phages: - If a phage contacts a bacterium, it infects the bacterium by setting its infection timer. - The phage's infection timer decreases by 1 at each timestep. When the timer reaches 0, the infected bacteria dies, and the phage replicates, placing new phages in neighboring cells (if available). - Phages also have a specific health or lifespan, so they decay with the rounds move on
   -  Immune cells: - Immune cells move randomly in the grid, and their health persist during the whole simulation.

3. Iterating: The simulation continues for a specified number of timesteps or until a termination condition is met (e.g., no bacteria remaining).

# Default settings

- radius for bacteria: 5, scale 1
- radius for phage: 4: 0.7
- replicate bacterial: blue
- infected bacterial: orange



