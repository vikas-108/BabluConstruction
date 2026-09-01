//const API_BASE = window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000/api";
const API_BASE = window.APP_CONFIG?.API_BASE_URL;
const TOKEN_KEY = window.APP_CONFIG?.AUTH_TOKEN_KEY;

/* ============================================================
   STATE
============================================================ */

let projects = [];

let selectedProject = null;

let selectedFiles = [];

let projectMedia = [];

let sharedPhones = [];
let myProjects = [];
let sharedProjects = [];

let currentProjectList = "mine";
/* ============================================================
   CONFIG
============================================================ */
const DB_NAME = "buildskilLocalProjects";

const DB_VERSION = 1;

const PROJECT_STORE = "projects";

const MEDIA_CACHE = "buildskil-project-media-v1";

const MAX_IMAGE_MB = 10;

const MAX_VIDEO_MB = 100;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

/* ============================================================
   ELEMENTS
============================================================ */

const projectPage = document.getElementById("projectPage");

const mediaPage = document.getElementById("mediaPage");

const projectsList = document.getElementById("projectsList");

const projectsEmpty = document.getElementById("projectsEmpty");

const projectSearch = document.getElementById("projectSearch");

const projectOverlay = document.getElementById("projectOverlay");

const projectNameInput = document.getElementById("projectNameInput");

//const projectCodeInput = document.getElementById("projectCodeInput");

const clientNameInput = document.getElementById("clientNameInput");

const projectFormError = document.getElementById("projectFormError");

const mediaInput = document.getElementById("mediaInput");

const dropZone = document.getElementById("dropZone");

const previewSection = document.getElementById("previewSection");

const previewList = document.getElementById("previewList");

const mediaGrid = document.getElementById("mediaGrid");

const mediaEmpty = document.getElementById("mediaEmpty");

const mediaCount = document.getElementById("mediaCount");

const shareOverlay = document.getElementById("shareOverlay");

const sharePhoneInput = document.getElementById("sharePhoneInput");

const shareFormError = document.getElementById("shareFormError");

const shareList = document.getElementById("shareList");

const viewer = document.getElementById("viewer");

const viewerContent = document.getElementById("viewerContent");

const toast = document.getElementById("toast");

/* ============================================================
   GENERAL HELPERS
============================================================ */

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index ? 1 : 0,
  )} ${units[index]}`;
}

function formatDateTime(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/* ============================================================
   INDEXED DB
============================================================ */

async function loadProjects() {
  const token = getToken();

  if (!token) {
    showToast("Please log in first.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE}/construction-projects/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Could not load projects.");
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("LOAD PROJECTS ERROR:", error);

    showToast(error.message || "Could not load projects.");

    return [];
  }
}
async function showMyProjects() {
  currentProjectList = "mine";

  document.getElementById("myProjectsTab")?.classList.add("active");

  document.getElementById("sharedProjectsTab")?.classList.remove("active");

  myProjects = await loadProjects();

  projects = [...myProjects];

  renderProjects();
}

async function showSharedProjects() {
  currentProjectList = "shared";

  document.getElementById("sharedProjectsTab")?.classList.add("active");

  document.getElementById("myProjectsTab")?.classList.remove("active");

  sharedProjects = await loadSharedProjects();

  projects = [...sharedProjects];

  renderProjects();
}

document
  .getElementById("myProjectsTab")
  ?.addEventListener("click", showMyProjects);

document
  .getElementById("sharedProjectsTab")
  ?.addEventListener("click", showSharedProjects);

async function deleteProject(project) {
  // 1. Validate the object before reading project.name
  if (!project || typeof project !== "object") {
    console.error("DELETE PROJECT: Invalid project object:", project);

    showToast("Project information is missing.");
    return;
  }

  // 2. Use the real MongoDB ID
  const projectId = project._id || project.id;

  if (!projectId) {
    console.error("DELETE PROJECT: Missing project ID:", project);

    showToast("Project ID is missing.");
    return;
  }

  const projectName = project.name || "this project";

  const confirmed = window.confirm(`Delete "${projectName}"?`);

  if (!confirmed) {
    return;
  }

  const token = getToken();

  if (!token) {
    showToast("Please log in first.");
    return;
  }

  try {
    console.log("DELETE PROJECT:", {
      projectId,
      projectName,
    });

    const response = await fetch(
      `${API_BASE}/construction-projects/${encodeURIComponent(projectId)}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Could not delete project.");
    }

    /*
     * Remove from My Projects.
     */
    myProjects = myProjects.filter(
      (item) => String(item._id || item.id) !== String(projectId),
    );

    /*
     * Remove from Shared Projects too,
     * in case it is present there.
     */
    sharedProjects = sharedProjects.filter(
      (item) => String(item._id || item.id) !== String(projectId),
    );

    /*
     * Rebuild currently visible list.
     */
    projects =
      currentProjectList === "shared" ? [...sharedProjects] : [...myProjects];

    renderProjects();

    showToast("Project deleted successfully.");
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);

    showToast(error.message || "Could not delete project.");
  }
}
/* ============================================================
   PROJECT VALIDATION
============================================================ */
/*
function normalizeProjectCode(value) { return String(value || "").trim().toUpperCase().replace(/\s+/g, "-");}*/

