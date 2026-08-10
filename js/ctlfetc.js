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
  { key: "mechanic", label: "Technician", icon: "wrench",
    roles: ["Equipment mechanic", "HVAC technician", "Machinery operator", "Maintenance technician"] },
  { key: "electrician", label: "Electrician", icon: "zap",
    roles: ["Wiring electrician", "Panel & DB electrician", "Maintenance electrician"] },
  { key: "plumber", label: "Plumber", icon: "droplet",
    roles: ["Pipefitter", "Sanitary plumber", "Drainage specialist"] },
  { key: "designer", label: "Interior designer", icon: "sofa",
    roles: ["Residential designer", "Commercial designer", "Furniture & decor consultant"] },
  { key: "labor", label: "Labour", icon: "users",
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
let filters = { search: "", category: "", role: "", state: "", district: "" };
let sentIds = new Set();
let currentPage = 1;
let totalPages = 1;
let results = []; // accumulated across "Load more" pages
let requestSeq = 0; // guards against out-of-order responses when filters change quickly

// ---- Element refs ----
const el = (id) => document.getElementById(id);
const searchInput = el("searchInput");
const fCategory = el("f-category");
const fRole = el("f-role");
const roleField = el("roleField");
const fState = el("f-state");
const fDistrict = el("f-district");
const activeFilters = el("activeFilters");
const resultCount = el("resultCount");
const clearBtn = el("clearBtn");
const loadingState = el("loadingState");
const emptyState = el("emptyState");
const cardsList = el("cardsList");
const errorBanner = el("errorBanner");
const errorBannerText = el("errorBannerText");
const errorBannerClose = el("errorBannerClose");
const loadMoreBtn = el("loadMoreBtn");
const pageLoader = document.getElementById("pageLoader");
// ---- Init static lists ----
REQUIREMENTS.forEach((r) => {
  const opt = document.createElement("option");
  opt.value = r.key; opt.textContent = r.label;
  fCategory.appendChild(opt);
});
Object.keys(STATE_DISTRICTS).forEach((s) => {
  const opt = document.createElement("option");
  opt.value = s; opt.textContent = s;
  fState.appendChild(opt);
});

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

function showError(message) {
  errorBannerText.textContent = message;
  errorBanner.classList.remove("hidden");
  refreshIcons();
}
function hideError() {
  errorBanner.classList.add("hidden");
}
errorBannerClose.addEventListener("click", hideError);

// ================= API layer =================

// GET /api/projects is public — no auth token needed to browse.
async function fetchProjects({ page = 1, method = "GET", body } = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.role) params.set("role", filters.role);
  if (filters.state) params.set("state", filters.state);
  if (filters.district) params.set("district", filters.district);
  params.set("page", page);
  params.set("limit", 10);
function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}
const token = getToken();
showLoader("Loading...")
  const res = await fetch(`${API_BASE_URL}/projects?${params.toString()}`, {
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
  } catch {
    data = null;
  }finally{hideLoader();}

  if (!res.ok || (data && data.success === false)) {
    throw new Error((data && data.message) || `Request failed (${res.status})`);
  }
  return data; // { success, count, total, page, totalPages, data: [...] }
}

// ---- Category -> Role ----
fCategory.addEventListener("change", () => {
  filters.category = fCategory.value;
  filters.role = "";
  fRole.innerHTML = '<option value="">All roles</option>';

  if (fCategory.value) {
    const req = REQUIREMENTS.find((r) => r.key === fCategory.value);
    req.roles.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r; opt.textContent = r;
      fRole.appendChild(opt);
    });
    roleField.style.display = "";
  } else {
    roleField.style.display = "none";
  }
  refreshIcons();
  runSearch();
});

fRole.addEventListener("change", () => {
  filters.role = fRole.value;
  runSearch();
});

// ---- State -> District ----
fState.addEventListener("change", () => {
  filters.state = fState.value;
  filters.district = "";
  fDistrict.innerHTML = "";

  if (fState.value) {
    fDistrict.innerHTML = '<option value="">All districts</option>';
    STATE_DISTRICTS[fState.value].forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d; opt.textContent = d;
      fDistrict.appendChild(opt);
    });
    fDistrict.disabled = false;
  } else {
    fDistrict.innerHTML = '<option value="">Select a state first</option>';
    fDistrict.disabled = true;
  }
  runSearch();
});

