const PROFILE_STORE = "cb_public_profiles";
const LOGIN_KEY = "cb_login_user";

document.addEventListener("DOMContentLoaded", () => {
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
const toggleBtn = document.getElementById("toggleFormBtn");
const formWrapper = document.getElementById("formWrapper");
  const login = JSON.parse(localStorage.getItem(LOGIN_KEY));
  if (login && document.getElementById("profilePhone")) {
    document.getElementById("profilePhone").textContent = login.phone;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!login) {
      alert("Please login first");
      return;
    }

    const mediaFile = mediaInput.files[0];
    let mediaData = "";

    if (mediaFile) {
      mediaData = await fileToBase64(mediaFile);
    }


    const profile = {
      id: Date.now(),
      name: nameInput.value.trim(),
      role: roleSelect.value,
      category: categorySelect.value,
      experience: experienceInput.value,
      location: locationInput.value,
        state: stateInput.value,
        district: districtInput.value,
      description: descriptionInput.value,
      phone: login.phone,
      media: mediaData,
      mediaType:
        mediaFile && mediaFile.type.startsWith("video")
          ? "video"
          : "image",
     createdAt: new Date().toLocaleString(),
     published: false
    };

   saveProfile(profile);
   loadSavedProfiles(); // ✅ refresh UI immediately
   form.reset();
   formWrapper.classList.add("hidden");
toggleBtn.textContent = "➕ Add Profile";

  });
toggleBtn.addEventListener("click", () => {
  formWrapper.classList.toggle("hidden");

  toggleBtn.textContent =
    formWrapper.classList.contains("hidden")
      ? "➕ Add Profile"
      : "❌ Close Form";
});
  function saveProfile(profile) {
    try {
      const list = JSON.parse(localStorage.getItem(PROFILE_STORE)) || [];
      list.push(profile);
      localStorage.setItem(PROFILE_STORE, JSON.stringify(list));
    } catch (err) {
      if (err.name === "QuotaExceededError") {
        alert(" use smaller image size.");
      } else {
        console.error(err);
      }
    }
  }

function renderProfiles(list) {
  card.innerHTML = list.map(p => `
    <div class="profile-card-item">

      <div class="profile-media">
        ${
          p.mediaType === "video"
            ? `<video src="${p.media}" controls></video>`
            : `<img src="${p.media || p.photo}" />`
        }
      </div>

      <div class="profile-body">
        <h3>${p.name}</h3>
        <p>${p.role}, ${p.category || ""} • ${p.experience} yrs</p>
        <p>${p.location}, ${p.state}, ${p.district}</p>
        <p>${p.description}</p>
<div class="profile-actions-float">
  <a class="action-btn call" href="tel:${p.phone}">
    <span>📞</span>
  </a>

  <a class="action-btn whatsapp"
     href="https://wa.me/${p.phone.replace(/\D/g,'')}"
     target="_blank">
    <span>🟢</span>
  </a>
</div>
<h1>this is coming soon ..</h1>

        ${
          p.published
            ? `
              <small class="time">${p.createdAt}</small>
              <div class="profile-actions">
                <button onclick="editProfile(${p.id})">Edit</button>
                <button onclick="deleteProfile(${p.id})">Delete</button>
              </div>
            `
            : `
              <button onclick="togglePublish(${p.id})"> ${p.published ? "Unpublish" : "Publish"}</button>
            `
        }

      </div>

    </div>
  `).join("");

  card.classList.remove("hidden");
}

  // Define categories for each role
  const categories = {
    contractor: [
      "Plumbing",
      "Electrical",
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
    ],
    technician: [
      "Electrical Technician",
      "Plumbing Technician",
      "HVAC Technician",
      "Carpentry Technician",
    ],
    supplier: [
      "Cement Supplier",
      "Steel Supplier",
      "Sand Supplier",
      "Equipment Supplier",
      "Tiles Supplier",
    ],
  };

  // Update category dropdown when role changes
  roleSelect.addEventListener("change", () => {
    const role = roleSelect.value;
    categorySelect.innerHTML =
      '<option value="">-- Select Category --</option>';

    if (categories[role]) {
      categories[role].forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.toLowerCase().replace(/\s+/g, "-");
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    }
  });
function togglePublish(id) {
  let list = JSON.parse(localStorage.getItem(PROFILE_STORE)) || [];
  const item = list.find(p => p.id === id);
  if (!item) return;

  item.published = true;

  localStorage.setItem(PROFILE_STORE, JSON.stringify(list));

  renderProfiles(list.filter(p => p.phone === item.phone));
}


  function deleteProfile(id) {
  let list = JSON.parse(localStorage.getItem(PROFILE_STORE)) || [];
  const login = JSON.parse(localStorage.getItem(LOGIN_KEY));

  list = list.filter(p => p.id !== id);
  localStorage.setItem(PROFILE_STORE, JSON.stringify(list));

  renderProfiles(list.filter(p => p.phone === login.phone));
}
function editProfile(id) {
  alert("Edit flow coming next step — profile id: " + id);
}


  async function fileToBase64(file) {
    // 🚫 BLOCK VIDEO STORAGE
    if (file.type.startsWith("video")) {
      alert("Videos cannot be stored locally. Please use image.");
      return "";
    }

    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => (img.src = e.target.result);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 600; // resize width
        const scale = max / img.width;

        canvas.width = max;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // compress to small jpeg
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };

      reader.readAsDataURL(file);
    });
  }
