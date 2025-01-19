document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/series";
    const seriesId = new URLSearchParams(window.location.search).get("id");
    const seriesName = document.getElementById("seriesName");
    const ctx = document.getElementById("seriesChart").getContext("2d");
    const statAverage = document.getElementById("statAverage");
    const statMin = document.getElementById("statMin");
    const statMedian = document.getElementById("statMedian");
    const statMax = document.getElementById("statMax");

    if (!seriesId) {
        alert("ID de la série manquant dans l'URL.");
        window.location.href = "appareils"; // Redirige vers la page des appareils
        return;
    }

    // Charge les données pour le graphique
    async function loadSeriesData() {
        try {
            const response = await fetch(`${apiBaseUrl}/${seriesId}/points/limit`);
            if (!response.ok) throw new Error("Impossible de charger les données de la série.");
            const data = await response.json();

            const labels = data.map(point => new Date(...point.timestamp).toLocaleString());
            const values = data.map(point => point.valeurs);

            seriesName.textContent = `Série ID: ${seriesId}`;
            createChart(labels, values);
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des données de la série.");
        }
    }

    // Charge les statistiques
    async function loadSeriesStats() {
        try {
            const response = await fetch(`${apiBaseUrl}/${seriesId}/statistics/limit`);
            if (!response.ok) throw new Error("Impossible de charger les statistiques de la série.");
            const stats = await response.json();

            statAverage.textContent = `Moyenne : ${stats.average.toFixed(2)}`;
            statMin.textContent = `Minimum : ${stats.min.toFixed(2)}`;
            statMedian.textContent = `Médiane : ${stats.median.toFixed(2)}`;
            statMax.textContent = `Maximum : ${stats.max.toFixed(2)}`;
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des statistiques.");
        }
    }

    // Crée un graphique
    function createChart(labels, values) {
        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Valeurs de la Série",
                        data: values,
                        borderColor: "#007bff",
                        backgroundColor: "rgba(0,123,255,0.2)",
                        borderWidth: 2,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Timestamp",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Valeurs",
                        },
                    },
                },
            },
        });
    }

    // Charger les données et statistiques au démarrage
    loadSeriesData();
    loadSeriesStats();
});
