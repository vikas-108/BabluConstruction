let CURRENT_PROFILE = null;
let NEW_PHOTO_FILE = null;
let activeRequests = 0;
//const ACCOUNT_BASE = "https://api.buildskil.com/api/account";
//const SERVER_BASE = "https://api.buildskil.com";
const ACCOUNT_BASE = "http://localhost:5000/api/account"; // change if using domain
const SERVER_BASE = "http://localhost:5000"; // change if using domain
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
  //document.querySelector(".login-required").style.display = "block";

  const res = await fetch(`${ACCOUNT_BASE}/me`, {
    headers: authHeaders(),
  });

  const profile = await res.json();

  renderProfile(profile);
  setupAdminButton(profile);
  //const membershipButton = document.getElementById("membershipButton");
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
  document
  .getElementById("verifyEmailBtn")
  ?.addEventListener("click", async () => {
    const res = await fetch(`${ACCOUNT_BASE}/send-email-otp`, {
      method: "POST",
      headers: authHeaders(),
    });

    if (res.ok) {
      showToaster("OTP sent to your email");

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
      showToaster("Email verified ✅");
    } else {
      showToaster(profile.message);
    }
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

  /*Show saved photo if available
  if (profile.photo) {
    document.getElementById("profilePhoto").src = profile.photo.startsWith(
      "http",
    )
      ? profile.photo
      : SERVER_BASE + profile.photo+ "?v=" + Date.now();
  } else {
    // Generate initials avatar if no photo
    const initials = (profile.name || "U N")
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("");
    document.getElementById("profilePhoto").src =
      `https://via.placeholder.com/140/007bff/ffffff?text=${initials}`;
  }
 const photo = document.getElementById("profilePhoto");

if (profile.photo) {
  photo.src = profile.photo.startsWith("http")
    ? profile.photo
    : SERVER_BASE + profile.photo;
} else {
  const initials = (profile.name || "U N")
    .split(" ")
    .map(n => n[0].toUpperCase())
    .join("");

  photo.src = `https://via.placeholder.com/140/007bff/ffffff?text=${encodeURIComponent(initials)}`;
}*/
  /*/ 🔐 LOCK EMAIL IF VERIFIED
const editEmailInput = document.getElementById("editEmail");

if(profile.emailVerified){
  editEmailInput?.setAttribute("disabled", true);
  editEmailInput?.classList.add("locked");
}else{
  editEmailInput?.removeAttribute("disabled");
  editEmailInput?.classList.remove("locked");
}


 *   // 🔐 LOCK EMAIL + ROLE IF VERIFIED
  const editEmailInput = document.getElementById("editEmail");
  const editRoleInput  = document.getElementById("editRole");

  [editEmailInput, editRoleInput].forEach((input) => {
    if (!input) return;
    if (profile.emailVerified) {
      input.setAttribute("disabled", true);
      input.classList.add("locked");
    } else {
      input.removeAttribute("disabled");
      input.classList.remove("locked");
    }
  }); */
   renderRoleActionCard(profile.role);
}

function renderRoleActionCard(role) {

  const roleActionCard = document.getElementById("roleActionCard");

  if (!roleActionCard) return;

  if (role === "Client") {

    roleActionCard.innerHTML = `
      <article class="account-card">
        <h3>A.P.</h3>
        <p>
          Here client creates projects and publishes them for workers to see.
        </p>

        <a href="../screen/cltprofile.html"
           class="account-action-btn">
          Create Project
        </a>
      </article>
    `;

  } else {

    roleActionCard.innerHTML = `
      <article class="account-card">
        <h3>C.P.</h3>
        <p>
          Here workers create profiles and publish them for clients to see.
        </p>

        <a href="../create-profile.html"
           class="account-action-btn">
          Create Profile
        </a>
      </article>
    `;
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
document.getElementById("canceleditbtn")?.addEventListener("click", closeEdit);
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
//const uploadPhoto = document.getElementById("uploadPhoto");
//const cameraPhoto = document.getElementById("cameraPhoto");

//uploadPhoto.addEventListener("change", previewPhoto);
//cameraPhoto.addEventListener("change", previewPhoto);
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
document
  .getElementById("saveProfileBtn")
  .addEventListener("click", saveProfile);

async function saveProfile() {
  try {
    const formData = new FormData();

    formData.append("name", editName.value.trim());
    formData.append("role", editRole.value);
    formData.append("experience", editExp.value.trim());
    formData.append("bio", editBio.value.trim());
    formData.append("email", editEmail.value.trim());

    // Attach file only if changed
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

    const data = await res.json();

    if (!res.ok) {
      showToaster(data.message || "Update failed");
      return;
    }

    // Backend returns { success, message, account }
    const updatedProfile = data.account || data;

    // Update current profile immediately
    CURRENT_PROFILE = updatedProfile;

    // Update the visible profile immediately
    renderProfile(updatedProfile);
 // IMPORTANT: update role-specific card
renderRoleActionCard(updatedProfile.role);
    // Optional: update edit form with the new values
    // populateEditForm(updatedProfile);

    // Clear selected new photo after successful save
    NEW_PHOTO_FILE = null;

    closeEdit();

    showToaster(
      data.message || "Profile updated successfully"
    );

  } catch (err) {
    console.error("SAVE PROFILE ERROR:", err);
    showToaster("Server connection error");
  }
}
async function deleteAccount() {
  if (!confirm("Delete your account permanently?")) return;

  const res = await fetch(`${ACCOUNT_BASE}/delete`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    showToaster("Delete failed");
    return;
  }

  // 🔥 CLEAR ALL LOGIN DATA
  localStorage.removeItem("cb_token");
  localStorage.removeItem("cb_login_user");

  window.location.href = "index.html";
}
const originalFetch = window.fetch;


window.fetch = async (...args) => {
    if (activeRequests++ === 0) {
        showLoader();
    }

    try {
        return await originalFetch(...args);
    } finally {
        if (--activeRequests === 0) {
            hideLoader();
        }
    }
};
async function loadDeleteSetting(){

    const res = await fetch(
        `${ACCOUNT_BASE}/auto-delete`,
        {
            headers: authHeaders()
        }
    );

    const data = await res.json();

    document.getElementById("deleteAfter").value =
        data.autoDeleteAfterDays;

    document.getElementById("lastActiveText").innerText =
        new Date(data.lastActive).toLocaleString();

}

loadDeleteSetting();

async function saveDeleteSetting() {
    try {
        const res = await fetch(`${ACCOUNT_BASE}/auto-delete`, {
            method: "PUT",
            headers: {
                ...authHeaders(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inactivityDays: Number(deleteAfter.value)
            })
        });

        const data = await res.json();

        if (!res.ok) {
            showToaster(data.message || "Failed to save", "error");
            return;
        }

        showToaster("Setting saved successfully", "success");

        // Update current saved value
        originalValue = deleteAfter.value;

        // Hide button again
        saveBtn.style.display = "none";

    } catch (err) {
        console.error(err);
        showToaster("Server error", "error");
    }
}

const deleteAfter = document.getElementById("deleteAfter");
const saveBtn = document.getElementById("saveDeleteSetting");

// Hide on page load
saveBtn.style.display = "none";

let originalValue = deleteAfter.value;

// Show button only when value changes
deleteAfter.addEventListener("change", () => {
    saveBtn.style.display = "block";
});
document
.getElementById("saveDeleteSetting")
.addEventListener("click",saveDeleteSetting);

function showToaster(message, type = "info", duration = 3000) {

    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span>${message}</span>
        <span class="toast-close">&times;</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    function removeToast() {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 350);

    }

    toast.querySelector(".toast-close")
        .addEventListener("click", removeToast);

    setTimeout(removeToast, duration);

}
/*
async function loadMembershipCard() {




    try {

        const res = await fetch(
            "http://localhost:5000/api/membership/my-membership",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("cb_token")}`
                }
            }
        );

        const data = await res.json();

        if (!data.success) {

            document.getElementById("membershipInfo").textContent =
                "Unable to load membership.";

            return;
        }

        const membership = data.membership;

        const plan =
            membership.plan.charAt(0).toUpperCase() +
            membership.plan.slice(1);

        const endDate = new Date(membership.endDate);

        document.getElementById("membershipInfo").innerHTML = `
            <strong>Plan:</strong> ${plan}<br>
            <strong>Status:</strong> ${membership.status}<br>
            <strong>Valid Until:</strong> ${endDate.toLocaleDateString()}
        `;

    } catch (err) {

        console.error(err);

        document.getElementById("membershipInfo").textContent =
            "Server error.";

    }

}

loadMembershipCard();
//window.previewPhoto = previewPhoto;
//window.openEditProfile = openEditProfile;
//window.saveProfile = saveProfile;
//window.closeEdit = closeEdit;

async function loadAccount() {

    const token =
        localStorage.getItem("cb_token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            `${ACCOUNT_BASE}/me`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


        if (!response.ok) {

            console.error(
                "Account API failed:",
                response.status
            );

            return;
        }


        const user =
            await response.json();

        
         //* EXISTING ACCOUNT DATA
         

        const nameInput =
            document.getElementById("editName");

        if (nameInput) {

            nameInput.value =
                user.name || "";
        }


        const phoneInput =
            document.getElementById("editPhone");

        if (phoneInput) {

            phoneInput.value =
                user.phone || "";
        }


        const roleInput =
            document.getElementById("editRole");

        if (roleInput) {

            roleInput.value =
                user.role || "";
        }


        
         //* ADMIN BUTTON
         

        setupAdminButton(user);


    } catch (error) {

        console.error(
            "Account loading error:",
            error
        );
    }
}
*/

/* =========================================================
   CREATE ADMIN BUTTON
   ========================================================= */

function setupAdminButton(user) {

    const container =
        document.getElementById(
            "adminButtonContainer"
        );

    if (!container) {

        console.error(
            "adminButtonContainer not found"
        );

        return;
    }


    // Remove previous button
    const oldButton =
        document.getElementById(
            "switchAdminBtn"
        );

    if (oldButton) {
        oldButton.remove();
    }


    // Only create for admin
    if (user?.isAdmin !== true) {
        return;
    }


    const button =
        document.createElement("button");


    button.id =
        "switchAdminBtn";

    button.type =
        "button";

    button.className =
        "switch-admin-btn";


    button.innerHTML = `
        <i class="fa-solid fa-shield-halved"></i>
        <span>Switch to Admin</span>
    `;


    // Force visible
    button.style.display = "flex";
    button.style.visibility = "visible";
    button.style.opacity = "1";
    button.style.width = "100%";
    button.style.minHeight = "44px";
    button.style.marginTop = "8px";
    button.style.padding = "12px 16px";
    button.style.background = "#111827";
    button.style.color = "#ffffff";
    button.style.border = "0";
    button.style.borderRadius = "10px";
    button.style.cursor = "pointer";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.gap = "5px";


    button.addEventListener(
        "click",
        function () {

            window.location.href =
                "/common/hedon.html";

        }
    );
    container.appendChild(button);
}


/* =========================================================
   START ACCOUNT
   ========================================================= */

//loadAccount();

});
