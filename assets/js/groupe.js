document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api";
    const groupName = new URLSearchParams(window.location.search).get("group");
    const username = localStorage.getItem("user");
    const groupInfo = document.getElementById("groupInfo");
    const userList = document.getElementById("userList");
    const adminActions = document.getElementById("adminActions");
    const addUserForm = document.getElementById("addUserForm");

    // Vérifie si l'utilisateur est connecté et si le groupe est spécifié dans l'URL
    if (!username || !groupName) {
        window.location.href = "index"; // Redirige vers la page de connexion si non connecté ou groupe invalide
        return;
    }

    // Charge les détails du groupe
    async function loadGroupDetails() {
        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Impossible de charger les détails du groupe.");
            const groupData = await response.json();

            // Remplit les informations du groupe
            document.getElementById("groupName").textContent = `Groupe : ${groupData.nom}`;
            document.getElementById("groupAdmin").textContent = `Administrateur : ${groupData.administrateur}`;
            document.getElementById("groupDateCreation").textContent = `Date de création : ${groupData.dateCreation.join("-")}`;

            // Vérifie si l'utilisateur est administrateur
            if (groupData.administrateur !== username) {
                adminActions.style.display = "none"; // Cache les actions admin si l'utilisateur n'est pas admin
            }

            // Affiche les utilisateurs du groupe
            userList.innerHTML = "";
            groupData.utilisateurs.forEach((user) => {
                const li = document.createElement("li");
                li.textContent = user;

                if (groupData.administrateur === username) {
                    // Ajoute un bouton pour supprimer un utilisateur (visible uniquement pour l'admin)
                    const removeButton = document.createElement("button");
                    removeButton.textContent = "Supprimer";
                    removeButton.classList.add("remove-button");
                    removeButton.onclick = () => removeUser(user);
                    li.appendChild(removeButton);
                }

                userList.appendChild(li);
            });
        } catch (error) {
            console.error(error);
            alert("Erreur lors du chargement des détails du groupe.");
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
                loadGroupDetails(); // Recharge les détails du groupe après suppression
            } else {
                throw new Error("Erreur lors de la suppression de l'utilisateur.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Crée un nouveau groupe
    async function createGroup() {
        try {
            const groupNameInput = prompt("Entrez le nom du groupe");
            if (!groupNameInput) {
                alert("Le nom du groupe est requis.");
                return;
            }

            const currentDate = new Date().toISOString().split("T")[0]; // Formate la date en AAAA-MM-JJ
            const response = await fetch(`${apiBaseUrl}/groupes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom: groupNameInput,
                    dateCreation: currentDate,
                    administrateur: username,
                }),
            });

            if (response.ok) {
                alert("Groupe créé avec succès !");
                window.location.href = `groupe.html?group=${encodeURIComponent(groupNameInput)}`;
            } else {
                throw new Error("Erreur lors de la création du groupe.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Ajoute un utilisateur au groupe
    addUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newUserName = document.getElementById("newUserName").value;

        try {
            const response = await fetch(`${apiBaseUrl}/groupes/utilisateurs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ utilisateur: newUserName, groupe: groupName }),
            });

            if (response.ok) {
                alert("Utilisateur ajouté avec succès.");
                loadGroupDetails(); // Recharge les détails du groupe après ajout
            } else {
                throw new Error("Erreur lors de l'ajout de l'utilisateur.");
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // Charge les détails du groupe au démarrage
    loadGroupDetails();
});