function validateProjectForm() {
  const name = projectNameInput.value.trim();

  //const code = normalizeProjectCode(projectCodeInput.value);

  const client = clientNameInput.value.trim();

  if (name.length < 2) {
    return "Project name must contain at least 2 characters.";
  }

  //if (!/^[A-Z0-9_-]{2,30}$/.test(code)) { return "Project code can contain letters, numbers, - and _ only.";}

  if (client.length < 2) {
    return "Client name must contain at least 2 characters.";
  }

  /*const duplicate = projects.some((project) => project.code === code);

  if (duplicate) {
    return "This project code already exists.";
  }*/

  return null;
}

/* ============================================================
   PROJECT RENDERING
============================================================ */

function renderProjects() {
  const query = projectSearch.value.trim().toLowerCase();

  const filtered = projects.filter((project) => {
    const text = [project.name, project.code, project.clientName]
      .join(" ")
      .toLowerCase();

    return text.includes(query);
  });

  projectsList.innerHTML = "";

  projectsEmpty.style.display = filtered.length ? "none" : "block";

  filtered.forEach((project) => {
    // ✅ DEFINE THIS BEFORE USING isOwner
    const isOwner = currentProjectList === "mine";
    const card = document.createElement("article");

    card.className = "project-card";
    card.innerHTML = `
  <div class="project-card-top">

    <div class="project-icon">
      🏠
    </div>

    <div class="project-info">

      <div class="project-name">
        ${escapeHTML(project.name)}
      </div>

      <div class="project-code">
        ${escapeHTML(project.code || "")}
      </div>

      <div class="project-client">
        Client:
        ${escapeHTML(project.clientName || "")}
      </div>

      ${
        !isOwner && project.user
          ? `
            <div class="project-client">
              Shared by:
              ${escapeHTML(project.user.name || project.user.phone || "")}
            </div>
          `
          : ""
      }

    </div>

  </div>

  <div class="project-meta">

    <span>
      📅 ${formatDateTime(project.createdAt)}
    </span>

    <span>
      📷 ${Number(project.mediaCount || 0)} media
    </span>

  </div>

  <div class="project-actions">

    <button
      type="button"
      class="btn btn-primary open-project">
      Open
    </button>

    ${
      isOwner
        ? `
          <button
            type="button"
            class="btn btn-secondary share-project">
            Share
          </button>

          <button
            type="button"
            class="btn btn-danger delete-project">
            Delete
          </button>
        `
        : `
          <!--button
            type="button"
            class="btn btn-secondary remove-shared-project">
            Remove
          </button -->
        `
    }

  </div>
`;
    card
      .querySelector(".open-project")
      ?.addEventListener("click", () => openProject(project));

    card
      .querySelector(".share-project")
      ?.addEventListener("click", () => openShareForProject(project));

    card
      .querySelector(".delete-project")
      ?.addEventListener("click", () => deleteProject(project));
    /*/ REMOVE — shared user
    card
      .querySelector(".remove-shared-project")
      ?.addEventListener("click", () => removeSharedProject(project));*/
    projectsList.appendChild(card);
  });
}
/*/shared user can remove shared projects
async function removeSharedProject(project) {
  if (!project?._id) {
    showToast("Project ID is missing.");
    return;
  }

  const confirmed = window.confirm(
    `Remove "${project.name}" from Shared With Me?`,
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/construction-projects/${encodeURIComponent(
        project._id,
      )}/leave`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Could not remove shared project.");
    }

    sharedProjects = sharedProjects.filter(
      (item) => String(item._id) !== String(project._id),
    );

    projects = [...sharedProjects];

    renderProjects();

    showToast("Project removed from Shared With Me.");
  } catch (error) {
    console.error("REMOVE SHARED PROJECT ERROR:", error);

    showToast(error.message || "Could not remove shared project.");
  }
}*/
/* ============================================================
   ADD PROJECT
============================================================ */
function openShareForProject(project) {
  selectedProject = project;

  sharedPhones = Array.isArray(project.sharedWith)
    ? project.sharedWith
        .map((item) => String(item.phone || "").replace(/\D/g, ""))
        .filter(Boolean)
    : [];

  renderShareList();

  sharePhoneInput.value = "";
  shareFormError.textContent = "";

  shareOverlay.classList.add("show");

  shareOverlay.setAttribute("aria-hidden", "false");
}
function openProjectModal() {
  projectNameInput.value = "";
  //projectCodeInput.value = "";
  clientNameInput.value = "";

  projectFormError.textContent = "";

  projectOverlay.classList.add("show");

  projectOverlay.setAttribute("aria-hidden", "false");

  setTimeout(() => projectNameInput.focus(), 50);
}

