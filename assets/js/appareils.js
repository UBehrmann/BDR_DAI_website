document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/appareils/utilisateur";
    const username = localStorage.getItem("user");
    const deviceList = document.getElementById("deviceList");

    // Vérifie si l'utilisateur est connecté
    if (!username) {
        window.location.href = "index"; // Redirige vers la page de connexion si non connecté
        return;
    }

    // Charge les appareils accessibles à l'utilisateur
    async function loadDevices() {
        try {
            const response = await fetch(`${apiBaseUrl}/${username}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Impossible de charger les appareils.");
            }

            const devices = await response.json();
            deviceList.innerHTML = ""; // Vide la liste des appareils

            devices.forEach((device) => {
                const li = document.createElement("li");
                li.textContent = `${device.nom} (${device.type}) - ${device.status}`;

                // Crée un bouton pour accéder à la page de l'appareil
                const button = document.createElement("button");
                button.textContent = "Voir";
                button.onclick = () => {
                    // Redirige vers la page appareil avec l'IP dans l'URL
                    window.location.href = `appareil.html?ip=${encodeURIComponent(device.ip)}`;
                };

                li.appendChild(button);
                deviceList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des appareils.");
        }
    }

    // Charger les appareils au démarrage
    loadDevices();
});
