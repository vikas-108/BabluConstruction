// Constants
const PROFILE_KEY = "cb_user_profile";

const DEFAULT_PROFILE = {
  name: "",
  role: "Contractor",
  experience: "",
  bio: "",
  photo: "",
  phone: "",
  passwordHash: ""
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  const login = JSON.parse(localStorage.getItem(LOGIN_KEY)); // LOGIN_KEY comes from login.js
  if (!login) return;

  document.querySelector(".login-required").style.display = "block";

  let profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || DEFAULT_PROFILE;
  profile.phone = login.phone;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  renderProfile(profile);
});

// Render profile data into DOM
function renderProfile(profile) {
  document.getElementById("profileName").textContent = profile.name || "Your Name";
  document.getElementById("profileRole").textContent = profile.role || "select a role";
  document.getElementById("profileExp").textContent =
    profile.experience ? `Experience: ${profile.experience}` : "Experience: —";
  document.getElementById("profilePhone").textContent = profile.phone;
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

  const p = JSON.parse(localStorage.getItem(PROFILE_KEY)) || DEFAULT_PROFILE;
  document.getElementById("editName").value = p.name || "";
  document.getElementById("editRole").value = p.role || "";
  document.getElementById("editExp").value = p.experience || "";
  document.getElementById("editBio").value = p.bio || "";

  modal.classList.remove("hidden");
  modal.removeAttribute("inert");
  modal.querySelector("input, textarea, button").focus();

}

// Close modal
function closeEdit() {
  const modal = document.getElementById("editModal");
  if (!modal) return;
modal.classList.add("hidden");
  modal.setAttribute("inert", "");
  // Return focus to the edit button
  document.querySelector(".edit-btn").focus();
}


// Close modal when clicking outside modal-box
document.getElementById("editModal")?.addEventListener("click", e => {
  if (e.target.id === "editModal") {
    closeEdit();
  }
});
// preview selected images
function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById("profilePhoto").src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Optionally save to profile
  let profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || DEFAULT_PROFILE;
  profile.photo = file.name; // or store base64 if needed
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
// Save profile changes
async function saveProfile() {
  let p = JSON.parse(localStorage.getItem(PROFILE_KEY)) || DEFAULT_PROFILE;

  p.name = document.getElementById("editName").value.trim();
  p.role = document.getElementById("editRole").value.trim();
  p.experience = document.getElementById("editExp").value.trim();
  p.bio = document.getElementById("editBio").value.trim();

  //const password = document.getElementById("editPassword").value.trim();
  //if (password) {
  //  p.passwordHash = await hashPassword(password);
 // }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  renderProfile(p);
  closeEdit();
}

// Toggle password visibility
//function togglePassword() {
 // const pwd = document.getElementById("editPassword");
  //pwd.type = pwd.type === "password" ? "text" : "password";
//}

// Hash password securely (with fallback)
//async function hashPassword(text) {
 // if (window.crypto && crypto.subtle) {
  //  const enc = new TextEncoder().encode(text);
  //  const buf = await crypto.subtle.digest("SHA-256", enc);
  //  return [...new Uint8Array(buf)]
  //    .map(b => b.toString(16).padStart(2, "0"))
  //    .join("");
 // } else {
    // Fallback (not secure, but prevents breakage in old browsers)
 //   return btoa(text);
 // }
//}

// Delete account
function deleteAccount() {
  if (!confirm("Delete your account permanently?")) return;
  localStorage.removeItem(LOGIN_KEY); // LOGIN_KEY from login.js
  localStorage.removeItem(PROFILE_KEY);
  location.href = "index.html";
}

// Logout
function logout() {
  localStorage.removeItem(LOGIN_KEY); // LOGIN_KEY from login.js
  location.href = "index.html";
}