function closeProjectModal() {
  projectOverlay.classList.remove("show");

  projectOverlay.setAttribute("aria-hidden", "true");
}

async function addProject() {
  const name = projectNameInput.value.trim();

  const clientName = clientNameInput.value.trim();

  projectFormError.textContent = "";

  if (name.length < 2) {
    projectFormError.textContent =
      "Project name must contain at least 2 characters.";
    return;
  }

  if (clientName.length < 2) {
    projectFormError.textContent =
      "Client name must contain at least 2 characters.";
    return;
  }

  const token = getToken();

  if (!token) {
    projectFormError.textContent = "Please log in first.";
    return;
  }

  const saveBtn = document.getElementById("saveProjectBtn");

  saveBtn.disabled = true;
  saveBtn.textContent = "Creating...";

  try {
    const response = await fetch(`${API_BASE}/construction-projects`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        name,
        clientName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Could not create project.");
    }

    const project = data.data;

    myProjects = [project, ...myProjects];

    if (currentProjectList === "mine") {
      projects = [...myProjects];

      renderProjects();
    }

    closeProjectModal();

    showToast("Project created successfully.");

    openProject(project);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    projectFormError.textContent = error.message || "Could not create project.";
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Add Project";
  }
}

/* ============================================================
   OPEN PROJECT
============================================================ */

async function openProject(project) {
  selectedProject = project;

  projectPage.classList.add("hidden");

  mediaPage.classList.remove("hidden");

  document.getElementById("selectedProjectName").textContent = project.name;

  document.getElementById("selectedProjectMeta").textContent =
    `${project.code} · Client: ${project.clientName}`;

  selectedFiles = [];

  renderSelectedFiles();
  /*
  sharedPhones = Array.isArray(project.sharedPhones)
    ? [...project.sharedPhones]
    : [];
*/
  sharedPhones = Array.isArray(project.sharedWith)
    ? project.sharedWith
        .map((item) => String(item.phone || "").replace(/\D/g, ""))
        .filter(Boolean)
    : [];

  renderShareList();
  projectMedia = [];

  /*
      Media loading uses your backend.
      Local cache is used when available.
    */

  await loadProjectMedia();
}

/* ============================================================
   CLOSE PROJECT
============================================================ */

function closeProject() {
  selectedProject = null;

  mediaPage.classList.add("hidden");

  projectPage.classList.remove("hidden");

  renderProjects();
}

/* ============================================================
   FILE VALIDATION
============================================================ */

function validateMediaFile(file) {
  if (!file) {
    return "Invalid file.";
  }

  const isImage = IMAGE_TYPES.includes(file.type);

  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return `${file.name} is not a supported file.`;
  }

  const maxSize = isImage
    ? MAX_IMAGE_MB * 1024 * 1024
    : MAX_VIDEO_MB * 1024 * 1024;

  if (file.size > maxSize) {
    return `${file.name} is larger than the allowed limit.`;
  }

  return null;
}

/* ============================================================
   IMAGE COMPRESSION
============================================================ */

async function compressImage(file) {
  if (!IMAGE_TYPES.includes(file.type)) {
    return file;
  }

  const bitmap = await createImageBitmap(file);

  const maxWidth = 2200;
  const maxHeight = 2200;

  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);

  const width = Math.round(bitmap.width * scale);

  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");

  canvas.width = width;

  canvas.height = height;

  const ctx = canvas.getContext("2d", {
    alpha: false,
  });

  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );

  bitmap.close();

  if (!blob) {
    return file;
  }

  return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

/* ============================================================
   VIDEO
============================================================ */

/*
  Do not fake video compression by only changing the filename.

  A real browser-side video compressor requires
  WebCodecs or an FFmpeg/WebAssembly pipeline.
*/

