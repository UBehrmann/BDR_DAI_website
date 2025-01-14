const apiUrl = "http://172.201.218.98/api/utilisateurs";
const userSelect = document.getElementById("userSelect");
const output = document.getElementById("output");

// Fetch all users and populate combo-box
async function loadUsers() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
        const users = await response.json();
        userSelect.innerHTML = '<option value="">-- Sélectionner --</option>';
        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.nomUtilisateur;
            option.textContent = user.nomUtilisateur;
            userSelect.appendChild(option);
        });
    } catch (error) {
        output.textContent = error.message;
        output.classList.add("error");
    }
}

// Fill fields when a user is selected
userSelect.addEventListener("change", async () => {
    const nomUtilisateur = userSelect.value;
    if (!nomUtilisateur) return;
    try {
        const response = await fetch(`${apiUrl}/${nomUtilisateur}`);
        if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
        const user = await response.json();
        document.getElementById("nom").value = user.nom;
        document.getElementById("prenom").value = user.prenom;
        document.getElementById("rue").value = user.rue;
        document.getElementById("noRue").value = user.noRue;
        document.getElementById("npa").value = user.npa;
        document.getElementById("lieu").value = user.lieu;
        document.getElementById("dateNaissance").value = user.dateNaissance;
        document.getElementById("nomUtilisateur").value = user.nomUtilisateur;
        document.getElementById("motDePasse").value = user.motDePasse;
        document.getElementById("statutCompte").value = user.statutCompte;
        document.getElementById("derniereConnexionDate").value = user.derniereConnexionDate;
        document.getElementById("derniereConnexionHeure").value = user.derniereConnexionHeure;
    } catch (error) {
        output.textContent = error.message;
        output.classList.add("error");
    }
});

// Add user
document.getElementById("addBtn").addEventListener("click", async () => {
    const user = getUserData();
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
        output.textContent = "Utilisateur ajouté avec succès.";
        loadUsers();
    } catch (error) {
        output.textContent = error.message;
        output.classList.add("error");
    }
});

// Update user
document.getElementById("updateBtn").addEventListener("click", async () => {
    const user = getUserData();
    try {
        const response = await fetch(`${apiUrl}/${user.nomUtilisateur}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
        output.textContent = "Utilisateur mis à jour avec succès.";
        loadUsers();
    } catch (error) {
        output.textContent = error.message;
        output.classList.add("error");
    }
});

// Delete user
document.getElementById("deleteBtn").addEventListener("click", async () => {
    const nomUtilisateur = document.getElementById("nomUtilisateur").value;
    if (!nomUtilisateur) return alert("Veuillez sélectionner un utilisateur.");
    try {
        const response = await fetch(`${apiUrl}/${nomUtilisateur}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
        output.textContent = "Utilisateur supprimé avec succès.";
        loadUsers();
    } catch (error) {
        output.textContent = error.message;
        output.classList.add("error");
    }
});

// Helper to get user data from fields
function getUserData() {
    return {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        rue: document.getElementById("rue").value,
        noRue: document.getElementById("noRue").value,
        npa: document.getElementById("npa").value,
        lieu: document.getElementById("lieu").value,
        dateNaissance: document.getElementById("dateNaissance").value,
        nomUtilisateur: document.getElementById("nomUtilisateur").value,
        motDePasse: document.getElementById("motDePasse").value,
        statutCompte: document.getElementById("statutCompte").value,
        derniereConnexionDate: document.getElementById("derniereConnexionDate").value,
        derniereConnexionHeure: document.getElementById("derniereConnexionHeure").value,
    };
}

// Load users on page load
loadUsers();