function loadSavedProfiles() {
  const list = JSON.parse(localStorage.getItem(PROFILE_STORE)) || [];
  const login = JSON.parse(localStorage.getItem(LOGIN_KEY));
  if (!login) return;

  const myProfiles = list.filter(p => p.phone === login.phone);

  if (myProfiles.length) {
    renderProfiles(myProfiles);
  }
}

  loadSavedProfiles();

  window.togglePublish = togglePublish;
  window.deleteProfile = deleteProfile;
  window.editProfile = editProfile;
});
















/*const PROFILE_STORE = "cb_public_profiles";
const LOGIN_KEY = "cb_login_user";

document.addEventListener("DOMContentLoaded", () => {

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

  const login = JSON.parse(localStorage.getItem(LOGIN_KEY));

  if (login && document.getElementById("profilePhone")) {
    document.getElementById("profilePhone").textContent = login.phone;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!login) {
      alert("Please login first");
      return;
    }

    const mediaFile = mediaInput.files[0];
    let mediaData = "";

    if (mediaFile) {
      mediaData = await fileToBase64(mediaFile);
    }

    const profile = {
      id: Date.now(),
      name: nameInput.value.trim(),
      role: roleSelect.value,
      category: categorySelect.value,
      experience: experienceInput.value,
      location: locationInput.value,
        state: stateInput.value,
        district: districtInput.value,
      description: descriptionInput.value,
      phone: login.phone,
      media: mediaData,
      mediaType:
        mediaFile && mediaFile.type.startsWith("video")
          ? "video"
          : "image",
      createdAt: new Date().toLocaleString(),
      published: true
    };

    saveProfile(profile);
    renderProfile(profile);
    form.reset();
  });

function saveProfile(profile) {
  try {
    const list = JSON.parse(localStorage.getItem(PROFILE_STORE)) || [];
    list.push(profile);
    localStorage.setItem(PROFILE_STORE, JSON.stringify(list));
  } catch (err) {
    if (err.name === "QuotaExceededError") {
      alert(" use smaller image size.");
    } else {
      console.error(err);
    }
  }
}


  function renderProfile(p) {
    if (!card) return;

    card.innerHTML = `
      <div class="profile-media">
        ${
          p.mediaType === "video"
            ? `<video src="${p.media}" controls></video>`
            : `<img src="${p.media}" />`
        }
      </div>

      <div class="profile-body">
        <h3>${p.name}</h3>
        <p>${p.role} , ${p.category}• ${p.experience} yrs</p>
        <p>${p.state},${p.district} , ${p.location}</p> 
        <p>${p.description}</p>
        <small>Created: ${p.createdAt}</small>

        <div class="profile-actions">
          <div>
            <a href="tel:${p.phone}">📞</a>
            <a href="https://wa.me/${p.phone.replace(/\D/g,'')}" target="_blank">🟢</a>
          </div>
          <div>
            <button onclick="togglePublish(${p.id})">Publish</button>
            <button onclick="deleteProfile(${p.id})">Delete</button>
          </div>
        </div>
      </div>
    `;

    card.classList.remove("hidden");
  }
 // Define categories for each role
  const categories = {
    contractor: [
      "Plumbing", "Electrical", "Carpentry", "Masonry", "Painting",
      "Roofing", "Flooring", "HVAC", "Landscaping", "Demolition",
      "Structural", "Marble & Tiles"
    ],
    technician: [
      "Electrical Technician", "Plumbing Technician", "HVAC Technician",
      "Carpentry Technician"
    ],
    supplier: [
      "Cement Supplier", "Steel Supplier", "Sand Supplier",
      "Equipment Supplier", "Tiles Supplier"
    ]
  };

  // Update category dropdown when role changes
  roleSelect.addEventListener("change", () => {
    const role = roleSelect.value;
    categorySelect.innerHTML = '<option value="">-- Select Category --</option>';

    if (categories[role]) {
      categories[role].forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.toLowerCase().replace(/\s+/g, "-");
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    }
  });

  function togglePublish(id) {
    const list = JSON.parse(localStorage.getItem(PROFILE_STORE)) || [];
    const item = list.find(p => p.id === id);
    if (!item) return;
    item.published = !item.published;
    localStorage.setItem(PROFILE_STORE, JSON.stringify(list));
  }

  function deleteProfile(id) {
    let list = JSON.parse(localStorage.getItem(PROFILE_STORE)) || [];
    list = list.filter(p => p.id !== id);
    localStorage.setItem(PROFILE_STORE, JSON.stringify(list));
    card.classList.add("hidden");
  }

  async function fileToBase64(file) {

  // 🚫 BLOCK VIDEO STORAGE
  if (file.type.startsWith("video")) {
    alert("Videos cannot be stored locally. Please use image.");
    return "";
  }

  return new Promise(resolve => {

    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => img.src = e.target.result;

    img.onload = () => {

      const canvas = document.createElement("canvas");
      const max = 600; // resize width
      const scale = max / img.width;

      canvas.width = max;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // compress to small jpeg
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };

    reader.readAsDataURL(file);
  });
}


  window.togglePublish = togglePublish;
  window.deleteProfile = deleteProfile;
});
*/
