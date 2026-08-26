// ---- Static data ----
const REQUIREMENTS = [
  { key: "contractor", label: "Contractor", icon: "hard-hat",
    roles: ["Plumbing",
      "electrician",
      "Carpentry",
      "Masonry",
      "Painter",
      "Roofing",
      "Flooring",
      "HVAC",
      "Landscaping",
      "Demolition",
      "Structural",
      "Marble & Tiles",
      "POP",
      "Glass",] },
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

const PAGE_SIZE = 20;
const AI_MESSAGES = ["Understanding your search…", "Matching categories & roles…", "Searching profiles…", "Ranking best matches…"];
const AI_MIN_DURATION = 1400; // ms — keeps the AI sequence feeling real even on a fast API

// ---- State ----
let filters = { search: "", category: "", role: "", address: "", phone: "", state: "", district: "" };
let page = 1;
let totalPages = 1;
let total = 0;
let requestSeq = 0;

// ---- Element refs ----
const el = (id) => document.getElementById(id);
const backBtn = el("backBtn");
const filterBtn = el("filterBtn");
const filterDot = el("filterDot");
const errorBanner = el("errorBanner");
const errorBannerText = el("errorBannerText");
const errorBannerClose = el("errorBannerClose");
const activeFilters = el("activeFilters");

const aiState = el("aiState");
const aiStatusText = el("aiStatusText");
const emptyState = el("emptyState");
const idleState = el("idleState");
const resultsMeta = el("resultsMeta");
const resultCount = el("resultCount");
const cardsGrid = el("cardsGrid");
const pagination = el("pagination");
const prevBtn = el("prevBtn");
const nextBtn = el("nextBtn");
const pageIndicator = el("pageIndicator");

const searchInput = el("searchInput");
const clearSearchBtn = el("clearSearchBtn");

const filterBackdrop = el("filterBackdrop");
const filterSheet = el("filterSheet");
const filterCloseBtn = el("filterCloseBtn");
const fCategory = el("f-category");
const fRole = el("f-role");
const roleField = el("roleField");
const fAddress = el("f-address");
const fPhone = el("f-phone");
const fState = el("f-state");
const fDistrict = el("f-district");
const clearFiltersBtn = el("clearFiltersBtn");
const applyFiltersBtn = el("applyFiltersBtn");

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

function showError(message) {
  errorBannerText.textContent = message;
  errorBanner.classList.remove("hidden");
  refreshIcons();
}
function hideError() {
  errorBanner.classList.add("hidden");
}
errorBannerClose.addEventListener("click", hideError);

// ---- Navigation ----
backBtn.addEventListener("click", () => {
  if (window.history.length > 1) window.history.back();
});

// ================= API =================
function normalizeResponse(json) {
  if (Array.isArray(json)) {
    return { data: json, total: json.length, totalPages: 1 };
  }
  const data = json.data || json.results || [];
  return {
    data,
    total: json.total ?? data.length,
    totalPages: json.totalPages || Math.max(1, Math.ceil((json.total ?? data.length) / PAGE_SIZE)),
  };
}

async function fetchProfiles(pageNum) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.role) params.set("role", filters.role);
  if (filters.address) params.set("address", filters.address);
  if (filters.phone) params.set("phone", filters.phone);
  if (filters.state) params.set("state", filters.state);
  if (filters.district) params.set("district", filters.district);
  params.set("page", pageNum);
  params.set("limit", PAGE_SIZE);

  const res = await fetch(`${PROFILE_API_BASE_URL}?${params.toString()}`);
  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || (json && json.success === false)) {
    throw new Error((json && json.message) || `Request failed (${res.status})`);
  }
  return normalizeResponse(json);
}

// ---- Normalize a profile doc into render-friendly shape ----
function normalizeProfile(p) {
  return {
    id: p._id,
    profileUrl: `/profile-details.html?id=${p._id}`,
    name: p.name,
    role: p.role,
    rating: p.rating,
    experience: p.experience,
    teamSize: p.teamSize,
    skills: Array.isArray(p.skills) ? p.skills : [],
    category: p.category || "contractor",
    image: p.mediaType === "image" ? p.media : "",
    video: p.mediaType === "video" ? p.media : "",
    languages: p.languages,
    phone: p.phone,
    description: p.description,
    location: p.location,
    state: p.state,
    district: p.district,
  };
}

