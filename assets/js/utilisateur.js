document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/utilisateurs";
    const userForm = document.getElementById("userForm");
    const message = document.getElementById("message");

    // Vérifie si l'utilisateur est connecté
    const username = localStorage.getItem("user");
    if (!username) {
        window.location.href = "index.html"; // Redirige vers la page de connexion si non connecté
        return;
    }

    // Charge les informations de l'utilisateur
    async function loadUserData() {
        try {
            const response = await fetch(`${apiBaseUrl}/${username}`, {
                method: "GET",
            });

            if (response.status === 404) {
                throw new Error("Utilisateur non trouvé.");
            }

            if (!response.ok) {
                throw new Error("Une erreur est survenue lors du chargement des informations.");
            }

            const userData = await response.json();

            // Remplit les champs avec les données récupérées
            document.getElementById("nom").value = userData.nom || "";
            document.getElementById("prenom").value = userData.prenom || "";
            document.getElementById("rue").value = userData.rue || "";
            document.getElementById("noRue").value = userData.noRue || "";
            document.getElementById("npa").value = userData.npa || "";
            document.getElementById("lieu").value = userData.lieu || "";
            document.getElementById("dateNaissance").value = userData.dateNaissance || "";
            document.getElementById("statutCompte").value = userData.statutCompte || "";
            document.getElementById("derniereConnexion").value =
                userData.derniereConnexionDate && userData.derniereConnexionHeure
                    ? `${userData.derniereConnexionDate} ${userData.derniereConnexionHeure}`
                    : "Aucune connexion enregistrée";
        } catch (error) {
            message.textContent = error.message;
            message.style.color = "red";
        }
    }

    // Met à jour les informations de l'utilisateur
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nom = document.getElementById("nom").value;
        const prenom = document.getElementById("prenom").value;
        const rue = document.getElementById("rue").value;
        const noRue = document.getElementById("noRue").value;
        const npa = document.getElementById("npa").value;
        const lieu = document.getElementById("lieu").value;
        const dateNaissance = document.getElementById("dateNaissance").value;

        try {
            const response = await fetch(`${apiBaseUrl}/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom,
                    prenom,
                    rue,
                    noRue,
                    npa,
                    lieu,
                    dateNaissance,
                }),
            });

            if (!response.ok) {
                throw new Error("Impossible de mettre à jour les informations.");
            }

            message.textContent = "Informations mises à jour avec succès.";
            message.style.color = "green";
        } catch (error) {
            message.textContent = error.message;
            message.style.color = "red";
        }
    });

    loadUserData();
});
