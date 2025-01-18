document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "https://ub-dai.duckdns.org/api/utilisateurs";
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    // Vérifie si l'utilisateur est déjà connecté
    const userData = localStorage.getItem("user");
    if (userData) {
        window.location.href = "groupes"; // Redirige vers la page d'accueil si déjà connecté
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${apiBaseUrl}/${username}/${password}`, {
                method: "GET",
            });

            if (response.status === 404) {
                throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
            }

            if (!response.ok) {
                throw new Error("Une erreur est survenue. Veuillez réessayer.");
            }

            const result = await response.text(); // Récupère la réponse en texte brut

            if (result === "Utilisateur trouvé") {
                // Stocke simplement un indicateur d'authentification
                localStorage.setItem("user", username);
                window.location.href = "groupes"; // Redirige vers la page d'accueil
            } else {
                throw new Error("Réponse inattendue du serveur.");
            }
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        }
    });
});
