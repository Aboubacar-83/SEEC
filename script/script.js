const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const consommationForm = document.getElementById("consommation-form");
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "dashboard.html";
      } else {
        alert("Erreur de connexion !");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("reg_email").value;
      const password = document.getElementById("reg_password").value;

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert("Inscription réussie ! Connectez-vous.");
        window.location.href = "index.html";
      } else {
        alert("Erreur d'inscription.");
      }
    });
  }

  if (consommationForm) {
    consommationForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const valeur = document.getElementById("valeur").value;
      const date = document.getElementById("date").value;
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/consommation/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "Électricité", valeur, date }),
      });

      if (res.ok) {
        alert("Consommation ajoutée !");
        consommationForm.reset();
        loadConsommations();
      } else {
        alert("Erreur !");
      }
    });

    loadConsommations();
  }

  window.logout = function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };

  async function loadConsommations() {
    const token = localStorage.getItem("token");
    const list = document.getElementById("liste-consommations");
    list.innerHTML = "Chargement...";

    const res = await fetch(`${API_URL}/consommation/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      list.innerHTML = "Erreur lors du chargement.";
      return;
    }

    const data = await res.json();
    list.innerHTML = "";
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.date} - ${item.type} : ${item.valeur}`;
      list.appendChild(li);
    });
  }

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
});
