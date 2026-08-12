// ---- Static data (dropdown options — not from the backend) ----
const REQUIREMENTS = [
  { key: "contractor", label: "Contractor", icon: "hard-hat",
    roles: ["General contractor", "Civil contractor", "Sub-contractor", "Electrical contractor", "Plumbing contractor", "Interior fit-out contractor"] },
  { key: "supplier", label: "Supplier", icon: "truck",
    roles: ["Material supplier", "Cement supplier", "Steel & rebar supplier", "Sand & aggregate supplier", "Equipment supplier", "Tiles & sanitaryware supplier"] },
  { key: "architect", label: "Architect", icon: "pen-tool",
    roles: ["Lead architect", "Interior architect", "Landscape architect", "Structural design architect"] },
  { key: "engineer", label: "Engineer", icon: "cog",
    roles: ["Civil engineer", "Structural engineer", "MEP engineer", "Site engineer", "Surveyor"] },
  { key: "mechanic", label: "Mechanic", icon: "wrench",
    roles: ["Equipment mechanic", "HVAC technician", "Machinery operator", "Maintenance technician"] },
  { key: "electrician", label: "Electrician", icon: "zap",
    roles: ["Wiring electrician", "Panel & DB electrician", "Maintenance electrician"] },
  { key: "plumber", label: "Plumber", icon: "droplet",
    roles: ["Pipefitter", "Sanitary plumber", "Drainage specialist"] },
  { key: "designer", label: "Interior designer", icon: "sofa",
    roles: ["Residential designer", "Commercial designer", "Furniture & decor consultant"] },
  { key: "labor", label: "Labor", icon: "users",
    roles: ["Mason", "Carpenter", "Painter", "Welder", "Helper / laborer"] },
  { key: "consultant", label: "Consultant", icon: "clipboard-list",
    roles: ["Project management consultant", "Cost / quantity consultant", "Safety consultant", "Legal & compliance consultant"] },
];

const STATE_DISTRICTS = {
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
  "Karnataka": ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubli-Dharwad", "Belagavi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Durgapur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
};

// ---- App state ----
let projects = [];
let formOpen = false;
let editingId = null; // backend _id of the project being edited, or null when creating
let requirement = null;
let role = null;

// ---- Element refs ----
const el = (id) => document.getElementById(id);
const createBtn = el("createBtn");
const formSection = el("formSection");
const formEyebrow = el("formEyebrow");
const formTitle = el("formTitle");
const formNo = el("formNo");
const reqGrid = el("reqGrid");
const reqCount = el("reqCount");
const roleSection = el("roleSection");
const roleReqName = el("roleReqName");
const publishBtn = el("publishBtn");
const incompleteHint = el("incompleteHint");
const loadingState = el("loadingState");
const emptyState = el("emptyState");
const cardsList = el("cardsList");
const errorBanner = el("errorBanner");
const errorBannerText = el("errorBannerText");
const errorBannerClose = el("errorBannerClose");

const fName = el("f-name");
const fAddress = el("f-address");
const fState = el("f-state");
const fDistrict = el("f-district");
const fBudget = el("f-budget");
const fDescription = el("f-description");
const fRole = el("f-role");
const pageLoader = document.getElementById("pageLoader");
// ================= API layer =================

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Thin wrapper around fetch: adds the auth header, parses JSON,
// and throws a readable Error when the backend responds with success:false.
async function apiRequest(path, { method = "GET", body } = {}) {
  const token = getToken();
showLoader("Loading...");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
     
    data = await res.json();
    //console.log("MY PROJECTS WITH PROFILES:", JSON.stringify(projects, null, 2));
  } catch {
    data = null;
    
  }finally{hideLoader();}

  if (!res.ok || (data && data.success === false)) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

