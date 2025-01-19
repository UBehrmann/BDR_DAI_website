document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/groupe-capteurs";
    const groupId = new URLSearchParams(window.location.search).get("id");
    const username = localStorage.getItem("user");
    const deviceList = document.getElementById("deviceList");
    const addDeviceForm = document.getElementById("addDeviceForm");

    // Vérifie si l'utilisateur est connecté et si l'ID du groupe est spécifié
    if (!username || !groupId) {
        window.location.href = "index"; // Redirige vers la page de connexion si non connecté ou ID invalide
        return;
    }

    // Charge les capteurs du groupe
    async function loadDevices() {
        try {
            const response = await fetch(`${apiBaseUrl}/${groupId}/appareils`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Impossible de charger les capteurs.");
            }

            const devices = await response.json();
            deviceList.innerHTML = ""; // Vide la liste

            devices.forEach((device) => {
                const li = document.createElement("li");
                li.textContent = `ID: ${device.id}, Nom: ${device.nom}`;

                // Ajoute un bouton pour supprimer un capteur
                const removeButton = document.createElement("button");
                removeButton.textContent = "Supprimer";
                removeButton.onclick = () => removeDevice(device.id);

                li.appendChild(removeButton);
                deviceList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des capteurs.");
        }
    }

    // Supprime un capteur du groupe
    async function removeDevice(deviceId) {
        try {
            const response = await fetch(`${apiBaseUrl}/${groupId}/appareils/${deviceId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Capteur supprimé avec succès.");
                loadDevices(); // Recharge les capteurs après suppression
            } else {
                throw new Error("Erreur lors de la suppression du capteur.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Ajoute un capteur au groupe
    addDeviceForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const deviceId = document.getElementById("deviceId").value;

        try {
            const response = await fetch(`${apiBaseUrl}/${groupId}/appareils`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deviceId }),
            });

            if (response.status === 201) {
                alert("Capteur ajouté avec succès.");
                loadDevices(); // Recharge les capteurs après ajout
            } else {
                throw new Error("Erreur lors de l'ajout du capteur.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Charger les capteurs au démarrage
    loadDevices();
});
