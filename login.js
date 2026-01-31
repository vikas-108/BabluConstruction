const LOGIN_KEY = "cb_login_user";

document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("authBtn");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!authBtn || !userMenu || !userName) {
    console.error("Navbar elements missing");
    return;
  }

  function updateNavbarAuth() {
    const user = JSON.parse(localStorage.getItem(LOGIN_KEY));

    if (user && user.username) {
      authBtn.classList.add("hidden");
      userMenu.classList.remove("hidden");
      userName.textContent = user.username; // show username in navbar
    } else {
      authBtn.classList.remove("hidden");
      userMenu.classList.add("hidden");
    }
  }

  // 🔽 TOGGLE DROPDOWN (CLICK ONLY USERNAME)
  userName.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("open");
  });

  // ❌ CLOSE DROPDOWN WHEN CLICK OUTSIDE
  document.addEventListener("click", () => {
    userMenu.classList.remove("open");
  });

  // 🚪 LOGOUT
  logoutBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    localStorage.removeItem(LOGIN_KEY);
    window.location.href = "index.html";
  });

  // 🔐 LOGIN BUTTON
  authBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // ✅ INITIAL CHECK
  updateNavbarAuth();
});

// ---------------- LOGIN PAGE LOGIC ----------------

const form = document.getElementById("loginForm");
const welcomeBox = document.getElementById("welcomeBox");
const usernameDisplay = document.getElementById("usernameDisplay");

function isValidUsername(value) {
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/.test(value);
}

function checkLogin() {
  const saved = JSON.parse(localStorage.getItem(LOGIN_KEY));
  if (saved) {
    form?.classList.add("hidden");
    welcomeBox?.classList.remove("hidden");
    usernameDisplay.innerText = saved.username; // show username in welcome box
  }
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const username = document.getElementById("username").value.trim();

  if (!phone || phone.length < 8) {
    alert("Enter valid phone number");
    return;
  }

  if (!isValidUsername(username)) {
    alert("Username must include letters, numbers & special characters");
    return;
  }

  // ✅ Save login
  localStorage.setItem(LOGIN_KEY, JSON.stringify({ phone, username }));

  // ✅ Redirect
  window.location.href = "index.html";
});

// 🚪 Logout function (used in welcome box)
function logout() {
  localStorage.removeItem(LOGIN_KEY);
  location.reload();
}

// Run login check on page load
checkLogin();