async function prepareMedia(file) {
  if (file.type.startsWith("image/")) {
    return compressImageForUpload(file);
  }

  if (file.type.startsWith("video/")) {
    return compressVideoForUpload(file);
  }

  return file;
}

/* ============================================================
   ADD FILES
============================================================ */

async function addFiles(fileList) {
  const files = Array.from(fileList || []);

  for (const file of files) {
    const error = validateMediaFile(file);

    if (error) {
      showToast(error);

      continue;
    }

    try {
      const prepared = await prepareMedia(file);

      selectedFiles.push({
        id: crypto.randomUUID(),

        originalFile: file,

        file: prepared,

        previewUrl: URL.createObjectURL(prepared),
          comment: ""
      });
    } catch (error) {
      console.error("PREPARE MEDIA ERROR:", error);

      showToast(`Could not prepare ${file.name}`);
    }
  }

  renderSelectedFiles();
}

/* ============================================================
   SELECTED FILES
============================================================ */

function renderSelectedFiles() {
  previewList.innerHTML = "";

  if (!selectedFiles.length) {
    previewSection.classList.remove("show");

    return;
  }

  previewSection.classList.add("show");

  selectedFiles.forEach((item) => {
    const card = document.createElement("div");

    card.className = "preview-item";

    const isImage = item.file.type.startsWith("image/");

    card.innerHTML = `
                ${
                  isImage
                    ? `<img
                            src="${item.previewUrl}"
                            class="preview-media"
                            alt="">`
                    : `<video
                            src="${item.previewUrl}"
                            class="preview-media"
                            muted
                            controls>
                           </video>`
                }

                <div class="preview-name">
                    ${escapeHTML(item.file.name)}
                </div>

                <div class="preview-size">
                    ${formatBytes(item.file.size)}
                </div>
<div class="preview-comment-group">

        <label
          class="preview-comment-label">
          Comment
          <span>(optional)</span>
        </label>

        <textarea
          class="form-control preview-comment"
          maxlength="1000"
          rows="3"
          placeholder="Write something about this photo/video..."></textarea>

        <div class="comment-counter">
          0 / 1000
        </div>

      </div>
                <button
                    type="button"
                    class="btn btn-secondary preview-remove">
                    Remove
                </button>
            `;
              /* ---------------------------------------------
       COMMENT
    --------------------------------------------- */

    const commentInput =
      card.querySelector(
        ".preview-comment"
      );

    const counter =
      card.querySelector(
        ".comment-counter"
      );

    if (commentInput) {

      commentInput.value =
        item.comment || "";

      if (counter) {
        counter.textContent =
          `${commentInput.value.length} / 1000`;
      }

      commentInput.addEventListener(
        "input",
        () => {

          item.comment =
            commentInput.value
              .slice(0, 1000);

          if (counter) {
            counter.textContent =
              `${item.comment.length} / 1000`;
          }
        }
      );
    }
    card.querySelector(".preview-remove").addEventListener("click", () => {
      URL.revokeObjectURL(item.previewUrl);

      selectedFiles = selectedFiles.filter(
        (selected) => selected.id !== item.id,
      );

      renderSelectedFiles();
    });

    previewList.appendChild(card);
  });
}