// ================= Ranking algorithm =================
// Weighted "best match" score (0–1) from experience, rating, team size,
// skills breadth, and language versatility — with a relevance bonus when
// the profile's own role/skills line up with the role filter in use.
// Caps below keep any one very large number (e.g. 40 yrs experience) from
// dominating the score — everything is normalized before weighting.
const SCORE_WEIGHTS = { experience: 0.30, rating: 0.25, teamSize: 0.15, skills: 0.15, languages: 0.10 };
const SCORE_CAPS = { experience: 20, rating: 5, teamSize: 50, skills: 8, languages: 4 };

function computeMatchScore(np, activeFilters) {
  const expScore = Math.min(Number(np.experience) || 0, SCORE_CAPS.experience) / SCORE_CAPS.experience;
  const ratingScore = Math.min(Number(np.rating) || 0, SCORE_CAPS.rating) / SCORE_CAPS.rating;
  const teamScore = Math.min(Number(np.teamSize) || 0, SCORE_CAPS.teamSize) / SCORE_CAPS.teamSize;
  const skillsScore = Math.min(np.skills.length, SCORE_CAPS.skills) / SCORE_CAPS.skills;
  const langCount = Array.isArray(np.languages) ? np.languages.length : 0;
  const langScore = Math.min(langCount, SCORE_CAPS.languages) / SCORE_CAPS.languages;

  let relevanceBonus = 0;
  if (activeFilters.role) {
    const roleLower = activeFilters.role.toLowerCase();
    if ((np.role || "").toLowerCase() === roleLower) {
      relevanceBonus += 0.15;
    } else if (np.skills.some((s) => s.toLowerCase().includes(roleLower.split(" ")[0]))) {
      relevanceBonus += 0.08;
    }
  }

  const raw =
    expScore * SCORE_WEIGHTS.experience +
    ratingScore * SCORE_WEIGHTS.rating +
    teamScore * SCORE_WEIGHTS.teamSize +
    skillsScore * SCORE_WEIGHTS.skills +
    langScore * SCORE_WEIGHTS.languages +
    relevanceBonus;

  return Math.min(1, raw);
}

function rankProfiles(rawProfiles) {
  return rawProfiles
    .map((raw) => {
      const np = normalizeProfile(raw);
      return { profile: np, score: computeMatchScore(np, filters) };
    })
    .sort((a, b) => b.score - a.score);
}

