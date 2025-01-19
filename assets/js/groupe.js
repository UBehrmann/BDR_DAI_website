document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api";
    const groupName = new URLSearchParams(window.location.search).get("group");
    const username = localStorage.getItem("user");
    const groupInfo = document.getElementById("groupInfo");
    const userList = document.getElementById("userList");
    const adminActions = document.getElementById("adminActions");
    const addUserForm = document.getElementById("addUserForm");

    if (!username || !groupName) {
        window.location.href = "index"; // Redirige si non connecté ou groupe invalide
        return;
    }

    // Charge les détails du groupe
    async function loadGroupDetails() {
        try {
            const response = await fetch(`${apiBaseUrl}/groupes/${groupName}`);
            if (!response.ok) throw new Error("Impossible de charger les détails du groupe.");
            const groupData = await response.json();

            // Remplit les informations du groupe
            document.getElementById("groupName").textContent = `Groupe : ${groupData.nom}`;
            document.getElementById("groupAdmin").textContent = `Administrateur : ${groupData.administrateur}`;
            document.getElementById("groupDateCreation").textContent = `Date de création : ${groupData.dateCreation.join("-")}`;

            // Vérifie si l'utilisateur est administrateur
            if (groupData.administrateur !== username) {
                adminActions.style.display = "none";
            }

            // Affiche les utilisateurs
            userList.innerHTML = "";
            groupData.utilisateurs.forEach((user) => {
                const li = document.createElement("li");
                li.textContent = user;

                if (groupData.administrateur === username) {
                    // Bouton pour supprimer un utilisateur (visible seulement pour l'admin)
                    const removeButton = document.createElement("button");
                    removeButton.textContent = "Supprimer";
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
                loadGroupDetails();
            } else {
                throw new Error("Erreur lors de la suppression de l'utilisateur.");
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
                body: JSON.stringify({ nomUtilisateur: newUserName, nomGroupe: groupName }),
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

    // Charge les détails du groupe au démarrage
    loadGroupDetails();
});