/* ============================================================
   UPLOAD TO BACKEND
============================================================ */
async function uploadSelectedFiles() {
  if (!selectedProject?._id) {
    showToast("Select a project first.");

    return;
  }

  if (!selectedFiles.length) {
    showToast("Select at least one file.");

    return;
  }

  const token = getToken();

  if (!token) {
    showToast("Please log in first.");

    return;
  }

  const button = document.getElementById("uploadSelectedBtn");

  button.disabled = true;

  try {
    for (let i = 0; i < selectedFiles.length; i++) {
      const item = selectedFiles[i];

      const formData = new FormData();

      formData.append("media", item.file);
        formData.append(
  "comment",
  item.comment || ""
);
      button.textContent = `Uploading ${i + 1}/${selectedFiles.length}...`;

      const response = await fetch(
        `${API_BASE}/construction-media/projects/${encodeURIComponent(selectedProject._id)}/media`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Upload failed (${response.status})`);
      }
    }

    selectedFiles.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });

    selectedFiles = [];

    renderSelectedFiles();

    showToast("Media uploaded successfully.");

    await loadProjectMedia();
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    showToast(error.message || "Upload failed.");
  } finally {
    button.disabled = false;

    button.textContent = "Upload";
  }
}

/* ============================================================
   LOAD MEDIA
============================================================ */

async function loadProjectMedia() {
  if (!selectedProject?._id) {
    return;
  }

  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE}/construction-media/projects/${encodeURIComponent(selectedProject._id)}/media`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Could not load media.");
    }

    projectMedia = Array.isArray(data.data) ? data.data : [];

    renderMedia();

    // Cache every online media item
    for (const media of projectMedia) {
      await cacheSingleMedia(media, true);
    }
  } catch (error) {
    console.error("LOAD MEDIA ERROR:", error);

    const cached = await getCachedProjectMedia();

    if (cached.length) {
      projectMedia = cached;

      renderMedia();

      showToast("Showing media saved on this device.");

      return;
    }

    showToast("Media could not be loaded.");
  }
}
async function compressImageForUpload(file) {
  const bitmap = await createImageBitmap(file);

  const MAX_WIDTH = 2200;
  const MAX_HEIGHT = 2200;

  let width = bitmap.width;
  let height = bitmap.height;

  const scale = Math.min(1, MAX_WIDTH / width, MAX_HEIGHT / height);

  width = Math.round(width * scale);

  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");

  canvas.width = width;

  canvas.height = height;

  const ctx = canvas.getContext("2d", {
    alpha: false,
  });

  ctx.imageSmoothingEnabled = true;

  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(bitmap, 0, 0, width, height);

  bitmap.close();

  /*
   * Try several WebP qualities.
   * Stop when the image is reasonably
   * compressed.
   */

  const qualities = [0.84, 0.8, 0.76, 0.72, 0.68, 0.64];

  let bestBlob = null;

  for (const quality of qualities) {
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );

    if (!blob) {
      continue;
    }

    bestBlob = blob;

    /*
     * Target:
     * approximately <= 3 MB
     *
     * This is well below
     * your 10 MB backend limit.
     */

    if (blob.size <= 3 * 1024 * 1024) {
      break;
    }
  }

  if (!bestBlob) {
    return file;
  }

  return new File([bestBlob], file.name.replace(/\.[^.]+$/, ".webp"), {
    type: "image/webp",

    lastModified: Date.now(),
  });
}

/* ============================================================
   RENDER MEDIA
============================================================ */

function renderMedia() {
  mediaGrid.innerHTML = "";

  const list = projectMedia || [];

  mediaCount.textContent = `${list.length} ${
    list.length === 1 ? "item" : "items"
  }`;

  mediaEmpty.style.display = list.length ? "none" : "block";

  list.forEach((item, index) => {
    const card = document.createElement("article");

    card.className = "media-card";

    const url = item.url || item.secure_url || item.media;

    const type = item.mediaType || item.type || detectMediaType(url);

    const id = item._id || item.id || `media-${index}`;

    const uploaderPhone = item.uploaderPhone || item.uploadedBy?.phone || "—";

    const uploadedAt = item.uploadedAt || item.createdAt || item.date;

    card.innerHTML = `

                <div class="media-visual">

                    ${
                      type === "video"
                        ? `<video
                                src="${escapeHTML(url)}"
                                muted
                                preload="metadata">
                               </video>`
                        : `<img
                                src="${escapeHTML(url)}"
                                alt="Project media"
                                loading="lazy">`
                    }

                    ${
                      type === "video"
                        ? `<span class="media-badge">
                                VIDEO
                               </span>`
                        : ""
                    }

                    ${
                      item.localCached
                        ? `<span class="offline-badge">
                                Offline
                               </span>`
                        : ""
                    }

                </div>


                <div class="media-body">

                    <div class="media-name">
                        ${escapeHTML(
                          item.fileName || item.name || "Project media",
                        )}
                    </div>


                    <div class="media-meta">

                        <span>
                            📅
                            ${escapeHTML(formatDateTime(uploadedAt))}
                        </span>

                        <span>
                            📱
                            ${escapeHTML(uploaderPhone)}
                        </span>

                    </div>
${
  item.comment
    ? `
      <div class="media-comment">
        ${escapeHTML(item.comment)}
      </div>
    `
    : ""
}

                    <div class="media-actions">

                        <button
                            type="button"
                            class="btn btn-secondary view-media">
                            View
                        </button>

                        <button
                            type="button"
                            class="btn btn-secondary keep-media">
                            Offline
                        </button>

                        <button
                            type="button"
                            class="btn btn-danger delete-media">
                            Delete
                        </button>

                    </div>

                </div>
            `;

    card
      .querySelector(".view-media")
      .addEventListener("click", () => openViewer(url, type));

    card
      .querySelector(".keep-media")
      .addEventListener("click", () => cacheSingleMedia(item));

    card
      .querySelector(".delete-media")
      .addEventListener("click", () => deleteMedia(id));

    mediaGrid.appendChild(card);
  });
}

