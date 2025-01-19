document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/groupes";
    const username = localStorage.getItem("user");
    const groupList = document.getElementById("groupList");
    const createGroupForm = document.getElementById("createGroupForm");
    const message = document.getElementById("message");

    // Vérifie si l'utilisateur est connecté
    if (!username) {
        window.location.href = "index"; // Redirige vers la page de connexion si non connecté
        return;
    }

    // Charge les groupes de l'utilisateur
    async function loadGroups() {
        try {
            const response = await fetch(`${apiBaseUrl}/utilisateur/${username}`, {
                method: "GET",
            });

            if (response.status === 404) {
                throw new Error("Aucun groupe trouvé.");
            }

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des groupes.");
            }

            const groups = await response.json();
            groupList.innerHTML = ""; // Vide la liste des groupes

            groups.forEach((group) => {
                // Crée un bouton pour chaque groupe
                const button = document.createElement("button");
                button.textContent = group.nom;
                button.classList.add("group-button");
                button.onclick = () => {
                    // Redirige vers la page du groupe avec le nom en paramètre URL
                    window.location.href = `groupe.html?group=${encodeURIComponent(group.nom)}`;
                };

                // Ajoute le bouton à la liste
                const li = document.createElement("li");
                li.appendChild(button);
                groupList.appendChild(li);
            });
        } catch (error) {
            message.textContent = error.message;
            message.classList.add("error");
        }
    }

    // Crée un nouveau groupe
    createGroupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const groupName = document.getElementById("groupName").value;

        try {
            const response = await fetch(apiBaseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: groupName,
                    administrateur: username, // Inclut l'utilisateur connecté comme administrateur
                }),
            });

            if (response.status === 201) {
                message.textContent = "Groupe créé avec succès.";
                message.classList.add("success");
                loadGroups(); // Recharge les groupes
            } else {
                throw new Error("Erreur lors de la création du groupe.");
            }
        } catch (error) {
            message.textContent = error.message;
            message.classList.add("error");
        }
    });

    // Charger les groupes au démarrage
    loadGroups();
});
