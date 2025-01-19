document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api";
    const groupName = new URLSearchParams(window.location.search).get("group");
    const username = localStorage.getItem("user");
    const userList = document.getElementById("userList");
    const sensorGroupList = document.getElementById("sensorGroupList");
    const userSelect = document.getElementById("userSelect");
    const sensorGroupSelect = document.getElementById("sensorGroupSelect");
    const addUserForm = document.getElementById("addUserForm");
    const addSensorGroupForm = document.getElementById("addSensorGroupForm");

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
                userList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des détails du groupe.");
        }
    }

    // Charge les utilisateurs dans le combobox
    async function loadUsers() {
        try {
            const response = await fetch(`${apiBaseUrl}/utilisateurs`);
            if (!response.ok) throw new Error("Impossible de charger les utilisateurs.");
            const users = await response.json();

            users.forEach((user) => {
                const option = document.createElement("option");
                option.value = user.nomUtilisateur;
                option.textContent = user.nomUtilisateur;
                userSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des utilisateurs.");
        }
    }

    // Charge les groupes de capteurs dans le combobox
    async function loadSensorGroups() {
        try {
            const response = await fetch(`${apiBaseUrl}/groupe-capteurs`);
            if (!response.ok) throw new Error("Impossible de charger les groupes de capteurs.");
            const sensorGroups = await response.json();

            sensorGroups.forEach((group) => {
                const option = document.createElement("option");
                option.value = group.id;
                option.textContent = group.nom;
                sensorGroupSelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des groupes de capteurs.");
        }
    }

    // Ajoute un utilisateur au groupe
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
                loadGroupDetails(); // Recharge les détails du groupe
            } else {
                throw new Error("Erreur lors de l'ajout de l'utilisateur.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Ajoute un groupe de capteurs au groupe
    addSensorGroupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const selectedGroup = sensorGroupSelect.value;

        try {
            const response = await fetch(`${apiBaseUrl}/groupe-capteurs/${selectedGroup}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedGroup, groupe: groupName }),
            });

            if (response.ok) {
                alert("Groupe de capteurs ajouté avec succès.");
                loadGroupDetails();
            } else {
                throw new Error("Erreur lors de l'ajout du groupe de capteurs.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Charger les données initiales
    loadGroupDetails();
    loadUsers();
    loadSensorGroups();
});
