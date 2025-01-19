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

            const labels = data.map(point => new Date(...point.timestamp).toLocaleString());
            const values = data.map(point => point.valeurs);

            deviceName.textContent = `Appareil : ${deviceIp}`;
            createChart(labels, values);
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

    // Crée un graphique
    function createChart(labels, values) {
        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Points de données",
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

    // Charger les données et séries au démarrage
    loadDeviceData();
    loadSeries();
});
