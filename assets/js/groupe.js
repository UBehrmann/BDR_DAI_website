document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api";
    const groupName = new URLSearchParams(window.location.search).get("group");
    const username = localStorage.getItem("user");
    const userList = document.getElementById("userList");
    const userSelect = document.getElementById("userSelect");
    const addUserForm = document.getElementById("addUserForm");
    const deviceList = document.getElementById("deviceList");
    const addDeviceForm = document.getElementById("addDeviceForm");
    const deleteGroupButton = document.getElementById("deleteGroupButton");

    if (!username || !groupName) {
        window.location.href = "index"; // Redirect if not logged in or group name missing
        return;
    }

    // Load group details
    async function loadGroupDetails() {
        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}`);
            if (!response.ok) throw new Error("Failed to load group details.");
            const groupData = await response.json();

            document.getElementById("groupName").textContent = `Groupe : ${groupData.nom}`;
            document.getElementById("groupAdmin").textContent = `Administrateur : ${groupData.administrateur}`;
            document.getElementById("groupDateCreation").textContent = `Date de création : ${groupData.dateCreation.join("-")}`;

            // List group users
            userList.innerHTML = "";
            groupData.utilisateurs.forEach((user) => {
                const li = document.createElement("li");
                li.textContent = user;

                // Add remove button for each user
                const removeButton = document.createElement("button");
                removeButton.textContent = "Supprimer";
                removeButton.onclick = () => removeUser(user);
                li.appendChild(removeButton);

                userList.appendChild(li);
            });

            // Load devices
            loadDevices();
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des détails du groupe.");
        }
    }

    // Load available users for the combobox
    async function loadUsers() {
        try {
            const response = await fetch(`${apiBaseUrl}/utilisateurs`);
            if (!response.ok) throw new Error("Failed to load users.");
            const users = await response.json();

            users.forEach((user) => {
                const option = document.createElement("option");
                option.value = user.nomUtilisateur;
                option.textContent = user.nomUtilisateur;
                userSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des utilisateurs disponibles.");
        }
    }

    // Add a user to the group
    addUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const selectedUser = userSelect.value;

        try {
            const response = await fetch(`${apiBaseUrl}/groupes/utilisateurs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ utilisateur: selectedUser, groupe: groupName }),
            });

            if (response.ok) {
                alert("Utilisateur ajouté avec succès.");
                loadGroupDetails();
            } else {
                throw new Error("Erreur lors de l'ajout de l'utilisateur.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Remove a user from the group
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

    // Load devices in the group
    async function loadDevices() {
        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}/appareils`);
            if (!response.ok) throw new Error("Failed to load devices.");
            const devices = await response.json();

            deviceList.innerHTML = "";
            devices.forEach((device) => {
                const li = document.createElement("li");
                li.textContent = `${device.nom} (${device.ip})`;

                // Add remove button for each device
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

    // Add a device to the group
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

    // Remove a device from the group
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

    // Delete the group
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
                window.location.href = "groupes"; // Redirect to groups page
            } else {
                throw new Error("Erreur lors de la suppression du groupe.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Load initial data
    loadGroupDetails();
    loadUsers();
});
