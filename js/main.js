window.onload = function () {
    const canvas = document.getElementById('simulationCanvas');
    const simulation = new Simulation(canvas);
    const runSimulationButton = document.getElementById("runSimulation");
    let simulationRunning = false;
    let simulationInterval;
    let simulationInitialized = false;

    let bacteriaCounts = [];
    let phageSizes = [];
    let infectedBacteriaCounts = [];

    let bacteriaChart, phageChart, infectedBacteriaChart;
    const charts = createCharts();
    bacteriaChart = charts.bacteriaChart;
    phageChart = charts.phageChart;
    infectedBacteriaChart = charts.infectedBacteriaChart;


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
                const lifespan = parseInt(document.getElementById("lifespan").value);
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
                    lifespan: lifespan,
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


    function updateCharts() {
        bacteriaChart.data.labels.push(simulation.rounds);
        bacteriaChart.data.datasets[0].data.push(simulation.getBacteriaCount());

        phageChart.data.labels.push(simulation.rounds);
        phageChart.data.datasets[0].data.push(simulation.getPhageSize());

        infectedBacteriaChart.data.labels.push(simulation.rounds);
        infectedBacteriaChart.data.datasets[0].data.push(simulation.getInfectedBacteriaCount());

        bacteriaChart.update();
        phageChart.update();
        infectedBacteriaChart.update();
    }


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
                // Update the new elements
                document.getElementById("bacteriaCount").innerText = simulation.getBacteriaCount();
                bacteriaCounts.push(simulation.getBacteriaCount());

                document.getElementById("phageSize").innerText = simulation.getPhageSize();
                phageSizes.push(simulation.getPhageSize());

                document.getElementById("infectedBacteriaCount").innerText = simulation.getInfectedBacteriaCount();
                infectedBacteriaCounts.push(simulation.getInfectedBacteriaCount());
                updateCharts();
            } else {
                simulationRunning = false;
                runSimulationButton.textContent = "Run Simulation";
                clearInterval(simulationInterval);
                console.log("Simulation completed.");
                createCharts(bacteriaCounts, phageSizes, infectedBacteriaCounts);
            }

        }, 100); // Set an interval time as needed
    }


    const resetSimulationButton = document.getElementById("resetSimulation");

    resetSimulationButton.addEventListener("click", () => {
        location.reload()
    });
    simulation.rounds = 0;
}