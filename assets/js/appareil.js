document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api";
    const deviceIp = new URLSearchParams(window.location.search).get("ip");
    const deviceName = document.getElementById("deviceName");
    const seriesList = document.getElementById("seriesList");
    const ctx = document.getElementById("deviceChart").getContext("2d");

    if (!deviceIp) {
        alert("IP de l'appareil manquante dans l'URL.");
        window.location.href = "appareils"; // Redirige vers la liste des appareils
        return;
    }

    // Charge les points de données pour le graphique
    async function loadDeviceData() {
        try {
            const response = await fetch(`${apiBaseUrl}/series/appareils/${deviceIp}/points/limit`);
            if (!response.ok) throw new Error("Impossible de charger les données de l'appareil.");
            const data = await response.json();

            const seriesData = {};
            data.forEach(point => {
                const serieId = point.serieId;
                if (!seriesData[serieId]) {
                    seriesData[serieId] = { labels: [], values: [] };
                }
                seriesData[serieId].labels.push(new Date(...point.timestamp).toLocaleString());
                seriesData[serieId].values.push(point.valeurs);
            });

            deviceName.textContent = `Appareil : ${deviceIp}`;
            createChart(seriesData);
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des données de l'appareil.");
        }
    }

    // Charge les séries de l'appareil
    async function loadSeries() {
        try {
            const response = await fetch(`${apiBaseUrl}/appareils/${deviceIp}/series`);
            if (!response.ok) throw new Error("Impossible de charger les séries de l'appareil.");
            const series = await response.json();

            seriesList.innerHTML = "";
            series.forEach((serie) => {
                const li = document.createElement("li");
                li.textContent = `Nom : ${serie.nom}`;

                const link = document.createElement("a");
                link.href = `serie.html?id=${encodeURIComponent(serie.id)}`;
                link.textContent = "Voir";

                li.appendChild(link);
                seriesList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des séries.");
        }
    }

    // Crée un graphique avec plusieurs séries
    function createChart(seriesData) {
        const datasets = Object.keys(seriesData).map(serieId => ({
            label: `Série ${serieId}`,
            data: seriesData[serieId].values,
            borderColor: getRandomColor(),
            backgroundColor: "transparent",
            borderWidth: 2,
            tension: 0.3,
        }));

        new Chart(ctx, {
            type: "line",
            data: {
                labels: seriesData[Object.keys(seriesData)[0]].labels,
                datasets: datasets,
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

    // Génère une couleur aléatoire
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Charger les données et séries au démarrage
    loadDeviceData();
    loadSeries();
});
