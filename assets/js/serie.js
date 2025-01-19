document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/series";
    const seriesId = new URLSearchParams(window.location.search).get("id");
    const seriesName = document.getElementById("seriesName");
    const ctx = document.getElementById("seriesChart").getContext("2d");

    // Vérifie si l'ID de la série est présent dans l'URL
    if (!seriesId) {
        alert("ID de la série manquant dans l'URL.");
        window.location.href = "appareils"; // Redirige vers la page des appareils
        return;
    }

    // Charge les données pour le graphique
    async function loadSeriesData() {
        try {
            const response = await fetch(`${apiBaseUrl}/${seriesId}/points/limit`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Impossible de charger les données de la série.");
            }

            const data = await response.json();

            // Prépare les données pour le graphique
            const labels = data.map(point => new Date(...point.timestamp).toLocaleString());
            const values = data.map(point => point.valeurs);

            // Met à jour le nom de la série
            seriesName.textContent = `Série ID: ${seriesId}`;

            // Crée le graphique
            createChart(labels, values);
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des données de la série.");
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

    // Charger les données de la série au démarrage
    loadSeriesData();
});