// ================= Client-side safety filter =================
// Belt-and-suspenders: re-checks every fetched profile against the active
// filters before rendering. This guards against a backend search endpoint
// that silently ignores query params (returns everything regardless of
// ?search=...) — a common cause of "I typed a name and got unrelated
// results back." It only filters what's already on the current page, so
// it can't fix incorrect totals/pagination from a broken backend — that
// still needs a real fix server-side (see README/notes).
function matchesActiveFilters(np, f) {
  if (f.search) {
    const q = f.search.toLowerCase();
    if (!(np.name || "").toLowerCase().includes(q)) return false;
  }
  if (f.category && np.category !== f.category) return false;
  if (f.role && np.role !== f.role) return false;
  if (f.address) {
    const q = f.address.toLowerCase();
    const hay = `${np.location || ""} ${np.district || ""} ${np.state || ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.phone && !(np.phone || "").replace(/\s+/g, "").includes(f.phone.replace(/\s+/g, ""))) return false;
  if (f.state && np.state !== f.state) return false;
  if (f.district && np.district !== f.district) return false;
  return true;
}

function categoryMeta(key) {
  return REQUIREMENTS.find((r) => r.key === key);
}

// ================= AI search sequence =================
function hasActiveQuery() {
  return !!(filters.search || filters.category || filters.role || filters.address || filters.phone || filters.state || filters.district);
}

function playAiMessages(stopSignal) {
  let i = 0;
  aiStatusText.textContent = AI_MESSAGES[0];
  const interval = setInterval(() => {
    if (stopSignal.stopped) { clearInterval(interval); return; }
    i = (i + 1) % AI_MESSAGES.length;
    aiStatusText.style.opacity = 0;
    setTimeout(() => {
      aiStatusText.textContent = AI_MESSAGES[i];
      aiStatusText.style.opacity = 1;
    }, 150);
  }, 550);
  return () => { clearInterval(interval); };
}

function setUiState(state) {
  // state: "idle" | "ai" | "results" | "empty"
  idleState.classList.toggle("hidden", state !== "idle");
  aiState.classList.toggle("hidden", state !== "ai");
  emptyState.classList.toggle("hidden", state !== "empty");
  resultsMeta.classList.toggle("hidden", state !== "results");
  pagination.classList.toggle("hidden", state !== "results");
  if (state !== "results") cardsGrid.innerHTML = "";
}

async function runSearch({ showAiSequence = true } = {}) {
  hideError();
  const seq = ++requestSeq;

  if (!hasActiveQuery()) {
    setUiState("idle");
    return;
  }

  const start = Date.now();
  let stopMessages = () => {};
  if (showAiSequence) {
    setUiState("ai");
    aiStatusText.style.transition = "opacity 150ms ease";
    stopMessages = playAiMessages({ stopped: false });
  }

  try {
    const res = await fetchProfiles(page);
    if (seq !== requestSeq) return;

    const elapsed = Date.now() - start;
    const wait = showAiSequence ? Math.max(0, AI_MIN_DURATION - elapsed) : 0;
    await new Promise((r) => setTimeout(r, wait));
    if (seq !== requestSeq) return;

    stopMessages();
    total = res.total;
    totalPages = res.totalPages;

    const ranked = rankProfiles(res.data).filter((entry) => matchesActiveFilters(entry.profile, filters));

    if (ranked.length === 0) {
      setUiState("empty");
      return;
    }

    setUiState("results");
    const filteredOut = res.data.length - ranked.length;
    resultCount.textContent = filteredOut > 0
      ? `${ranked.length} profile${ranked.length === 1 ? "" : "s"} found on this page · sorted by best match`
      : `${total} profile${total === 1 ? "" : "s"} found · sorted by best match`;
    renderCards(ranked);
    updatePagination();
  } catch (err) {
    if (seq !== requestSeq) return;
    stopMessages();
    showError(err.message || "Could not search profiles right now.");
    setUiState("idle");
  }
}

function updatePagination() {
  pageIndicator.textContent = `Page ${page} of ${totalPages}`;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= totalPages;
}

prevBtn.addEventListener("click", async () => {
  if (page <= 1) return;
  page -= 1;
  await runSearch({ showAiSequence: false });
  window.scrollTo?.({ top: 0 });
  document.querySelector(".results-area")?.scrollTo?.({ top: 0, behavior: "smooth" });
});
nextBtn.addEventListener("click", async () => {
  if (page >= totalPages) return;
  page += 1;
  await runSearch({ showAiSequence: false });
  document.querySelector(".results-area")?.scrollTo?.({ top: 0, behavior: "smooth" });
});

// ================= Rendering =================
function renderCards(ranked) {
  cardsGrid.innerHTML = "";
  ranked.forEach((entry, idx) => {
    const { profile: p, score } = entry;
    const cat = categoryMeta(p.category);
    const matchPct = Math.round(score * 100);
    const isTopMatch = idx < 3 && matchPct >= 60;

    const media = p.image
      ? `<img class="profile-thumb" src="${p.image}" alt="${p.name}" />`
      : `<div class="profile-thumb profile-thumb-fallback"><i data-lucide="user"></i></div>`;

    const languages = Array.isArray(p.languages) && p.languages.length
      ? `<div class="chip-row">${p.languages.map((l) => `<span class="lang-chip"><i data-lucide="languages"></i>${l}</span>`).join("")}</div>`
      : "";

    const skills = p.skills.length
      ? `<div class="chip-row">${p.skills.slice(0, 6).map((s) => `<span class="skill-chip">${s}</span>`).join("")}${p.skills.length > 6 ? `<span class="skill-chip more">+${p.skills.length - 6}</span>` : ""}</div>`
      : "";

    const card = document.createElement("div");
    card.className = "profile-card";
    card.style.animationDelay = `${Math.min(idx, 10) * 30}ms`;
    card.innerHTML = `
      ${isTopMatch ? `<div class="top-match-ribbon"><i data-lucide="sparkles"></i>Top match</div>` : ""}
      <div class="profile-card-top">
        ${media}
        <div class="profile-card-id">
          <div class="profile-name">${p.name || "Unnamed"}</div>
          <div class="profile-role-row">
            <span class="profile-category-badge">${cat ? cat.label : p.category}</span>
            ${p.rating ? `<span class="profile-rating"><i data-lucide="star"></i>${Number(p.rating).toFixed(1)}</span>` : ""}
          </div>
        </div>
        <span class="match-pill" title="Ranked on experience, rating, team size, skills & languages">${matchPct}% match</span>
      </div>
      <div class="profile-card-body">
        <div class="profile-meta">
          <span>${p.role || ""}</span>
          ${p.experience ? `<span><i data-lucide="award"></i>${p.experience} yrs exp.</span>` : ""}
          ${p.teamSize ? `<span><i data-lucide="users"></i>Team of ${p.teamSize}</span>` : ""}
        </div>
        <div class="profile-meta">
          ${p.location || p.district ? `<span><i data-lucide="map-pin"></i>${p.location || `${p.district}, ${p.state}`}</span>` : ""}
        
        </div>
        ${skills}
        ${languages}
        ${p.description ? `<p class="profile-desc">${p.description}</p>` : ""}
      </div>
      <div class="profile-card-actions">
        <a class="card-btn view-btn" href="${p.profileUrl}"><i data-lucide="user"></i> View profile</a>
        ${p.phone ? `<a class="card-btn call-btn" href="tel:${p.phone}" aria-label="Call"><i data-lucide="phone"></i></a>` : ""}
      </div>
    `;
    cardsGrid.appendChild(card);
  });
  refreshIcons();
}

// ================= Search input ================
let searchTimer;
searchInput.addEventListener("input", () => {
  clearSearchBtn.classList.toggle("hidden", !searchInput.value);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filters.search = searchInput.value.trim();
    page = 1;
    runSearch();
  }, 450);
});
clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearSearchBtn.classList.add("hidden");
  filters.search = "";
  page = 1;
  runSearch();
  searchInput.focus();
});

// ================= Filter sheet ================
function openSheet() {
  // sync sheet inputs to current filters
  fCategory.value = filters.category;
  fCategory.dispatchEvent(new Event("change"));
  fRole.value = filters.role;
  fAddress.value = filters.address;
  fPhone.value = filters.phone;
  fState.value = filters.state;
  fState.dispatchEvent(new Event("change"));
  fDistrict.value = filters.district;

  filterBackdrop.classList.remove("hidden");
  filterSheet.classList.remove("hidden");
  requestAnimationFrame(() => {
    filterBackdrop.classList.add("open");
    filterSheet.classList.add("open");
  });
}
function closeSheet() {
  filterBackdrop.classList.remove("open");
  filterSheet.classList.remove("open");
  setTimeout(() => {
    filterBackdrop.classList.add("hidden");
    filterSheet.classList.add("hidden");
  }, 220);
}
filterBtn.addEventListener("click", openSheet);
filterCloseBtn.addEventListener("click", closeSheet);
filterBackdrop.addEventListener("click", closeSheet);

fCategory.addEventListener("change", () => {
  fRole.innerHTML = '<option value="">All roles</option>';
  if (fCategory.value) {
    const cat = categoryMeta(fCategory.value);
    cat.roles.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r; opt.textContent = r;
      fRole.appendChild(opt);
    });
    roleField.style.display = "";
  } else {
    roleField.style.display = "none";
  }
  refreshIcons();
});

fState.addEventListener("change", () => {
  const districts = STATE_DISTRICTS[fState.value] || [];
  fDistrict.innerHTML = '<option value="">All districts</option>';
  districts.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d; opt.textContent = d;
    fDistrict.appendChild(opt);
  });
  fDistrict.disabled = !fState.value;
});

function updateFilterDot() {
  const active = filters.category || filters.role || filters.address || filters.phone || filters.state || filters.district;
  filterDot.classList.toggle("hidden", !active);
}

applyFiltersBtn.addEventListener("click", () => {
  filters.category = fCategory.value;
  filters.role = fRole.value;
  filters.address = fAddress.value.trim();
  filters.phone = fPhone.value.trim();
  filters.state = fState.value;
  filters.district = fDistrict.value;
  page = 1;
  updateFilterDot();
  renderChips();
  closeSheet();
  runSearch();
});

clearFiltersBtn.addEventListener("click", () => {
  fCategory.value = ""; fCategory.dispatchEvent(new Event("change"));
  fRole.value = "";
  fAddress.value = "";
  fPhone.value = "";
  fState.value = ""; fState.dispatchEvent(new Event("change"));
  fDistrict.value = "";
});

// ---- Active filter chips ----
function renderChips() {
  activeFilters.innerHTML = "";
  const entries = [];
  if (filters.category) entries.push(["category", categoryMeta(filters.category)?.label || filters.category]);
  if (filters.role) entries.push(["role", filters.role]);
  if (filters.address) entries.push(["address", filters.address]);
  if (filters.phone) entries.push(["phone", filters.phone]);
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
  filters[key] = "";
  if (key === "category") filters.role = "";
  if (key === "state") filters.district = "";
  page = 1;
  updateFilterDot();
  renderChips();
  runSearch();
}

// ---- Boot ----
refreshIcons();
setUiState("idle");