/* ============================================================
   MEDIA TYPE
============================================================ */

function detectMediaType(url) {
  if (!url) {
    return "image";
  }

  const clean = String(url).split("?")[0].toLowerCase();

  if (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov")
  ) {
    return "video";
  }

  return "image";
}

/* ============================================================
   CACHE MEDIA
============================================================ */

async function cacheSingleMedia(item) {
  try {
    if (!selectedProject?._id) {
      throw new Error("Project ID is missing.");
    }

    const url = item.url || item.secure_url || item.media;

    const id = item._id || item.id;

    if (!url || !id) {
      throw new Error("Media information is missing.");
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to download media.");
    }

    const cache = await caches.open(MEDIA_CACHE);

    const cacheKey = `/buildskil-local/${selectedProject._id}/${id}`;

    await cache.put(cacheKey, response.clone());

    item.localCached = true;

    renderMedia();

    showToast("Media saved on this device.");
  } catch (error) {
    console.error("CACHE ERROR:", error);

    showToast(error.message || "Could not save local copy.");
  }
}

async function cacheProjectMedia(list) {
  for (const item of list) {
    try {
      const url = item.url || item.secure_url || item.media;

      const id = item._id || item.id;

      if (!url || !id) {
        continue;
      }

      const response = await fetch(url);

      if (!response.ok) {
        continue;
      }

      const cache = await caches.open(MEDIA_CACHE);

      const cacheKey = `/buildskil-local/${selectedProject._id}/${id}`;

      await cache.put(cacheKey, response);
    } catch (error) {
      console.warn("CACHE PROJECT MEDIA ERROR:", error);
    }
  }
}

/* ============================================================
   READ LOCAL MEDIA
============================================================ */

async function getCachedProjectMedia() {
  const result = [];

  try {
    const cache = await caches.open(MEDIA_CACHE);

    const requests = await cache.keys();

    const prefix = `/buildskil-local/${selectedProject._id}/`;

    for (const request of requests) {
      if (!request.url.includes(prefix)) {
        continue;
      }

      const response = await cache.match(request);

      if (!response) {
        continue;
      }

      const blob = await response.blob();

      const localUrl = URL.createObjectURL(blob);

      result.push({
        _id: request.url.split("/").pop(),

        id: request.url.split("/").pop(),

        url: localUrl,

        mediaType: blob.type.startsWith("video/") ? "video" : "image",

        localCached: true,

        createdAt: new Date().toISOString(),

        uploaderPhone: "Local copy",
      });
    }
  } catch (error) {
    console.error("READ CACHE ERROR:", error);
  }

  return result;
}

/* ============================================================
   DELETE MEDIA
============================================================ */
async function deleteMedia(mediaId) {
  if (!selectedProject?._id) {
    showToast("Project ID is missing.");
    return;
  }

  if (!mediaId) {
    showToast("Media ID is missing.");
    return;
  }

  if (!window.confirm("Delete this media?")) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/construction-media/projects/${encodeURIComponent(
        selectedProject._id,
      )}/media/${encodeURIComponent(mediaId)}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Delete failed.");
    }

    projectMedia = projectMedia.filter(
      (item) => String(item._id || item.id) !== String(mediaId),
    );

    renderMedia();

    showToast("Media deleted.");
  } catch (error) {
    console.error("DELETE MEDIA ERROR:", error);

    showToast(error.message || "Could not delete media.");
  }
}

/* ============================================================
   SHARE
============================================================ */

function validatePhone(value) {
  return /^[6-9]\d{9}$/.test(value);
}

