document.addEventListener('DOMContentLoaded', () => {

    const apiUrlGroups = "http://172.201.218.98/api/groupes"; // URL de l'API pour les groupes
    const apiUrlUsers = "http://172.201.218.98/api/utilisateurs"; // URL de l'API pour les utilisateurs
    const apiUrlGroupUsers = "http://172.201.218.98/api/groupes/utilisateurs"; // URL pour ajouter et supprimer des utilisateurs dans un groupe

    const groupSelect = document.getElementById("groupSelect");
    const adminSelect = document.getElementById("administrateur");
    const addUserSelect = document.getElementById("addUserSelect");
    const userList = document.getElementById("userList");
    const output = document.getElementById("output");

    // Charger les utilisateurs et remplir les combo-box des administrateurs et ajout d'utilisateurs
    async function loadUsers() {
        try {
            const response = await fetch(apiUrlUsers);
            if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
            const users = await response.json();
            adminSelect.innerHTML = '<option value="">-- Sélectionner un administrateur --</option>';
            addUserSelect.innerHTML = '<option value="">-- Sélectionner un utilisateur --</option>';
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.nomUtilisateur;
                option.textContent = user.nomUtilisateur;
                adminSelect.appendChild(option);

                const userOption = document.createElement("option");
                userOption.value = user.nomUtilisateur;
                userOption.textContent = user.nomUtilisateur;
                addUserSelect.appendChild(userOption);
            });
        } catch (error) {
            output.textContent = error.message;
            output.classList.add("error");
        }
    }

    // Charger tous les groupes et remplir la combo-box
    async function loadGroups() {
        try {
            const response = await fetch(apiUrlGroups);
            if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
            const groups = await response.json();
            groupSelect.innerHTML = '<option value="">-- Sélectionner --</option>';
            groups.forEach(group => {
                const option = document.createElement("option");
                option.value = group.nom;
                option.textContent = group.nom;
                groupSelect.appendChild(option);
            });
        } catch (error) {
            output.textContent = error.message;
            output.classList.add("error");
        }
    }

    // Remplir les champs lorsqu'un groupe est sélectionné et afficher ses utilisateurs
    groupSelect.addEventListener("change", async () => {
        const nom = groupSelect.value;
        if (!nom) return;
        try {
            const response = await fetch(`${apiUrlGroups}/${nom}`);
            if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
            const group = await response.json();
            document.getElementById("nom").value = group.nom;
            document.getElementById("dateCreation").value = formatDate(group.dateCreation);
            adminSelect.value = group.administrateur;

            displayGroupUsers(group.utilisateurs);
        } catch (error) {
            output.textContent = error.message;
            output.classList.add("error");
        }
    });

    // Afficher les utilisateurs d’un groupe
    function displayGroupUsers(users) {
        userList.innerHTML = "";
        users.forEach(user => {
            const li = document.createElement("li");
            li.textContent = user;
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Supprimer";
            removeBtn.onclick = () => removeUserFromGroup(user);
            li.appendChild(removeBtn);
            userList.appendChild(li);
        });
    }

    // Ajouter un utilisateur à un groupe
    document.getElementById("addUserBtn").addEventListener("click", async () => {
        const userName = addUserSelect.value;
        const groupName = groupSelect.value;
        if (!userName || !groupName) return alert("Veuillez sélectionner un utilisateur et un groupe.");
        try {
            const response = await fetch(`${apiUrlGroupUsers}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ utilisateur: userName, groupe: groupName }),
            });
            if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
            output.textContent = "Utilisateur ajouté au groupe avec succès.";
            groupSelect.dispatchEvent(new Event("change")); // Recharger les utilisateurs du groupe
        } catch (error) {
            output.textContent = error.message;
            output.classList.add("error");
        }
    });

    // Supprimer un utilisateur d’un groupe
    async function removeUserFromGroup(userName) {
        const groupName = groupSelect.value;
        if (!groupName) return alert("Veuillez sélectionner un groupe.");
        try {
            const response = await fetch(`${apiUrlGroupUsers}/${groupName}/${userName}`, { method: "DELETE" });
            if (!response.ok) throw new Error(`Erreur : ${response.status} ${response.statusText}`);
            output.textContent = "Utilisateur supprimé du groupe avec succès.";
            groupSelect.dispatchEvent(new Event("change")); // Recharger les utilisateurs du groupe
        } catch (error) {
            output.textContent = error.message;
            output.classList.add("error");
        }
    }

    // Formater la date reçue sous forme de tableau [YYYY, MM, DD]
    function formatDate(dateArray) {
        return `${dateArray[0]}-${String(dateArray[1]).padStart(2, '0')}-${String(dateArray[2]).padStart(2, '0')}`;
    }

    // Charger les groupes et les utilisateurs au chargement de la page
    loadGroups();
    loadUsers();

});