fDistrict.addEventListener("change", () => {
  filters.district = fDistrict.value;
  runSearch();
});

// ---- Search (debounced) ----
let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filters.search = searchInput.value.trim();
    runSearch();
  }, 350);
});

// ---- Clear ----
clearBtn.addEventListener("click", () => {
  filters = { search: "", category: "", role: "", state: "", district: "" };
  searchInput.value = "";
  fCategory.value = "";
  fRole.innerHTML = '<option value="">All roles</option>';
  roleField.style.display = "none";
  fState.value = "";
  fDistrict.innerHTML = '<option value="">Select a state first</option>';
  fDistrict.disabled = true;
  runSearch();
});

// ---- Active filter chips ----
function renderChips() {
  activeFilters.innerHTML = "";
  const entries = [];
  if (filters.search) entries.push(["search", `"${filters.search}"`]);
  if (filters.category) entries.push(["category", REQUIREMENTS.find((r) => r.key === filters.category)?.label]);
  if (filters.role) entries.push(["role", filters.role]);
  if (filters.state) entries.push(["state", filters.state]);
  if (filters.district) entries.push(["district", filters.district]);

  entries.forEach(([key, text]) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${text}<button type="button" aria-label="Remove filter"><i data-lucide="x"></i></button>`;
    chip.querySelector("button").addEventListener("click", () => removeFilter(key));
    activeFilters.appendChild(chip);
  });
  refreshIcons();
}

function removeFilter(key) {
  if (key === "search") { filters.search = ""; searchInput.value = ""; }
  if (key === "category") { filters.category = ""; filters.role = ""; fCategory.value = ""; fRole.innerHTML = '<option value="">All roles</option>'; roleField.style.display = "none"; }
  if (key === "role") { filters.role = ""; fRole.value = ""; }
  if (key === "state") { filters.state = ""; filters.district = ""; fState.value = ""; fDistrict.innerHTML = '<option value="">Select a state first</option>'; fDistrict.disabled = true; }
  if (key === "district") { filters.district = ""; fDistrict.value = ""; }
  runSearch();
}

// ---- Run a fresh search (filters changed — reset to page 1) ----
async function runSearch() {
  renderChips();
  currentPage = 1;
  const seq = ++requestSeq;

  hideError();
  loadingState.classList.remove("hidden");
  emptyState.classList.add("hidden");
  loadMoreBtn.classList.add("hidden");
  cardsList.innerHTML = "";
  results = [];

  try {
    const res = await fetchProjects({ page: 1 });
    if (seq !== requestSeq) return; // a newer filter change superseded this response
    results = res.data || [];
    totalPages = res.totalPages || 1;
    resultCount.textContent = `${res.total ?? results.length} project${(res.total ?? results.length) === 1 ? "" : "s"}`;
    renderCards();
    loadMoreBtn.classList.toggle("hidden", currentPage >= totalPages);
  } catch (err) {
    if (seq !== requestSeq) return;
    showError(err.message || "Could not load projects.");
    resultCount.textContent = "0 projects";
  } finally {
    if (seq === requestSeq) loadingState.classList.add("hidden");
  }
}

// ---- Load more (append next page) ----
loadMoreBtn.addEventListener("click", async () => {
  hideError();
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = "Loading…";

  try {
    const nextPage = currentPage + 1;
    const res = await fetchProjects({ page: nextPage });
    currentPage = nextPage;
    results = results.concat(res.data || []);
    totalPages = res.totalPages || 1;
    renderCards();
    loadMoreBtn.classList.toggle("hidden", currentPage >= totalPages);
  } catch (err) {
    showError(err.message || "Could not load more projects.");
  } finally {
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = "Load more";
  }
});

// ---- Send profile ----
// Calls the real backend now: POST /api/projects/:id/send-profile.
// Requires the professional to be logged in (same token as the create screen).
async function handleSendProfile(id, btn) {
  hideError();

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    showError("Log in with your contractor/professional account to send your profile.");
    return;
  }

  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = "Sending…";

  try {
    showLoader("Sending...")
    const res = await fetch(`${API_BASE_URL}/projects/${id}/send-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }finally{hideLoader();}

    if (!res.ok || (data && data.success === false)) {
      throw new Error((data && data.message) || `Request failed (${res.status})`);
    }

    sentIds.add(id);
    btn.classList.remove("send");
    btn.classList.add("sent");
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="check"></i> Profile sent';
    refreshIcons();
  } catch (err) {
    showError(err.message || "Could not send your profile. Please try again.");
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    refreshIcons();
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
// ---- Call ----
// The Project model/controller don't return a phone number yet (only
// createdBy: { name, email } is populated). Once you add a contact number
// — either on the project itself or on the User model — populate it in
// getProjects()/getProjectById() and this will start dialing automatically.
function handleCall(p) {
  const phone = p.Phone || p.createdBy?.phone;
  if (phone) {
    window.location.href = `tel:${phone}`;
  } else {
    showError("No phone number on file for this project yet.");
  }
}

// ---- Render cards ----
function renderCards() {
  cardsList.innerHTML = "";
  emptyState.classList.toggle("hidden", results.length > 0);

  results.forEach((p) => {
    const req = REQUIREMENTS.find((r) => r.key === p.requirement) || REQUIREMENTS[0];
    const alreadySent = sentIds.has(p._id);

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
        <div class="card-actions">
          <button type="button" class="card-btn ${alreadySent ? "sent" : "send"}" ${alreadySent ? "disabled" : ""}>
            <i data-lucide="${alreadySent ? "check" : "send"}"></i> ${alreadySent ? "Profile sent" : "Send profile"}
          </button>
          <button type="button" class="card-btn icon-btn call" aria-label="Call">
            <i data-lucide="phone"></i>
          </button>
        </div>
      </div>
    `;
    if (!alreadySent) {
      card.querySelector(".send").addEventListener("click", (e) => handleSendProfile(p._id, e.currentTarget));
    }
    card.querySelector(".call").addEventListener("click", () => handleCall(p));
    cardsList.appendChild(card);
  });

  refreshIcons();
}

// ---- Boot ----
refreshIcons();
runSearch();
/*// ---- Static data (dropdown options — not from the backend) ----
const REQUIREMENTS = [
  { key: "contractor", label: "Contractor", icon: "hard-hat",
    roles: ["General contractor", "Civil contractor", "Sub-contractor", "Electrical contractor", "Plumbing contractor", "Interior fit-out contractor"] },
  { key: "supplier", label: "Supplier", icon: "truck",
    roles: ["Material supplier", "Cement supplier", "Steel & rebar supplier", "Sand & aggregate supplier", "Equipment supplier", "Tiles & sanitaryware supplier"] },
  { key: "architect", label: "Architect", icon: "pen-tool",
    roles: ["Lead architect", "Interior architect", "Landscape architect", "Structural design architect"] },
  { key: "engineer", label: "Engineer", icon: "cog",
    roles: ["Civil engineer", "Structural engineer", "MEP engineer", "Site engineer", "Surveyor"] },
  { key: "mechanic", label: "Technician", icon: "wrench",
    roles: ["Equipment mechanic", "HVAC technician", "Machinery operator", "Maintenance technician"] },
  { key: "electrician", label: "Electrician", icon: "zap",
    roles: ["Wiring electrician", "Panel & DB electrician", "Maintenance electrician"] },
  { key: "plumber", label: "Plumber", icon: "droplet",
    roles: ["Pipefitter", "Sanitary plumber", "Drainage specialist"] },
  { key: "designer", label: "Interior designer", icon: "sofa",
    roles: ["Residential designer", "Commercial designer", "Furniture & decor consultant"] },
  { key: "labor", label: "Labour", icon: "users",
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
let filters = { search: "", category: "", role: "", state: "", district: "" };
let sentIds = new Set();
let currentPage = 1;
let totalPages = 1;
let results = []; // accumulated across "Load more" pages
let requestSeq = 0; // guards against out-of-order responses when filters change quickly

// ---- Element refs ----
const el = (id) => document.getElementById(id);
const searchInput = el("searchInput");
const fCategory = el("f-category");
const fRole = el("f-role");
const roleField = el("roleField");
const fState = el("f-state");
const fDistrict = el("f-district");
const activeFilters = el("activeFilters");
const resultCount = el("resultCount");
const clearBtn = el("clearBtn");
const loadingState = el("loadingState");
const emptyState = el("emptyState");
const cardsList = el("cardsList");
const errorBanner = el("errorBanner");
const errorBannerText = el("errorBannerText");
const errorBannerClose = el("errorBannerClose");
const loadMoreBtn = el("loadMoreBtn");

// ---- Init static lists ----
REQUIREMENTS.forEach((r) => {
  const opt = document.createElement("option");
  opt.value = r.key; opt.textContent = r.label;
  fCategory.appendChild(opt);
});
Object.keys(STATE_DISTRICTS).forEach((s) => {
  const opt = document.createElement("option");
  opt.value = s; opt.textContent = s;
  fState.appendChild(opt);
});

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

function showError(message) {
  errorBannerText.textContent = message;
  errorBanner.classList.remove("hidden");
  refreshIcons();
}
function hideError() {
  errorBanner.classList.add("hidden");
}
errorBannerClose.addEventListener("click", hideError);

// ================= API layer =================
// GET /api/projects is public — no auth token needed to browse.
async function fetchProjects({ page = 1, method = "GET", body } = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.role) params.set("role", filters.role);
  if (filters.state) params.set("state", filters.state);
  if (filters.district) params.set("district", filters.district);
  params.set("page", page);
  params.set("limit", 10);
function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}
const token = getToken();
  const res = await fetch(`${API_BASE_URL}/projects?${params.toString()}`, {
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
  } catch {
    data = null;
  }

  if (!res.ok || (data && data.success === false)) {
    throw new Error((data && data.message) || `Request failed (${res.status})`);
  }
  return data; // { success, count, total, page, totalPages, data: [...] }
}

// ---- Category -> Role ----
fCategory.addEventListener("change", () => {
  filters.category = fCategory.value;
  filters.role = "";
  fRole.innerHTML = '<option value="">All roles</option>';

  if (fCategory.value) {
    const req = REQUIREMENTS.find((r) => r.key === fCategory.value);
    req.roles.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r; opt.textContent = r;
      fRole.appendChild(opt);
    });
    roleField.style.display = "";
  } else {
    roleField.style.display = "none";
  }
  refreshIcons();
  runSearch();
});

fRole.addEventListener("change", () => {
  filters.role = fRole.value;
  runSearch();
});

// ---- State -> District ----
fState.addEventListener("change", () => {
  filters.state = fState.value;
  filters.district = "";
  fDistrict.innerHTML = "";

  if (fState.value) {
    fDistrict.innerHTML = '<option value="">All districts</option>';
    STATE_DISTRICTS[fState.value].forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d; opt.textContent = d;
      fDistrict.appendChild(opt);
    });
    fDistrict.disabled = false;
  } else {
    fDistrict.innerHTML = '<option value="">Select a state first</option>';
    fDistrict.disabled = true;
  }
  runSearch();
});

fDistrict.addEventListener("change", () => {
  filters.district = fDistrict.value;
  runSearch();
});

// ---- Search (debounced) ----
let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filters.search = searchInput.value.trim();
    runSearch();
  }, 350);
});

// ---- Clear ----
clearBtn.addEventListener("click", () => {
  filters = { search: "", category: "", role: "", state: "", district: "" };
  searchInput.value = "";
  fCategory.value = "";
  fRole.innerHTML = '<option value="">All roles</option>';
  roleField.style.display = "none";
  fState.value = "";
  fDistrict.innerHTML = '<option value="">Select a state first</option>';
  fDistrict.disabled = true;
  runSearch();
});

// ---- Active filter chips ----
function renderChips() {
  activeFilters.innerHTML = "";
  const entries = [];
  if (filters.search) entries.push(["search", `"${filters.search}"`]);
  if (filters.category) entries.push(["category", REQUIREMENTS.find((r) => r.key === filters.category)?.label]);
  if (filters.role) entries.push(["role", filters.role]);
  if (filters.state) entries.push(["state", filters.state]);
  if (filters.district) entries.push(["district", filters.district]);

  entries.forEach(([key, text]) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${text}<button type="button" aria-label="Remove filter"><i data-lucide="x"></i></button>`;
    chip.querySelector("button").addEventListener("click", () => removeFilter(key));
    activeFilters.appendChild(chip);
  });
  refreshIcons();
}

function removeFilter(key) {
  if (key === "search") { filters.search = ""; searchInput.value = ""; }
  if (key === "category") { filters.category = ""; filters.role = ""; fCategory.value = ""; fRole.innerHTML = '<option value="">All roles</option>'; roleField.style.display = "none"; }
  if (key === "role") { filters.role = ""; fRole.value = ""; }
  if (key === "state") { filters.state = ""; filters.district = ""; fState.value = ""; fDistrict.innerHTML = '<option value="">Select a state first</option>'; fDistrict.disabled = true; }
  if (key === "district") { filters.district = ""; fDistrict.value = ""; }
  runSearch();
}

// ---- Run a fresh search (filters changed — reset to page 1) ----
async function runSearch() {
  renderChips();
  currentPage = 1;
  const seq = ++requestSeq;

  hideError();
  loadingState.classList.remove("hidden");
  emptyState.classList.add("hidden");
  loadMoreBtn.classList.add("hidden");
  cardsList.innerHTML = "";
  results = [];

  try {
    const res = await fetchProjects({ page: 1 });
    if (seq !== requestSeq) return; // a newer filter change superseded this response
    results = res.data || [];
    totalPages = res.totalPages || 1;
    resultCount.textContent = `${res.total ?? results.length} project${(res.total ?? results.length) === 1 ? "" : "s"}`;
    renderCards();
    loadMoreBtn.classList.toggle("hidden", currentPage >= totalPages);
  } catch (err) {
    if (seq !== requestSeq) return;
    showError(err.message || "Could not load projects.");
    resultCount.textContent = "0 projects";
  } finally {
    if (seq === requestSeq) loadingState.classList.add("hidden");
  }
}

// ---- Load more (append next page) ----
loadMoreBtn.addEventListener("click", async () => {
  hideError();
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = "Loading…";

  try {
    const nextPage = currentPage + 1;
    const res = await fetchProjects({ page: nextPage });
    currentPage = nextPage;
    results = results.concat(res.data || []);
    totalPages = res.totalPages || 1;
    renderCards();
    loadMoreBtn.classList.toggle("hidden", currentPage >= totalPages);
  } catch (err) {
    showError(err.message || "Could not load more projects.");
  } finally {
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = "Load more";
  }
});

// ---- Send profile ----
// No backend endpoint for this yet — flips to a local "sent" state only.
// Swap in a real POST call (e.g. POST /api/projects/:id/send-profile) when ready.
function handleSendProfile(id, btn) {
  sentIds.add(id);
  btn.classList.remove("send");
  btn.classList.add("sent");
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="check"></i> Profile sent';
  refreshIcons();
}
function handleCall(p) {
  const phone = p.Phone || p.createdBy?.phone;
  if (phone) {
    window.location.href = `tel:${phone}`;
  } else {
    showError("No phone number on file for this project yet.");
  }
}
// ---- Render cards ----
function renderCards() {
  cardsList.innerHTML = "";
  emptyState.classList.toggle("hidden", results.length > 0);

  results.forEach((p) => {
    const req = REQUIREMENTS.find((r) => r.key === p.requirement) || REQUIREMENTS[0];
    const alreadySent = sentIds.has(p._id);

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
        <div class="card-actions">
          <button type="button" class="card-btn ${alreadySent ? "sent" : "send"}" ${alreadySent ? "disabled" : ""}>
            <i data-lucide="${alreadySent ? "check" : "send"}"></i> ${alreadySent ? "Profile sent" : "Send profile"}
          </button>
           <button type="button" class="card-btn icon-btn call" aria-label="Call">
            <i data-lucide="phone"></i>
          </button>
        </div>
      </div>
    `;
    if (!alreadySent) {
      card.querySelector(".send").addEventListener("click", (e) => handleSendProfile(p._id, e.currentTarget));
    }
     card.querySelector(".call").addEventListener("click", () => handleCall(p));
    cardsList.appendChild(card);
  });

  refreshIcons();
}

// ---- Boot ----
refreshIcons();
runSearch();*/