async function shareProject() {
  if (!selectedProject?._id) {
    return;
  }

  const phone = sharePhoneInput.value.replace(/\D/g, "").slice(0, 10);

  sharePhoneInput.value = phone;
  shareFormError.textContent = "";

  // Validate phone
  if (!validatePhone(phone)) {
    shareFormError.textContent = "Enter a valid 10-digit Indian mobile number.";
    return;
  }

  // Prevent duplicate locally
  if (sharedPhones.includes(phone)) {
    shareFormError.textContent = "This number is already shared.";
    return;
  }

  const token = getToken();

  if (!token) {
    shareFormError.textContent = "Please log in first.";
    return;
  }

  const button = document.getElementById("confirmShareBtn");

  button.disabled = true;
  button.textContent = "Sharing...";

  try {
    const response = await fetch(
      `${API_BASE}/construction-projects/${encodeURIComponent(
        selectedProject._id,
      )}/share`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          phone,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Could not share project.");
    }

    /*
     * Backend returns the updated project:
     *
     * {
     *   success: true,
     *   data: project
     * }
     */

    const updatedProject = data.data || data.project;

    if (updatedProject) {
      selectedProject = updatedProject;

      /*
       * Backend field:
       * sharedWith: [
       *   {
       *     user: "...",
       *     phone: "8888888888",
       *     sharedAt: "..."
       *   }
       * ]
       */

      sharedPhones = Array.isArray(updatedProject.sharedWith)
        ? updatedProject.sharedWith
            .map((item) => String(item.phone || "").replace(/\D/g, ""))
            .filter(Boolean)
        : sharedPhones;
    } else {
      /*
       * Fallback if backend does not
       * return the project object.
       */
      if (!sharedPhones.includes(phone)) {
        sharedPhones.push(phone);
      }
    }

    renderShareList();

    sharePhoneInput.value = "";

    showToast("Project shared successfully.");
  } catch (error) {
    console.error("SHARE ERROR:", error);

    shareFormError.textContent = error.message || "Could not share project.";
  } finally {
    button.disabled = false;
    button.textContent = "Share";
  }
}

function renderShareList() {
  if (!shareList) return;

  shareList.innerHTML = "";

  const countEl = document.getElementById("shareCount");

  const count = sharedPhones.length;

  if (countEl) {
    countEl.textContent = String(count);
  }

  if (!count) {
    shareList.innerHTML = `
            <div class="no-shares">
                This project has not been shared yet.
            </div>
        `;
    return;
  }

  sharedPhones.forEach((phone) => {
    const row = document.createElement("div");

    row.className = "share-row";

    row.innerHTML = `
            <div class="share-phone">
                📱 ${escapeHTML(phone)}
            </div>

            <button
                type="button"
                class="remove-share">
                Remove
            </button>
        `;

    row
      .querySelector(".remove-share")
      ?.addEventListener("click", () => removeShare(phone));

    shareList.appendChild(row);
  });
}
async function removeShare(phone) {
  if (!selectedProject?._id) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/construction-projects/${encodeURIComponent(
        selectedProject._id,
      )}/share/${encodeURIComponent(phone)}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Could not remove share.");
    }

    // Remove from current UI immediately
    sharedPhones = sharedPhones.filter((value) => value !== phone);

    // Keep selected project synchronized
    if (Array.isArray(selectedProject.sharedWith)) {
      selectedProject.sharedWith = selectedProject.sharedWith.filter(
        (item) => String(item.phone).replace(/\D/g, "") !== phone,
      );
    }

    renderShareList();

    showToast("Share removed.");
  } catch (error) {
    console.error("REMOVE SHARE ERROR:", error);

    showToast(error.message || "Could not remove share.");
  }
}

/* ============================================================
   VIEWER
============================================================ */

let viewerPreviousFocus = null;

function openViewer(url, type) {
  viewerPreviousFocus =
    document.activeElement;

  viewerContent.innerHTML = "";

  if (type === "video") {
    const video =
      document.createElement("video");

    video.src = url;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;

    viewerContent.appendChild(video);

  } else {
    const image =
      document.createElement("img");

    image.src = url;
    image.alt = "Project media";

    viewerContent.appendChild(image);
  }

  viewer.classList.add("show");

  // Modal is active
  viewer.removeAttribute("inert");

  viewer.setAttribute(
    "aria-hidden",
    "false"
  );

  // Move focus into the modal
  const closeButton =
    document.getElementById(
      "viewerCloseBtn"
    );

  closeButton?.focus();
}

function closeViewer() {
  /*
   * First move focus OUT of the element
   * that is about to become hidden.
   */
  if (
    viewer.contains(
      document.activeElement
    )
  ) {
    document.activeElement.blur();
  }

  viewer.classList.remove("show");

  /*
   * inert prevents keyboard focus and
   * interaction while hidden.
   */
  viewer.setAttribute(
    "inert",
    ""
  );

  viewer.setAttribute(
    "aria-hidden",
    "true"
  );

  viewerContent.innerHTML = "";

  /*
   * Return focus to the element that
   * opened the viewer.
   */
  if (
    viewerPreviousFocus &&
    typeof viewerPreviousFocus.focus ===
      "function"
  ) {
    viewerPreviousFocus.focus();
  }

  viewerPreviousFocus = null;
}

