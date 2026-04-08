const API_BASE = "https://api.buildskil.com/api/profiles";
const SERVER_BASE = "https://api.buildskil.com";
let EDIT_PROFILE_ID = null;
let ORIGINAL_MEDIA = null;
function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("cb_token")}`,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const login = JSON.parse(localStorage.getItem("cb_login_user"));
  const form = document.getElementById("profileForm");
  const card = document.getElementById("profileCard");
  const nameInput = document.getElementById("name");
  const roleSelect = document.getElementById("role");
  const categorySelect = document.getElementById("category");
  const experienceInput = document.getElementById("experience");
  const locationInput = document.getElementById("location");
  const stateInput = document.getElementById("state");
  const districtInput = document.getElementById("district");
  const descriptionInput = document.getElementById("description");
  const mediaInput = document.getElementById("media");
  const albumInput = document.getElementById("album");
  const toggleBtn = document.getElementById("toggleFormBtn");
  const formWrapper = document.getElementById("formWrapper");
  async function compressImage(file) {
    return new Promise((resolve) => {
      // ✅ skip videos or non-images
      if (!file.type.startsWith("image/")) {
        resolve(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onerror = () => resolve(file);

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onerror = () => resolve(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const compressedFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".jpg"),
              { type: "image/jpeg" },
            );

            resolve(compressedFile);
          },
          "image/jpeg",
          0.7, // quality
        );
      };

      reader.readAsDataURL(file);
    });
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!login) {
      alert("Please login first");
      return;
    }

    const formData = new FormData();

    let mediaFile = mediaInput.files[0];

    if (mediaFile) {
      // ✅ ORIGINAL SIZE
      console.log(
        "Original:",
        (mediaFile.size / 1024 / 1024).toFixed(2) + " MB",
      );
      // 🔥 compress before upload
      mediaFile = await compressImage(mediaFile);
      // ✅ COMPRESSED SIZE
      console.log(
        "Compressed:",
        (mediaFile.size / 1024 / 1024).toFixed(2) + " MB",
      );
      formData.append("media", mediaFile);
    } else if (EDIT_PROFILE_ID) {
      formData.append("keepMedia", "true");
    }
    // ✅ Handle album (multiple images with compression)
    const albumFiles = albumInput.files;
    for (let i = 0; i < albumFiles.length; i++) {
      let file = albumFiles[i];

      // log original size
      console.log(
        `Album[${i}] Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      );

      // compress before upload
      file = await compressImage(file);

      // log compressed size
      console.log(
        `Album[${i}] Compressed: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      );

      formData.append("album", file);
    }
    formData.append("name", nameInput.value.trim());
    formData.append("category", categorySelect.value);
    formData.append("role", roleSelect.value);
    formData.append("experience", experienceInput.value);
    formData.append("location", locationInput.value);
    formData.append("state", stateInput.value);
    formData.append("district", districtInput.value);
    formData.append("description", descriptionInput.value);
    formData.append("skills", skills.value);
    formData.append("teamSize", teamSize.value);
    formData.append("projectsDone", projectsDone.value);
    formData.append("price", price.value);
    formData.append("languages", languages.value);
    let url = API_BASE;
    const method = EDIT_PROFILE_ID ? "PUT" : "POST";

    if (EDIT_PROFILE_ID) {
      url = `${API_BASE}/${EDIT_PROFILE_ID}`;
      method;
    }

    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: formData,
    });

   if (!res.ok) {
  // line 159 to 174 linit checker Try to read the backend’s error message
  let msg = "Profile creation failed";
  try {
    const data = await res.json();
    if (data?.message) {
      msg = data.message;
    }
  } catch (e) {
    // If response isn’t JSON, keep default message
  }
  alert(msg);
  return;
}
/**if (!res.ok) {
  alert("Profile creation failed");
  return;
} */

    await loadMyProfiles();
    EDIT_PROFILE_ID = null; // ⭐ reset edit mode
    form.reset();
    formWrapper.classList.add("hidden");
    toggleBtn.textContent = "➕ Add Profile";
  });
  toggleBtn.addEventListener("click", () => {
    formWrapper.classList.toggle("hidden");

    toggleBtn.textContent = formWrapper.classList.contains("hidden")
      ? "➕ Add Profile"
      : "❌ Close Form";
  });

  function renderProfiles(list) {
    card.innerHTML = list
      .map(
        (p) => `
    <div class="profile-card-item" id="card-${p._id}">

      <div class="profile-media">
        ${
          p.mediaType === "video"
            ? `<video src="${SERVER_BASE + p.media}" controls></video>`
            : `<img src="${SERVER_BASE + p.media}?v=${Date.now()}" />`
        }
      </div>

      <div class="profile-body">
        <h3>${p.name}</h3>
        <p>${p.category} • ${p.role || ""} • ${p.experience} yrs</p>
        <p>${p.location}, ${p.state}, ${p.district}</p>
        <p>${p.description}</p>

        <div class="profile-actions-float">
          <a class="action-btn call" href="tel:${p.phone}">
            <span>📞</span>
          </a>

          <a class="action-btn whatsapp"
             href="https://wa.me/${p.phone.replace(/\D/g, "")}"
             target="_blank">
            <span>🟢</span>
          </a>
        </div>

        ${
          p.published
            ? `
              <div class="profile-actions">
                <button class="vtn"onclick="editProfile('${p._id}')">Edit</button>
                <button class="btn" onclick="deleteProfile('${p._id}')">Delete</button>
              </div>
            `
            : `
              <button onclick="togglePublish('${p._id}')">Publish</button>
            `
        }

      </div>
    </div>
  `,
      )
      .join("");

    card.classList.remove("hidden");
  }

  async function editProfile(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      const profile = await res.json();

      // switch to edit mode
      EDIT_PROFILE_ID = id;
      ORIGINAL_MEDIA = profile.media; // ⭐ store original
      // fill form fields
      nameInput.value = profile.name || "";
      categorySelect.value = profile.category || "";
      roleSelect.value = profile.role || "";
      experienceInput.value = profile.experience || "";
      locationInput.value = profile.location || "";
      stateInput.value = profile.state || "";
      districtInput.value = profile.district || "";
      descriptionInput.value = profile.description || "";
      skills.value = profile.skills ? profile.skills.join(", ") : "";
      teamSize.value = profile.teamSize || "";
      projectsDone.value = profile.projectsDone || "";
      price.value = profile.price || "";
      languages.value = profile.languages ? profile.languages.join(", ") : "";
      // ✅ Populate roles for this category and pre-select saved role
    roleSelect.innerHTML = '<option value="">-- Select Role --</option>';
    if (categories[profile.category]) {
      categories[profile.category].forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.toLowerCase().replace(/\s+/g, "-");
        option.textContent = cat;

        if (option.value === profile.role.toLowerCase().replace(/\s+/g, "-")) {
          option.selected = true; // pre-select saved role
        }

        roleSelect.appendChild(option);
      });
    }

      // mediaInput .value = "";
      // ✅ Album preview
      const albumPreview = document.getElementById("albumPreview");
      albumPreview.innerHTML = "";
      if (profile.album && profile.album.length) {
        profile.album.forEach((img) => {
          const imageEl = document.createElement("img");
          imageEl.src = SERVER_BASE + img;
          imageEl.style.width = "80px";
          imageEl.style.height = "80px";
          imageEl.style.objectFit = "cover";
          imageEl.style.marginRight = "8px";
          albumPreview.appendChild(imageEl);
        });
      }

      // open form
      formWrapper.classList.remove("hidden");
      toggleBtn.textContent = "❌ Close Form";

      // scroll to form
      formWrapper.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    }
  }
  // Define categories for each role
  const categories = {
    contractor: [
      "Plumbing",
      "Electrician",
      "Carpentry",
      "Masonry",
      "Painting",
      "Roofing",
      "Flooring",
      "HVAC",
      "Landscaping",
      "Demolition",
      "Structural",
      "Marble & Tiles",
      "POP",
      "Glass",
    ],
    technician: [
      "Electrical Technician",
      "Plumbing Technician",
      "HVAC Technician",
      "Carpentry Technician",
      "Raj Mistry",
      "Marble",
      "Painter",
      "POP",
      "weilding",
      "Glass",
    ],
    supplier: [
      "Cement Supplier",
      "Steel Supplier",
      "Sand Supplier",
      "Equipment Supplier",
      "Tiles Supplier",
    ],
    architecture: [
      "Interior",
      "Exterior ",
      "Exterior & Interior",
      "Landscape Architecture",
      "Urban Architecture",
      "Naval Architecture",
      "Sustainable Architecture",
    ],
    mechanic: [
      "General Car Mechanic",
      "Engine Specialist",
      "Transmission Mechanic",
      "Brake Specialist",
      "Tyre/Wheel Mechanic",
      "Auto Electrician",
      "AC Mechanic",
      "Motorcycle Mechanic",
      "Diesel Mechanic",
      "Heavy Equipment Mechanic",
      "Marine Mechanic",
      "Aircraft Mechanic",
      "Industrial Mechanic",
    ],
    client:[
      "require Painter",
      "PLumber",
      "Havc",
      "Raj Mistry",
      "Technician",
      "Machanic",
      "Carpenter",
      "renovation",
      "Marble&Tiles",
      "Electrician",
      "Glass",
    ]
  };

  // Update category dropdown when role changes
  categorySelect.addEventListener("change", () => {
    const category = categorySelect.value;
    roleSelect.innerHTML = '<option value="">-- Select Role --</option>';

    if (categories[category]) {
      categories[category].forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.toLowerCase().replace(/\s+/g, "-");
        option.textContent = cat;
        roleSelect.appendChild(option);
      });
    }
  });
  async function togglePublish(id) {
    await fetch(`${API_BASE}/${id}/publish`, {
      method: "PATCH",
      headers: authHeaders(),
    });

    loadMyProfiles();
  }
  async function deleteProfile(id) {
    if (!confirm("Delete this profile?")) return;

    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) return;

    // 🔥 instantly remove from UI
    const el = document.getElementById(`card-${id}`);
    if (el) el.remove();
  }

  async function loadMyProfiles() {
    const res = await fetch(`${API_BASE}/my`, {
      headers: authHeaders(),
    });

    const list = await res.json();

    if (list.length) {
      renderProfiles(list);
    }
  }
  loadMyProfiles();
  window.togglePublish = togglePublish;
  window.deleteProfile = deleteProfile;
  window.editProfile = editProfile;
});

