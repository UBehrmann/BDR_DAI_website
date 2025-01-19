document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api";
    const groupName = new URLSearchParams(window.location.search).get("group");
    const username = localStorage.getItem("user");
    const userList = document.getElementById("userList");
    const deviceList = document.getElementById("deviceList");
    const addDeviceForm = document.getElementById("addDeviceForm");

    if (!username || !groupName) {
        window.location.href = "index"; // Redirige vers la page de connexion si non connecté ou groupe invalide
        return;
    }

    // Charge les détails du groupe
    async function loadGroupDetails() {
        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}`);
            if (!response.ok) throw new Error("Impossible de charger les détails du groupe.");
            const groupData = await response.json();

            document.getElementById("groupName").textContent = `Groupe : ${groupData.nom}`;
            document.getElementById("groupAdmin").textContent = `Administrateur : ${groupData.administrateur}`;
            document.getElementById("groupDateCreation").textContent = `Date de création : ${groupData.dateCreation.join("-")}`;

            // Liste des utilisateurs
            userList.innerHTML = "";
            groupData.utilisateurs.forEach((user) => {
                const li = document.createElement("li");
                li.textContent = user;

                // Bouton pour supprimer un utilisateur (visible uniquement pour l'admin)
                const removeButton = document.createElement("button");
                removeButton.textContent = "Supprimer";
                removeButton.onclick = () => removeUser(user);
                li.appendChild(removeButton);

                userList.appendChild(li);
            });

            // Charge les appareils du groupe
            loadDevices();
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des détails du groupe.");
        }
    }

    // Charge les appareils du groupe
    async function loadDevices() {
        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}/appareils`);
            if (!response.ok) throw new Error("Impossible de charger les appareils du groupe.");
            const devices = await response.json();

            deviceList.innerHTML = "";
            devices.forEach((device) => {
                const li = document.createElement("li");
                li.textContent = `${device.nom} (${device.ip})`;

                // Bouton pour supprimer un appareil
                const removeButton = document.createElement("button");
                removeButton.textContent = "Supprimer";
                removeButton.onclick = () => removeDevice(device.ip);
                li.appendChild(removeButton);

                deviceList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des appareils.");
        }
    }

    // Supprime un utilisateur du groupe
    async function removeUser(userName) {
        try {
            const response = await fetch(`${apiBaseUrl}/groupes/utilisateurs/${groupName}/${userName}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Utilisateur supprimé avec succès.");
                loadGroupDetails();
            } else {
                throw new Error("Erreur lors de la suppression de l'utilisateur.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Supprime un appareil du groupe
    async function removeDevice(deviceIp) {
        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}/appareils/${deviceIp}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Appareil supprimé avec succès.");
                loadDevices();
            } else {
                throw new Error("Erreur lors de la suppression de l'appareil.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Ajoute un appareil au groupe
    addDeviceForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const deviceIp = document.getElementById("deviceIp").value;

        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}/appareils/${deviceIp}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                alert("Appareil ajouté avec succès.");
                loadDevices();
            } else {
                throw new Error("Erreur lors de l'ajout de l'appareil.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Supprime le groupe
    deleteGroupButton.addEventListener("click", async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.")) {
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Groupe supprimé avec succès.");
                window.location.href = "groupes"; // Redirige vers la liste des groupes
            } else {
                throw new Error("Erreur lors de la suppression du groupe.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Charger les données initiales
    loadGroupDetails();
});
