// Constants
const PROFILE_KEY_BASE = "cb_user_profile";

function getProfileKey(phone) {
  return `${PROFILE_KEY_BASE}_${phone}`;
}

const DEFAULT_PROFILE = {
  name: "",
  role: "Contractor",
  experience: "",
  bio: "",
  photo: "",
  phone: "",
  email: "",
  passwordHash: ""
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const login = JSON.parse(localStorage.getItem(LOGIN_KEY)); // LOGIN_KEY comes from login.js
  if (!login) return;

  document.querySelector(".login-required").style.display = "block";

  const key = getProfileKey(login.phone);
  let profile = JSON.parse(localStorage.getItem(key)) || Object.assign({}, DEFAULT_PROFILE);
  profile.phone = login.phone;
  localStorage.setItem(key, JSON.stringify(profile));
  renderProfile(profile);
});

// Render profile data into DOM
function renderProfile(profile) {
  document.getElementById("profileName").textContent = profile.name || "Your Name";
  document.getElementById("profileRole").textContent = profile.role || "Contractor";
  document.getElementById("profileExp").textContent =
    profile.experience ? `Experience: ${profile.experience}` : "Experience: —";
  document.getElementById("profilePhone").textContent = profile.phone;
  document.getElementById("profileEmail").textContent = profile.email ? ` ${profile.email}` : "Email: —";
  document.getElementById("profileBio").textContent = profile.bio || "No details added";

  // Show saved photo if available
  if (profile.photo) {
    document.getElementById("profilePhoto").src = profile.photo;
  } else {
    // Generate initials avatar if no photo
    const initials = (profile.name || "U N")
      .split(" ")
      .map(n => n[0].toUpperCase())
      .join("");
    document.getElementById("profilePhoto").src =
      `https://via.placeholder.com/140/007bff/ffffff?text=${initials}`;
  }
}

// Open modal with existing profile data
function openEditProfile() {
  const modal = document.getElementById("editModal");
  if (!modal) return;

  const login = JSON.parse(localStorage.getItem(LOGIN_KEY));
  if (!login) return;

  const key = getProfileKey(login.phone);
  const p = JSON.parse(localStorage.getItem(key)) || Object.assign({}, DEFAULT_PROFILE);

  document.getElementById("editName").value = p.name || "";
  document.getElementById("editRole").value = p.role || "Contractor";
  document.getElementById("editExp").value = p.experience || "";
  document.getElementById("editBio").value = p.bio || "";
 document.getElementById("editEmail").value = p.email || "";
  modal.classList.remove("hidden");
  modal.removeAttribute("inert");
  document.getElementById("editName").focus();
}

// Close modal
function closeEdit() {
  const modal = document.getElementById("editModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("inert", "");
  document.querySelector(".edit-btn").focus();
}

// Close modal when clicking outside modal-box
document.getElementById("editModal")?.addEventListener("click", e => {
  if (e.target.id === "editModal") {
    closeEdit();
  }
});

// Preview selected images
function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById("profilePhoto").src = e.target.result;

    const login = JSON.parse(localStorage.getItem(LOGIN_KEY));
    if (!login) return;

    const key = getProfileKey(login.phone);
    let profile = JSON.parse(localStorage.getItem(key)) || Object.assign({}, DEFAULT_PROFILE);
    profile.photo = e.target.result;
    localStorage.setItem(key, JSON.stringify(profile));
  };
  reader.readAsDataURL(file);
}

// Save profile changes
function saveProfile() {
  const login = JSON.parse(localStorage.getItem(LOGIN_KEY));
  if (!login) return;

  const key = getProfileKey(login.phone);
  let p = JSON.parse(localStorage.getItem(key)) || Object.assign({}, DEFAULT_PROFILE);

  /*const nameVal = document.getElementById("editName").value.trim();
  const roleVal = document.getElementById("editRole").value;
  const expVal = document.getElementById("editExp").value.trim();
  const bioVal = document.getElementById("editBio").value.trim();

  if (nameVal) p.name = nameVal;
  if (roleVal) p.role = roleVal;
  if (expVal) p.experience = expVal;
  if (bioVal) p.bio = bioVal;

  // Always preserve phone
  p.phone = login.phone;*/
  p.name = document.getElementById("editName").value.trim();
  p.role = document.getElementById("editRole").value;
  p.experience = document.getElementById("editExp").value.trim();
  p.bio = document.getElementById("editBio").value.trim();
  p.email = document.getElementById("editEmail").value.trim();
  p.phone = login.phone; // always tie to current user

  // Always preserve photo if already set
  const photoSrc = document.getElementById("profilePhoto").src;
  if (photoSrc && !photoSrc.includes("default-user.png")) {
    p.photo = photoSrc;
  }

  localStorage.setItem(key, JSON.stringify(p));
  renderProfile(p);
  closeEdit();
}

// Delete account
function deleteAccount() {
  if (!confirm("Delete your account permanently?")) return;
  const login = JSON.parse(localStorage.getItem(LOGIN_KEY));
  if (login) {
    const key = getProfileKey(login.phone);
    localStorage.removeItem(key);
  }
  localStorage.removeItem(LOGIN_KEY);
  location.href = "index.html";
}

// Logout
function logout() {
  localStorage.removeItem(LOGIN_KEY);
  location.href = "index.html";
}