const api = {
  list: () => apiRequest("/projects/my"),
  create: (payload) => apiRequest("/projects", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/projects/${id}`, { method: "PUT", body: payload }),
  remove: (id) => apiRequest(`/projects/${id}`, { method: "DELETE" }),
};

// ================= UI helpers =================

function showError(message) {
  errorBannerText.textContent = message;
  errorBanner.classList.remove("hidden");
  refreshIcons();
}
function hideError() {
  errorBanner.classList.add("hidden");
}
errorBannerClose.addEventListener("click", hideError);

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function formatBudget(v) {
  const n = Number(v);
  if (!v || Number.isNaN(n)) return v;
  return "\u20B9" + n.toLocaleString("en-IN");
}

function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function shortId(id) {
  return id ? id.slice(-6).toUpperCase() : "";
}
// ---- Normalize a populated Profile doc into render-friendly shape ----
// Matches the shape used elsewhere in the app (PROFILE_API cards / profile-details.html).
function normalizeProfile(profile) {
    if (!profile || typeof profile !== "object") {
        console.error("Invalid profile:", profile);
        return null;
    }

    return {
        id: profile._id,
        profileUrl: `/profile-details.html?id=${profile._id}`,
        name: profile.name,
        role: profile.role,
        rating: profile.rating,
        experience: profile.experience,
        category: profile.category || "contractor",
        image: profile.mediaType === "image" ? profile.media : "",
        video: profile.mediaType === "video" ? profile.media : "",
        languages: profile.languages,
        phone: profile.phone,
        description: profile.description,
        location: profile.location,
        state: profile.state,
        district: profile.district
    };
}
 
function renderProfileCard(np, sentAt) {
  const media = np.image
    ? `<img class="profile-thumb" src="${np.image}" alt="${np.name}" />`
    : np.video
      ? `<video class="profile-thumb" src="${np.video}" muted></video>`
      : `<div class="profile-thumb profile-thumb-fallback"><i data-lucide="user"></i></div>`;
 
  const languages = Array.isArray(np.languages) && np.languages.length
    ? `<div class="profile-langs">${np.languages.map((l) => `<span class="lang-chip">${l}</span>`).join("")}</div>`
    : "";
 
  const ratingBlock = np.rating
    ? `<span class="profile-rating"><i data-lucide="star"></i>${Number(np.rating).toFixed(1)}</span>`
    : "";
 
  return `
    <div class="profile-card">
      ${media}
      <div class="profile-info">
        <div class="profile-top">
          <span class="profile-name">${np.name || "Unnamed"}</span>
          ${ratingBlock}
        </div>
        <div class="profile-meta">
          <span class="profile-role">${np.role || np.category}</span>
          ${np.experience ? `<span>${np.experience} yrs exp.</span>` : ""}
          ${np.location || np.district ? `<span><i data-lucide="map-pin"></i>${np.location || `${np.district}, ${np.state}`}</span>` : ""}
        </div>
        ${languages}
        ${np.description ? `<p class="profile-desc">${np.description}</p>` : ""}
        <div class="profile-actions">
          <a class="card-btn edit" href="${np.profileUrl}"><i data-lucide="user"></i> View profile</a>
          ${np.phone ? `<a class="card-btn icon-btn call" href="tel:${np.phone}" aria-label="Call"><i data-lucide="phone"></i></a>` : ""}
        </div>
        <div class="profile-sent-at mono">Sent ${formatDateTime(sentAt)}</div>
      </div>
    </div>
  `;
}
// ---- Init static dropdown lists ----
Object.keys(STATE_DISTRICTS).forEach((s) => {
  const opt = document.createElement("option");
  opt.value = s; opt.textContent = s;
  fState.appendChild(opt);
});

reqCount.textContent = REQUIREMENTS.length + " services";
REQUIREMENTS.forEach((r) => {
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "req-tile";
  tile.dataset.key = r.key;
  tile.innerHTML = `<i data-lucide="${r.icon}"></i><span>${r.label}</span>`;
  tile.addEventListener("click", () => selectRequirement(r.key));
  reqGrid.appendChild(tile);
});

function emptyForm() {
  fName.value = ""; fAddress.value = ""; fState.value = ""; fDistrict.value = "";
  fBudget.value = ""; fDescription.value = ""; fRole.value = "";
  fDistrict.innerHTML = '<option value="" disabled selected>Select a state first</option>';
  fDistrict.disabled = true;
  requirement = null; role = null;
  document.querySelectorAll(".req-tile").forEach((t) => t.classList.remove("active"));
  roleSection.classList.add("hidden");
  editingId = null;
}

function isComplete() {
  return fName.value.trim() && fAddress.value.trim() && fState.value &&
    fDistrict.value && fBudget.value && requirement && role;
}

function updatePublishState() {
  const ok = isComplete();
  publishBtn.disabled = !ok || publishBtn.dataset.loading === "true";
  incompleteHint.classList.toggle("hidden", ok);
}

function selectRequirement(key) {
  requirement = key;
  role = null;
  document.querySelectorAll(".req-tile").forEach((t) => t.classList.toggle("active", t.dataset.key === key));

  const req = REQUIREMENTS.find((r) => r.key === key);
  roleReqName.textContent = req.label;
  fRole.innerHTML = '<option value="" disabled selected>Select a role</option>';
  req.roles.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r; opt.textContent = r;
    fRole.appendChild(opt);
  });
  roleSection.classList.remove("hidden");
  refreshIcons();
  updatePublishState();
}

// ---- Toggle create/close ----
function toggleCreate() {
  if (formOpen) {
    closeForm();
  } else {
    formOpen = true;
    emptyForm();
    formEyebrow.textContent = "NEW WORK ORDER";
    formTitle.textContent = "New project intake";
    formNo.textContent = "DRAFT";
    publishBtn.textContent = "Publish project";
    formSection.classList.remove("hidden");
    createBtn.classList.add("is-open");
    createBtn.innerHTML = '<i data-lucide="x"></i> Close';
    refreshIcons();
    updatePublishState();
  }
}
createBtn.addEventListener("click", toggleCreate);

function closeForm() {
  formOpen = false;
  emptyForm();
  formSection.classList.add("hidden");
  createBtn.classList.remove("is-open");
  createBtn.innerHTML = '<i data-lucide="plus"></i> Project';
  refreshIcons();
}

// ---- State -> District cascade ----
fState.addEventListener("change", () => {
  const districts = STATE_DISTRICTS[fState.value] || [];
  fDistrict.innerHTML = '<option value="" disabled selected>Select district</option>';
  districts.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d; opt.textContent = d;
    fDistrict.appendChild(opt);
  });
  fDistrict.disabled = false;
  updatePublishState();
});

[fName, fAddress, fBudget, fDescription, fDistrict, fRole].forEach((input) => {
  input.addEventListener("input", updatePublishState);
  input.addEventListener("change", () => {
    if (input === fRole) role = fRole.value;
    updatePublishState();
  });
});

// ---- Publish / Save (create or update via API) ----
publishBtn.addEventListener("click", async () => {
  if (!isComplete()) return;
  hideError();

  const payload = {
    name: fName.value.trim(),
    address: fAddress.value.trim(),
    state: fState.value,
    district: fDistrict.value,
    budget: Number(fBudget.value),
    description: fDescription.value.trim(),
    requirement,
    role,
  };

  publishBtn.dataset.loading = "true";
  publishBtn.disabled = true;
  const originalLabel = publishBtn.innerHTML;
  publishBtn.innerHTML = editingId ? "Saving…" : "Publishing…";

  try {
    if (editingId) {
      await api.update(editingId, payload);
    } else {
      await api.create(payload);
    }
    closeForm();
    await loadMyProjects();
  } catch (err) {
    showError(err.message || "Something went wrong. Please try again.");
    publishBtn.innerHTML = originalLabel;
    publishBtn.dataset.loading = "false";
    updatePublishState();
  }
});

// ---- Edit / Delete ----
function handleEdit(project) {
  fName.value = project.name;
  fAddress.value = project.address;
  fState.value = project.state;
  fState.dispatchEvent(new Event("change"));
  fDistrict.value = project.district;
  fBudget.value = project.budget;
  fDescription.value = project.description || "";

  selectRequirement(project.requirement);
  fRole.value = project.role;
  role = project.role;

  editingId = project._id;
  formOpen = true;
  formEyebrow.textContent = "EDIT WORK ORDER";
  formTitle.textContent = "Edit project";
  formNo.textContent = "PRJ-" + shortId(project._id);
  publishBtn.innerHTML = '<i data-lucide="check"></i> Save changes';
  formSection.classList.remove("hidden");
  createBtn.classList.add("is-open");
  createBtn.innerHTML = '<i data-lucide="x"></i> Close';
  refreshIcons();
  updatePublishState();
  formSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function handleDelete(id, cardEl) {
  if (!window.confirm("Delete this project? This cannot be undone.")) return;
  hideError();

  const deleteBtn = cardEl.querySelector(".delete");
  deleteBtn.disabled = true;
  deleteBtn.innerHTML = "Deleting…";

  try {
    await api.remove(id);
    projects = projects.filter((p) => p._id !== id);
    renderCards();
  } catch (err) {
    showError(err.message || "Could not delete this project. Please try again.");
    deleteBtn.disabled = false;
    deleteBtn.innerHTML = '<i data-lucide="trash-2"></i> Delete';
    refreshIcons();
  }
}

// ---- Fetch published projects (with date/time) ----
async function loadMyProjects() {
  hideError();
  loadingState.classList.remove("hidden");
  emptyState.classList.add("hidden");
  cardsList.innerHTML = "";

  try {
    showLoader("loading");
    const res = await api.list();
    projects = res.data || [];
    renderCards();
  } catch (err) {
    showError(err.message || "Could not load your projects.");
  } finally {
    loadingState.classList.add("hidden");
    hideLoader();
  }
}
document.getElementById("back")?.addEventListener("click", () => goBack("landing.html"));

function goBack(fallback = "landing.html") {
  if (document.referrer && history.length > 1) {
    history.back();
  } else {
    window.location.href = fallback;
  }
}
function showLoader(message = "Please wait...") {
    pageLoader.querySelector("p").textContent = message;
    pageLoader.classList.add("active");
}

function hideLoader() {
    pageLoader.classList.remove("active");
}
// ---- Render cards ----
function renderCards() {
  cardsList.innerHTML = "";
  emptyState.classList.toggle("hidden", projects.length > 0 || formOpen);
 
  projects.forEach((p) => {
    const req = REQUIREMENTS.find((r) => r.key === p.requirement) || REQUIREMENTS[0];
 
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-head">
        <span class="card-num">PRJ-${shortId(p._id)}</span>
        <span class="card-badge"><i data-lucide="${req.icon}"></i>${req.label}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <div class="card-meta">
          <span><i data-lucide="map-pin"></i>${p.address}, ${p.district}, ${p.state}</span>
          <span class="mono"><i data-lucide="indian-rupee"></i>${formatBudget(p.budget)}</span>
          <span>Role: <b>${p.role}</b></span>
        </div>
        <div class="card-meta">
          <span class="mono"><i data-lucide="calendar-clock"></i>Published ${formatDateTime(p.publishedAt || p.createdAt)}</span>
        </div>
        ${p.description ? `<p class="card-desc">${p.description}</p>` : ""}
 
        <button type="button" class="profiles-toggle">
          <i data-lucide="users"></i>
          <span>${(p.sentProfiles || []).length} profile${(p.sentProfiles || []).length === 1 ? "" : "s"} sent</span>
          <i data-lucide="chevron-down" class="profiles-caret"></i>
        </button>
        <div class="profiles-panel hidden">
          ${
            (p.sentProfiles || []).length
              ? p.sentProfiles
                  .map((sp) => renderProfileCard(normalizeProfile(sp.profile || {}), sp.sentAt))
                  .join("")
              : `<p class="profiles-empty">No one has sent a profile to this project yet.</p>`
          }
        </div>
 
        <div class="card-actions">
          <button type="button" class="card-btn edit"><i data-lucide="pencil"></i> Edit</button>
          <button type="button" class="card-btn delete"><i data-lucide="trash-2"></i> Delete</button>
        </div>
      </div>
    `;
    card.querySelector(".edit").addEventListener("click", () => handleEdit(p));
    card.querySelector(".delete").addEventListener("click", () => handleDelete(p._id, card));
 
    const toggle = card.querySelector(".profiles-toggle");
    const panel = card.querySelector(".profiles-panel");
    toggle.addEventListener("click", () => {
      const isHidden = panel.classList.toggle("hidden");
      toggle.classList.toggle("open", !isHidden);
    });
 
    cardsList.appendChild(card);
  });
 
  refreshIcons();
}
// ---- Boot ----
if (!getToken()) {
  showError("You're not logged in — log in first, then reload this page to manage your projects.");
  publishBtn.disabled = true;
}
refreshIcons();
loadMyProjects();