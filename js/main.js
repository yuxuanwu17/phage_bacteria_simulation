const canvas = document.getElementById('simulationCanvas');
const simulation = new Simulation(canvas);
const runSimulationButton = document.getElementById("runSimulation");
let simulationRunning = false;
let simulationInterval;
let simulationInitialized = false;

runSimulationButton.addEventListener("click", () => {
    // it is used to control the start and end of the program
    if (!simulationRunning) {
        if (!simulationInitialized) {
            const bacNum = parseInt(document.getElementById("bacNum").value);
            const bacScale = parseFloat(document.getElementById("bacScale").value);
            const phageNum = parseInt(document.getElementById("phageNum").value);
            const phageScale = parseFloat(document.getElementById("phageScale").value);
            const immuneCellNum = parseInt(document.getElementById("immuneCellNum").value);
            const immuneCellScale = parseFloat(document.getElementById("immuneCellScale").value);
            const bacLifespan = parseInt(document.getElementById("bacLifespan").value);
            const bacReplicateRate = parseInt(document.getElementById("bacReplicateRate").value);
            const lysisRate = parseInt(document.getElementById("lysisRate").value);
            const phageOffspring = parseInt(document.getElementById("phageOffspring").value);
            const numGens = parseInt(document.getElementById("numGens").value);

            simulation.initialize({
                bacNum: bacNum,
                bacScale: bacScale,
                phageNum: phageNum,
                phageScale: phageScale,
                immuneCellNum: immuneCellNum,
                immuneCellScale: immuneCellScale,
                bacLifespan: bacLifespan,
                bacReplicateRate: bacReplicateRate,
                lysisRate: lysisRate,
                phageOffspring: phageOffspring,
                numGens: numGens,
            });

            simulationInitialized = true;
        }

        simulationRunning = true;
        runSimulationButton.textContent = "Stop Simulation";
        runSimulation();
    } else {
        simulationRunning = false;
        runSimulationButton.textContent = "Run Simulation";
        clearInterval(simulationInterval);
    }
});

function runSimulation() {
    simulationInterval = setInterval(() => {
        if (!simulationRunning) {
            clearInterval(simulationInterval);
            return;
        }
        // control the number of generation
        if (simulation.rounds < simulation.numGens) {
            simulation.draw();
            simulation.update();
            simulation.rounds++;
            document.getElementById("roundsCounter").innerText = simulation.rounds;
        } else {
            simulationRunning = false;
            runSimulationButton.textContent = "Run Simulation";
            clearInterval(simulationInterval);
            console.log("Simulation completed.");
        }

    }, 100); // Set an interval time as needed
}