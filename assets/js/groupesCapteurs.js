document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/groupe-capteurs/utilisateur";
    const username = localStorage.getItem("user");
    const sensorGroupList = document.getElementById("sensorGroupList");

    // Vérifie si l'utilisateur est connecté
    if (!username) {
        window.location.href = "index"; // Redirige vers la page de connexion si non connecté
        return;
    }

    // Charge les groupes de capteurs de l'utilisateur
    async function loadSensorGroups() {
        try {
            const response = await fetch(`${apiBaseUrl}/${username}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Impossible de charger les groupes de capteurs.");
            }

            const sensorGroups = await response.json();
            sensorGroupList.innerHTML = ""; // Vide la liste

            sensorGroups.forEach((group) => {
                const li = document.createElement("li");
                li.textContent = group.nom;

                const button = document.createElement("button");
                button.textContent = "Voir";
                button.onclick = () => {
                    // Redirige vers la page du groupe capteur avec l'ID dans l'URL
                    window.location.href = `groupe-capteur.html?id=${group.id}`;
                };

                li.appendChild(button);
                sensorGroupList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des groupes de capteurs.");
        }
    }

    // Charger les groupes de capteurs au démarrage
    loadSensorGroups();
});
