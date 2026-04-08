let CURRENT_PROFILE = null;
let NEW_PHOTO_FILE = null;
const ACCOUNT_BASE = "https://api.buildskil.com/api/account";
const SERVER_BASE = "https://api.buildskil.com";
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("cb_token")}`,
  };
}

const DEFAULT_PROFILE = {
  name: "",
  role: "Contractor",
  experience: "",
  bio: "",
  photo: "",
  phone: "",
  email: "",
  // passwordHash: ""
};
// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  const login = JSON.parse(localStorage.getItem(LOGIN_KEY)); // LOGIN_KEY comes from login.js
  if (!login) return;

  document.querySelector(".login-required").style.display = "block";
  document.querySelector(".login-required").style.display = "block";

  const res = await fetch(`${ACCOUNT_BASE}/me`, {
    headers: authHeaders(),
  });

  const profile = await res.json();

  renderProfile(profile);
  const membershipButton = document.getElementById("membershipButton");
  const subscriptionSection = document.getElementById("subscriptionSection");
  const closeDrawer = document.getElementById("closeDrawer");
  const verifyBtn = document.getElementById("verifyEmailBtn");
  const otpBox = document.getElementById("emailVerifyBox");
  const badge = document.getElementById("emailBadge");

  if (profile.emailVerified) {
    badge?.classList.remove("hidden");
    verifyBtn?.classList.add("hidden");
    otpBox?.classList.add("hidden");
  } else {
    badge?.classList.add("hidden");
    verifyBtn?.classList.remove("hidden");
  }
  // Open drawer
  membershipButton.addEventListener("click", () => {
    subscriptionSection.classList.add("active");
  });

  // Close drawer
  closeDrawer.addEventListener("click", () => {
    subscriptionSection.classList.remove("active");
  });

  // Optional: close drawer when clicking outside
  document.addEventListener("click", (e) => {
    if (
      subscriptionSection.classList.contains("active") &&
      !subscriptionSection.contains(e.target) &&
      e.target !== membershipButton
    ) {
      subscriptionSection.classList.remove("active");
    }
  });

  document
  .getElementById("verifyEmailBtn")
  ?.addEventListener("click", async () => {
    const res = await fetch(`${ACCOUNT_BASE}/send-email-otp`, {
      method: "POST",
      headers: authHeaders(),
    });

    if (res.ok) {
      alert("OTP sent to your email");

      verifyEmailBtn.classList.add("hidden"); // 👈 hide verify button
      emailVerifyBox.classList.remove("hidden"); // 👈 show input
    }
  });
  document
  .getElementById("submitEmailOtp")
  ?.addEventListener("click", async () => {
    const otp = document.getElementById("emailOtpInput").value;

    const res = await fetch(`${ACCOUNT_BASE}/verify-email-otp`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ otp }),
    });
    const profile = await res.json(); // ✅ ONLY ONCE

    if (res.ok) {
      renderProfile(profile); // 🔥 this updates badge + UI
      alert("Email verified ✅");
    } else {
      alert(profile.message);
    }
  });
});

// Render profile data into DOM
function renderProfile(profile) {
  CURRENT_PROFILE = profile; // 🔥 important
  document.getElementById("profileName").textContent =
    profile.name || "Your Name";
  document.getElementById("profileRole").textContent =
    profile.role || "Contractor";
  document.getElementById("profileExp").textContent = profile.experience
    ? `Experience: ${profile.experience}`
    : "Experience: —";
  document.getElementById("profilePhone").textContent = profile.phone;
  document.getElementById("profileEmail").textContent = profile.email
    ? ` ${profile.email}`
    : "Email: —";
  document.getElementById("profileBio").textContent =
    profile.bio || "No details added";

  // Show saved photo if available
  if (profile.photo) {
    document.getElementById("profilePhoto").src = profile.photo.startsWith(
      "http",
    )
      ? profile.photo
      : SERVER_BASE + profile.photo+ "?v=" + Date.now();;
  } else {
    // Generate initials avatar if no photo
    const initials = (profile.name || "U N")
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("");
    document.getElementById("profilePhoto").src =
      `https://via.placeholder.com/140/007bff/ffffff?text=${initials}`;
  }
  // 🔐 LOCK EMAIL IF VERIFIED
const editEmailInput = document.getElementById("editEmail");

if(profile.emailVerified){
  editEmailInput?.setAttribute("disabled", true);
  editEmailInput?.classList.add("locked");
}else{
  editEmailInput?.removeAttribute("disabled");
  editEmailInput?.classList.remove("locked");
}
}

const editName = document.getElementById("editName");
const editRole = document.getElementById("editRole");
const editExp = document.getElementById("editExp");
const editBio = document.getElementById("editBio");
const editEmail = document.getElementById("editEmail");

function openEditProfile() {
  const modal = document.getElementById("editModal");
  if (!modal || !CURRENT_PROFILE) return;

  const p = CURRENT_PROFILE;
  editName.value = p.name || "";
  editRole.value = p.role || "Contractor";
  editExp.value = p.experience || "";
  editBio.value = p.bio || "";
  editEmail.value = p.email || "";

  modal.classList.add("show");       // show modal
  modal.removeAttribute("inert");
  editName.focus();
}

function closeEdit() {
  const modal = document.getElementById("editModal");
  if (!modal) return;
  modal.classList.remove("show");    // hide modal
  modal.setAttribute("inert", "");
  document.getElementById("editIconBtn")?.focus();
}

// open modal when clicking edit icon
document.getElementById("editIconBtn").addEventListener("click", openEditProfile);

// close modal when clicking backdrop
document.getElementById("editModal").addEventListener("click", (e) => {
  if (e.target.id === "editModal") {
    closeEdit();
  }
});

// close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeEdit();
});

// Preview selected images
function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  NEW_PHOTO_FILE = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    profilePhoto.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
async function saveProfile() {
  try {

    const formData = new FormData();

    formData.append("name", editName.value.trim());
    formData.append("role", editRole.value);
    formData.append("experience", editExp.value.trim());
    formData.append("bio", editBio.value.trim());
    formData.append("email", editEmail.value.trim());

    // ✅ attach file ONLY if changed
    if (NEW_PHOTO_FILE) {
      formData.append("photo", NEW_PHOTO_FILE);
    }

    const res = await fetch(`${ACCOUNT_BASE}/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("cb_token")}`
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Update failed");
      return;
    }

    const profile = await res.json();

    renderProfile(profile);
    closeEdit();

  } catch (err) {
    console.error(err);
    alert("Server connection error");
  }
}
async function deleteAccount() {
  if (!confirm("Delete your account permanently?")) return;

  const res = await fetch(`${ACCOUNT_BASE}/delete`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    alert("Delete failed");
    return;
  }

  // 🔥 CLEAR ALL LOGIN DATA
  localStorage.removeItem("cb_token");
  localStorage.removeItem("cb_login_user");

  window.location.href = "index.html";
}

// Delete account
/*async function deleteAccount() {
  if (!confirm("Delete account permanently?")) return;

  await fetch(`${ACCOUNT_BASE}/delete`, {
    method: "DELETE",
    headers: authHeaders()
  });

  localStorage.removeItem("cb_token");
  localStorage.removeItem(LOGIN_KEY);

  location.href = "index.html";
}*/
