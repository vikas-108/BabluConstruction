let PROJECT_CACHE = [];
document.addEventListener("DOMContentLoaded", () => {
  // let projectCounter = 3; // start from last existing project ID
  const API_BASE = "https://api.buildskil.com/api/projects";
  const SERVER_BASE = "https://api.buildskil.com";
  const ACCESSIBLE_API = "https://api.buildskil.com/api/projects/accessible";
  function authHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem("cb_token")}`,
    };
  }
  const EXPIRY_RULES = {
    hours: 2, // delete after 2 hours
    days: 7, // delete after 7 days
    months: 1, // delete after 1 month
  };
  let currentImages = [];
  let currentIndex = 0;
  window.showAddForm = function () {
    document.getElementById("addForm").style.display = "flex";
  };

  window.hideAddForm = function () {
    document.getElementById("addForm").style.display = "none";
    document.getElementById("clientName").value = "";
    document.getElementById("projectName").value = "";
    document.getElementById("clientPhone").value = "";
    document.getElementById("clientPhone2").value = "";
    // document.querySelector("#addForm form").reset();
  };
  // Load only projects accessible to the user
  async function loadAccessibleProjects() {
    const res = await fetch(ACCESSIBLE_API, {
      headers: authHeaders(),
    });

    const projects = await res.json();

    const tableBody = document.getElementById("projectTableBody");
    projects.forEach((p) => {
      if (p.canDelete) return; // skip creator projects
      // ⭐ add to cache for dropdown
      if (!PROJECT_CACHE.find((x) => x._id === p._id)) {
        PROJECT_CACHE.push(p);
      }
      const deleteBtn = p.canDelete
        ? `<button class="delete-btn"
         onclick="deleteProject('${p._id}')">
         Delete
         </button>`
        : "";

      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${p.clientName}</td>
      <td>${p.projectName}</td>
      <td>${p.projectCode}</td>

      <td class="action-buttons">
        <button class="view-btn"
        onclick="openModal('${p._id}')">
        View
        </button>

        ${deleteBtn}
      </td>
    `;

      tableBody.appendChild(row);
    });
  }
  // Load projects and populate table
  async function loadProjects() {
    const res = await fetch(API_BASE, {
      headers: authHeaders(),
    });

    const projects = await res.json();
    PROJECT_CACHE = projects; // ⭐ FIX: cache the loaded projects for dropdown and other uses
    const tableBody = document.getElementById("projectTableBody");
    tableBody.innerHTML = "";
    projects.forEach((p) => {
      const row = document.createElement("tr");

      row.dataset.id = p._id;

      row.innerHTML = `
      <td>${p.clientName}</td>
      <td>${p.projectName}</td>
      <td>${p.projectCode}</td>

      <td class="action-buttons">
        <button class="view-btn"
        onclick="openModal('${p._id}')">
        View
        </button>

        <button class="delete-btn"
        onclick="deleteProject('${p._id}')">
        Delete
        </button>
      </td>
    `;

      tableBody.appendChild(row);
    });
  }
  async function initProjects() {
    const tableBody = document.getElementById("projectTableBody");
    tableBody.innerHTML = "";
    PROJECT_CACHE = []; // ⭐ reset cache
    await loadProjects(); // creator
    await loadAccessibleProjects(); // viewer

    updateProjectDropdown();
  }

  initProjects();
  window.createProject = async function () {
    const clientName = document.getElementById("clientName").value.trim();
    const projectName = document.getElementById("projectName").value.trim();
    const clientPhone = document.getElementById("clientPhone").value.trim();
    const clientPhone2 = document.getElementById("clientPhone2").value.trim();
    if (!clientName || !projectName || !clientPhone) {
      alert("Please enter Client Name, Project Name, and Phone Number.");
      return;
    }

    if (!/^\d{10}$/.test(clientPhone)) {
      alert(" phone numbers must be exactly 10 digits.");
      return;
    }
    /**
  if (!/^\d{10}$/.test(clientPhone)) {
  alert("Phone number must be exactly 10 digits.");
  return;
}

if (!/^\d{10}$/.test(clientPhone2)) {
  alert("Alternate phone number must be exactly 10 digits.");
  return;
}

  */
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        clientName,
        projectName,
        clientPhone,
        clientPhone2,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json(); // read backend error
      alert(errorData.message || "Project create failed");
      return;
    }
    const newProject = await res.json(); // 👈 server should return the created project

    // Add to cache
    PROJECT_CACHE.push(newProject);

    // Add to table immediately
    const tableBody = document.getElementById("projectTableBody");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${newProject.clientName}</td>
    <td>${newProject.projectName}</td>
    <td>${newProject.projectCode}</td>
    <td class="action-buttons">
      <button class="view-btn" onclick="openModal('${newProject._id}')">View</button>
      <button class="delete-btn" onclick="deleteProject('${newProject._id}')">Delete</button>
    </td>
  `;
    tableBody.insertBefore(row, tableBody.firstChild);

    // Update dropdown too
    updateProjectDropdown();

    hideAddForm();
    //await loadProjects();
  };
  // --- Upload Form ---
  window.showUploadForm = function () {
    document.getElementById("uploadForm").style.display = "block";
    updateProjectDropdown();
  };

  window.hideUploadForm = function () {
    document.getElementById("uploadForm").style.display = "none";
    document.getElementById("fileInput").value = "";
  };

  function updateProjectDropdown() {
    const select = document.getElementById("projectSelect");
    select.innerHTML = "";

    if (!PROJECT_CACHE.length) {
      const option = document.createElement("option");
      option.textContent = "No projects available";
      option.disabled = true;
      select.appendChild(option);
      return;
    }

    PROJECT_CACHE.forEach((p) => {
      const option = document.createElement("option");

      option.value = p._id;
      option.textContent = p.projectCode; // 👈 this shows BRG-001 etc

      select.appendChild(option);
    });
  }
  window.saveUpload = async function () {
    const projectId = document.getElementById("projectSelect").value;
    const files = document.getElementById("fileInput").files;

    if (!projectId || files.length === 0) {
      alert("Please select a project and upload at least one file.");
      return;
    }
    // Restrict to max 5 files
    if (files.length > 5) {
      alert("You can upload a maximum of 5 files at a time.");
      return;
    }

    const formData = new FormData();

    for (let file of files) {
      const isImage = file.type.startsWith("image");
      const isVideo = file.type.startsWith("video");

      // image limit 2MB
      if (isImage) {
      // Toaster if >3MB
      if (file.size > 3 * 1024 * 1024) {
        showToast(`Image "${file.name}" is larger than 3MB, compressing...`, "warning");
      }

      // Compress image before upload
      file = await compressImage(file, 1024, 0.7);

      // Final check: reject if still >2MB
      if (file.size > 2 * 1024 * 1024) {
        showToast(`Image "${file.name}" is too large even after compression (max 2MB)`, "error");
        return;
      }
    }

    if (isVideo) {
      console.log(
        `Video "${file.name}" size: ${(file.size / 1024).toFixed(2)} KB`
      );
      if (file.size > 10 * 1024 * 1024) {
        showToast(`Video "${file.name}" is too large (max 10MB)`, "error");
        return;
      }
    }
      formData.append("media", file);
    }
    await fetch(`${API_BASE}/${projectId}/media`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });
    showToast("Files uploaded successfully!", "success");
    hideUploadForm();
  };
async function compressImage(file, maxWidth = 1024, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, { type: "image/jpeg" });

          // Log sizes in KB
          console.log(
            `Image "${file.name}" original size: ${(file.size / 1024).toFixed(2)} KB`
          );
          console.log(
            `Image "${file.name}" compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`
          );

          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

  // Modal functions
  window.openModal = async function (projectId) {
    const res = await fetch(`${API_BASE}/${projectId}/media`, {
      headers: authHeaders(),
    });

    const media = await res.json();

    currentImages = media.map((m) => ({
      url: SERVER_BASE + m.url,
      type: m.type,
      timestamp: m.timestamp,
    }));

    if (currentImages.length === 0) {
      alert("No media yet");
      return;
    }

    currentIndex = 0;

    updateSlider();

    document.getElementById("imageModal").style.display = "flex";
  };
  function updateSlider() {
    const img = document.getElementById("sliderImage");
    const video = document.getElementById("sliderVideo");
    const videoSource = document.getElementById("videoSource");
    const counter = document.getElementById("imageCount");
    const uploadInfo = document.getElementById("uploadInfo");
    const media = currentImages[currentIndex];
    // Reset
    img.classList.remove("active");
    video.classList.remove("active");
    video.pause();

    if (media.type === "video") {
      videoSource.src = media.url;
      video.load();
      video.classList.add("active");
    } else {
      img.src = media.url;
      img.classList.add("active");
    }

    counter.innerText = `${currentIndex + 1} / ${currentImages.length}`;
    //uploadInfo.innerText = `Uploaded on: ${media.timestamp.toLocaleString()}`;
    uploadInfo.innerText = `Uploaded on: ${new Date(media.timestamp).toLocaleString()}`;
  }

  window.nextImage = function () {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateSlider();
  };

  window.prevImage = function () {
    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateSlider();
  };

  window.overlayClose = function (e) {
    if (e.target.id === "imageModal") {
      closeModal();
    }
  };
  function cleanExpiredMedia(projectId) {
    const now = Date.now();
    projectImages[projectId] = projectImages[projectId].filter((media) => {
      const ageHours = (now - media.timestamp) / (1000 * 60 * 60);
      const ageDays = ageHours / 24;
      const ageMonths = ageDays / 30;

      // Example: delete if older than 7 days
      if (ageDays > EXPIRY_RULES.days) {
        return false; // remove
      }
      return true; // keep
    });
  }
  // Keyboard support
  document.addEventListener("keydown", function (e) {
    const modal = document.getElementById("imageModal");
    if (modal.style.display === "flex") {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeModal();
    }
  });
  window.closeModal = function () {
    document.getElementById("imageModal").style.display = "none";

    const video = document.getElementById("sliderVideo");
    if (video) video.pause();
  };
  // Search filter
  window.filterProjects = function () {
    const input = document.getElementById("projectSearch");
    const filter = input.value.toUpperCase();
    const table = document.querySelector(".project-table");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      let matchFound = false;

      for (let j = 0; j < 3; j++) {
        if (cells[j]) {
          const textValue = cells[j].textContent || cells[j].innerText;
          if (textValue.toUpperCase().indexOf(filter) > -1) {
            matchFound = true;
            break;
          }
        }
      }
      rows[i].style.display = matchFound ? "" : "none";
    }
  };
  // Toast notification
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }
  window.deleteProject = async function (id) {
    if (!confirm("Delete this project?")) return;

    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || "Delete failed");
      return;
    }

    // remove from cache
    PROJECT_CACHE = PROJECT_CACHE.filter((p) => p._id !== id);

    // remove correct row using dataset
    const row = document.querySelector(`#projectTableBody tr[data-id="${id}"]`);

    if (row) {
      row.remove();
    }

    // refresh dropdown
    updateProjectDropdown();
    await loadProjects(); // refresh table to reflect changes
    await loadAccessibleProjects(); // refresh accessible projects too
  };
  //loadProjects();
});
