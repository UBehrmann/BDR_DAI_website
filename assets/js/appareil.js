document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/appareils";
    const deviceIp = new URLSearchParams(window.location.search).get("ip");
    const seriesList = document.getElementById("seriesList");
    const deviceName = document.getElementById("deviceName");

    // Vérifie si l'IP est dans l'URL
    if (!deviceIp) {
        alert("IP de l'appareil manquante dans l'URL.");
        window.location.href = "appareils"; // Redirige vers la page des appareils
        return;
    }

    // Charge les séries de l'appareil
    async function loadSeries() {
        try {
            const response = await fetch(`${apiBaseUrl}/${deviceIp}/series`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Impossible de charger les séries de l'appareil.");
            }

            const series = await response.json();
            deviceName.textContent = `Appareil : ${deviceIp}`;
            seriesList.innerHTML = ""; // Vide la liste des séries

            series.forEach((serie) => {
                const li = document.createElement("li");
                li.textContent = `Nom : ${serie.nom}`;

                // Crée un lien vers la page série
                const link = document.createElement("a");
                link.href = `serie?id=${encodeURIComponent(serie.id)}`;
                link.textContent = "Voir";

                li.appendChild(link);
                seriesList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des séries.");
        }
    }

    // Charger les séries au démarrage
    loadSeries();
});
