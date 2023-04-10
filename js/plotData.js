function createCharts(bacteriaCounts=[], phageSizes=[], infectedBacteriaCounts=[]) {

    const bacteriaData = {
        labels: Array.from({length: bacteriaCounts.length}, (_, i) => i + 1),
        datasets: [
            {
                label: 'Number of Bacteria',
                data: bacteriaCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const phageData = {
        labels: Array.from({length: phageSizes.length}, (_, i) => i + 1),
        datasets: [
            {
                label: 'Number of Phage',
                data: phageSizes,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    const infectedBacteriaData = {
        labels: Array.from({length: infectedBacteriaCounts.length}, (_, i) => i + 1),
        datasets: [
            {
                label: 'Number of Infected Bacteria',
                data: infectedBacteriaCounts,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }
        ]
    };


    const bacteriaCtx = document.getElementById('bacteriaChart').getContext('2d');
    const phageCtx = document.getElementById('phageChart').getContext('2d');
    const infectedBacteriaCtx = document.getElementById('infectedBacteriaChart').getContext('2d');

    bacteriaChart = new Chart(bacteriaCtx, {
        type: 'line',
        data: bacteriaData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    phageChart = new Chart(phageCtx, {
        type: 'line',
        data: phageData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    infectedBacteriaChart = new Chart(infectedBacteriaCtx, {
        type: 'line',
        data: infectedBacteriaData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    return {
        bacteriaChart: bacteriaChart,
        phageChart: phageChart,
        infectedBacteriaChart: infectedBacteriaChart,
    };
}