/* ============================================================
   EVENTS
============================================================ */

document
  .getElementById("addProjectBtn")
  .addEventListener("click", openProjectModal);

document
  .getElementById("projectCloseBtn")
  .addEventListener("click", closeProjectModal);

document
  .getElementById("projectCancelBtn")
  .addEventListener("click", closeProjectModal);

document.getElementById("saveProjectBtn").addEventListener("click", addProject);

projectSearch.addEventListener("input", renderProjects);

projectOverlay.addEventListener("click", (event) => {
  if (event.target === projectOverlay) {
    closeProjectModal();
  }
});

document
  .getElementById("backProjectsBtn")
  .addEventListener("click", closeProject);

document
  .getElementById("mediaUploadBtn")
  .addEventListener("click", () => mediaInput.click());

dropZone.addEventListener("click", () => mediaInput.click());

dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();

    mediaInput.click();
  }
});

mediaInput.addEventListener("change", (event) => {
  addFiles(event.target.files);

  event.target.value = "";
});

["dragenter", "dragover"].forEach((type) => {
  dropZone.addEventListener(type, (event) => {
    event.preventDefault();

    dropZone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((type) => {
  dropZone.addEventListener(type, (event) => {
    event.preventDefault();

    dropZone.classList.remove("dragging");
  });
});

dropZone.addEventListener("drop", (event) => {
  addFiles(event.dataTransfer.files);
});

document
  .getElementById("uploadSelectedBtn")
  .addEventListener("click", uploadSelectedFiles);
/*
document.getElementById("mediaShareBtn").addEventListener("click", () => {
  if (!selectedProject) {
    return;
  }

  shareOverlay.classList.add("show");

  shareOverlay.setAttribute("aria-hidden", "false");

  sharePhoneInput.focus();
});*/

document.getElementById("shareCloseBtn").addEventListener("click", () => {
  shareOverlay.classList.remove("show");

  shareOverlay.setAttribute("aria-hidden", "true");
});

document
  .getElementById("confirmShareBtn")
  .addEventListener("click", shareProject);

sharePhoneInput.addEventListener("input", () => {
  sharePhoneInput.value = sharePhoneInput.value.replace(/\D/g, "").slice(0, 10);

  shareFormError.textContent = "";
});

shareOverlay.addEventListener("click", (event) => {
  if (event.target === shareOverlay) {
    shareOverlay.classList.remove("show");

    shareOverlay.setAttribute("aria-hidden", "true");
  }
});

document
  .getElementById("viewerCloseBtn")
  .addEventListener("click", closeViewer);

viewer.addEventListener("click", (event) => {
  if (event.target === viewer) {
    closeViewer();
  }
});
/*
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeViewer();

    projectOverlay.classList.remove("show");

    shareOverlay.classList.remove("show");
  }
});*/
document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {

      if (
        viewer.classList.contains("show")
      ) {
        closeViewer();
      }

      if (
        projectOverlay.classList.contains(
          "show"
        )
      ) {
        closeProjectModal();
      }

      if (
        shareOverlay.classList.contains(
          "show"
        )
      ) {
        shareOverlay.classList.remove(
          "show"
        );

        shareOverlay.setAttribute(
          "aria-hidden",
          "true"
        );
      }
    }
  }
);
document.getElementById("backMainBtn").addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "/";
  }
});

async function loadSharedProjects() {
  const token = getToken();

  if (!token) {
    showToast("Please log in first.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE}/construction-projects/shared`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Could not load shared projects.");
    }

    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("LOAD SHARED PROJECTS ERROR:", error);

    showToast(error.message || "Could not load shared projects.");

    return [];
  }
}
const howToToggle =
  document.getElementById(
    "howToToggle"
  );

const howToContent =
  document.getElementById(
    "howToContent"
  );


howToToggle?.addEventListener(
  "click",
  function () {

    const isOpen =
      howToContent.classList.contains(
        "show"
      );

    if (isOpen) {

      // CLOSE
      howToContent.classList.remove(
        "show"
      );

      howToToggle.classList.remove(
        "open"
      );

      howToToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    } else {

      // OPEN
      howToContent.classList.add(
        "show"
      );

      howToToggle.classList.add(
        "open"
      );

      howToToggle.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  }
);
/* ============================================================
   INIT
============================================================ */
async function init() {
  try {
    myProjects = await loadProjects();

    projects = [...myProjects];

    renderProjects();
  } catch (error) {
    console.error("INIT ERROR:", error);

    showToast("Could not load projects.");
  }
}

init();
