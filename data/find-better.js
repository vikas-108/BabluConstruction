const API = "https://api.buildskil.com/api/profiles/public",
  PAGE_SIZE = 20;
let filters = {
    search: "",
    category: "",
    role: "",
    address: "",
    phone: "",
    state: "",
    district: "",
  },
  page = 1,
  totalPages = 1,
  total = 0,
  bookedCount = 0,
  typingTimer;
const $ = (id) => document.getElementById(id);
const esc = escapeHtml;
const categoryLabels = {
  contractor: "Contractor",
  technician: "Technician",
  supplier: "Supplier",
  architecture: "Architecture",
  mechanic: "Mechanic",
};
Object.keys(categories).forEach((k) =>
  $("fCategory").insertAdjacentHTML(
    "beforeend",
    `<option value="${esc(k)}">${esc(categoryLabels[k] || k)}</option>`,
  ),
);
states.forEach((s) =>
  $("fState").insertAdjacentHTML(
    "beforeend",
    `<option value="${esc(s)}">${esc(s)}</option>`,
  ),
);
function normalize(p) {
  return {
    // Profile document ID
    id: String(
      p?._id ||
      ""
    ),

    // IMPORTANT:
    // This must be the actual User ID of the worker.
    // Booking backend uses this ID.
    userId: String(
      p?.userId ||
      p?.user?._id ||
      p?.user?.id ||
      p?.accountId ||
      ""
    ),

    name: p?.name || "",

    role: p?.role || "",

    rating: p?.rating,

    experience: p?.experience,

    teamSize: p?.teamSize,

    skills:
      Array.isArray(p?.skills)
        ? p.skills
        : [],

    category:
      p?.category || "",

    image:
      p?.mediaType === "image"
        ? p.media
        : "",

    video:
      p?.mediaType === "video"
        ? p.media
        : "",

    languages:
      Array.isArray(p?.languages)
        ? p.languages
        : [],

    phone:
      p?.phone || "",

    description:
      p?.description || "",

    location:
      p?.location || "",

    state:
      p?.state || "",

    district:
      p?.district || "",
        // ONLY verified profiles are allowed
    verified:
      p?.verified === true,
  };
}
function normalizeResponse(j) {
  if (Array.isArray(j)) return { data: j, total: j.length, totalPages: 1 };
  const data = j?.data || j?.results || [];
  const t = j?.total ?? data.length;
  return {
    data,
    total: t,
    totalPages: j?.totalPages || Math.max(1, Math.ceil(t / PAGE_SIZE)),
  };
}
function score(p) {
  const exp = Math.min(Number(p.experience) || 0, 20) / 20,
    rat = Math.min(Number(p.rating) || 0, 5) / 5,
    team = Math.min(Number(p.teamSize) || 0, 50) / 50,
    skills = Math.min(p.skills.length, 8) / 8,
    langs = Math.min(p.languages.length, 4) / 4;
  return Math.min(
    1,
    exp * 0.3 +
      rat * 0.25 +
      team * 0.15 +
      skills * 0.15 +
      langs * 0.1 +
      (filters.role &&
      normalizeRoleValue(p.role) === normalizeRoleValue(filters.role)
        ? 0.15
        : 0),
  );
}
function normalizeRoleValue(v) {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}
function matches(p) {
  if (
    filters.search &&
    ![
      p.name,
      p.role,
      p.category,
      p.description,
      p.location,
      p.state,
      p.district,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(filters.search.toLowerCase())
  )
    return false;
  if (
    filters.category &&
    p.category.toLowerCase() !== filters.category.toLowerCase()
  )
    return false;
  if (
    filters.role &&
    normalizeRoleValue(p.role) !== normalizeRoleValue(filters.role)
  )
    return false;
  if (
    filters.address &&
    ![p.location, p.district, p.state]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(filters.address.toLowerCase())
  )
    return false;
  if (
    filters.phone &&
    String(p.phone || "")
      .replace(/\D/g, "")
      .indexOf(filters.phone.replace(/\D/g, "")) < 0
  )
    return false;
  if (filters.state && p.state.toLowerCase() !== filters.state.toLowerCase())
    return false;
  if (
    filters.district &&
    p.district.toLowerCase() !== filters.district.toLowerCase()
  )
    return false;
  return true;
}
async function search(pageNum = 1) {
  if (!Object.values(filters).some(Boolean)) {
    $("state").innerHTML =
      '<div class="empty"><div class="icon">👥</div><h2>Find people for your work</h2><p>Search by name or use filters to find contractors, technicians, suppliers and more.</p></div>';
    $("results").innerHTML = "";
    return;
  }
  $("state").innerHTML =
    '<div class="ai"><div class="ai-orb">✦</div><div class="ai-status" id="aiStatus">Understanding your search…</div><div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>';
  const start = Date.now();
  try {
    const qs = new URLSearchParams();
    if (filters.search) qs.set("q", filters.search);
    if (filters.category) qs.set("category", filters.category);
    if (filters.role) qs.set("role", filters.role);
    if (filters.address) qs.set("address", filters.address);
    if (filters.phone) qs.set("phone", filters.phone);
    if (filters.state) qs.set("state", filters.state);
    if (filters.district) qs.set("district", filters.district);
    // VERY IMPORTANT
    // Ask backend for verified profiles only
    qs.set("verified", "true");
    qs.set("page", pageNum);
    qs.set("limit", PAGE_SIZE);
    const r = await fetch(`${API}?${qs}`);
    const j = await r.json();
    if (!r.ok) throw new Error(j?.message || `Request failed (${r.status})`);
    const out = normalizeResponse(j);
    const wait = Math.max(0, 1400 - (Date.now() - start));
    if (wait) await new Promise((res) => setTimeout(res, wait));
    let data = out.data
  // Never allow verified:false profiles into UI
  .filter((x) => x?.verified === true)
  .map((x) => {
    const p = normalize(x);

    return {
      profile: p,
      score: score(p),
    };
  })
  .filter((x) => x.profile.verified === true)
  .filter((x) => matches(x.profile))
  .sort((a, b) => b.score - a.score);
    total = out.total;
    totalPages = out.totalPages;
    page = pageNum;
    renderResults(data);
  } catch (e) {
    $("state").innerHTML =
      `<div class="empty"><div class="icon">⚠️</div><h2>Search error</h2><p>${esc(e.message || "Could not search profiles right now.")}</p></div>`;
  }
}
function renderResults(data) {
  $("state").innerHTML = "";
  if (!data.length) {
    $("results").innerHTML =
      '<div class="empty"><div class="icon">🔎</div><h2>No profiles match your search.</h2></div>';
    return;
  }
  $("results").innerHTML =
    `<div class="meta" style="margin-bottom:10px">${total} profile${total === 1 ? "" : "s"} found · sorted by best match</div>` +
    data
  .filter(
    (x) => x?.profile?.verified === true
  )
  .map((x, i) => {
        const p = x.profile;
         profileCache.set(
      String(p.id),
      p
    );
        return `<article class="card"><div class="profile-head"><div class="avatar">${p.image ? `<img src="${esc(p.image)}" alt="">` : "👤"}</div><div class="identity"><div class="name">${esc(p.name || "Unnamed")}</div><div class="row" style="margin-top:5px"><span class="badge">${esc(categoryLabels[p.category] || p.category || "Professional")}</span>${p.role ? `<span class="sub">${esc(p.role)}</span>` : ""}</div>${p.phone ? `<div class="sub" style="margin-top:5px">${esc(p.phone)}</div>` : ""}</div><span class="status">${Math.round(x.score * 100)}% match</span></div><div class="muted" style="margin-top:12px">${esc([p.location, p.district, p.state].filter(Boolean).join(", "))}</div>${
          p.skills?.length
            ? `<div class="chips" style="margin-top:9px">${p.skills
                .slice(0, 6)
                .map((s) => `<span class="chip">${esc(s)}</span>`)
                .join("")}</div>`
            : ""
        }${
  p.description
    ? `<p class="muted profile-description">${esc(p.description)}</p>`
    : ""
}

<div class="actions">

  <button
    class="btn secondary view-profile-btn"
    type="button"
    data-profile-id="${esc(p.id)}"
  >
    👤 View profile
  </button>

  <button
    class="btn primary book-user-btn"
    type="button"
    data-profile-id="${esc(p.id)}"
  >
    📅 Book user
  </button>

</div>

</article>`
      })
      .join("") +
    `<div class="pagination">

    <button
        type="button"
        class="btn secondary pagination-btn"
        data-page="${page - 1}"
        ${page <= 1 ? "disabled" : ""}
    >
        ‹ Prev
    </button>

    <span class="meta">
        Page ${page} of ${totalPages}
    </span>

    <button
        type="button"
        class="btn secondary pagination-btn"
        data-page="${page + 1}"
        ${page >= totalPages ? "disabled" : ""}
    >
        Next ›
    </button>

</div>`
}
document
    .querySelectorAll(
        "#results .pagination-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const nextPage =
                    Number(
                        button.dataset.page
                    );

                if (
                    !Number.isFinite(
                        nextPage
                    )
                ) {
                    return;
                }

                search(nextPage);
            }
        );

    });

    const resultsContainer =
  document.getElementById("results");

const profileCache = new Map();

if (resultsContainer) {

  resultsContainer.addEventListener(
    "click",
    function (event) {

      const target =
        event.target.closest("button");

      if (!target) {
        return;
      }

      /*
       * VIEW PROFILE
       */
      if (
        target.classList.contains(
          "view-profile-btn"
        )
      ) {

        const profileId =
          target.dataset.profileId;

        if (!profileId) {
          return;
        }

        window.location.href =
          `../profile-details.html?id=${encodeURIComponent(
            profileId
          )}`;

        return;
      }

      /*
       * BOOK USER
       */
      if (
        target.classList.contains(
          "book-user-btn"
        )
      ) {

        const profileId =
          target.dataset.profileId;

        if (!profileId) {
          return;
        }

        const profile =
          profileCache.get(profileId);

        if (!profile) {
          console.error(
            "Profile not found in cache:",
            profileId
          );

          return;
        }

        bookProfile(profile);
      }

    }
  );
}
function bookProfile(p) {

  // ---------------------------------------------
  // BuildSkil login is required
  // ---------------------------------------------

  const token =
    localStorage.getItem(
      "cb_token"
    );

  if (!token) {
    showToast(
      "Please sign in to BuildSkil first."
    );

    return;
  }


  // ---------------------------------------------
  // Get CURRENT logged-in user
  // ---------------------------------------------

  const me =
    readLoginUser();

  const clientId =
    me?.id ||
    me?._id ||
    "";


  if (!clientId) {
    showToast(
      "Your login session is invalid. Please sign in again."
    );

    return;
  }


  // ---------------------------------------------
  // Worker must have actual User ID
  // ---------------------------------------------

  const workerUserId =
    p?.userId ||
    p?.user?._id ||
    p?.user?.id ||
    p?.accountId ||
    "";


  if (!workerUserId && !p?.phone) {
    showToast(
      "This profile cannot be booked because its account information is missing."
    );

    console.error(
      "BOOKING: Worker profile has no userId or phone:",
      p
    );

    return;
  }


  // ---------------------------------------------
  // IMPORTANT
  // Store selected profile together with
  // CURRENT CLIENT ID.
  //
  // This prevents User B from seeing User A's
  // previously selected booking profile.
  // ---------------------------------------------

  sessionStorage.setItem(
    "buildskil_booking_profile_v2",
    JSON.stringify({
      clientId:
        String(clientId),

      profile: {
        ...p,

        userId:
          String(
            workerUserId
          ),
      },
    })
  );


  // ---------------------------------------------
  // Also keep old profile session if another
  // part of the page still uses it.
  // ---------------------------------------------

  if (
    typeof setProfileSession ===
    "function"
  ) {
    setProfileSession({
      ...p,

      userId:
        String(
          workerUserId
        ),
    });
  }


  location.href =
    "book-user.html";
}
function renderChips() {
  const arr = [];
  for (const k of ["category", "role", "address", "phone", "state", "district"])
    if (filters[k])
      arr.push(
  `<span class="chip active">
      ${esc(filters[k])}
      <button
        type="button"
        class="chip-remove"
        data-filter="${esc(k)}"
        aria-label="Remove ${esc(k)} filter"
      >
        ×
      </button>
   </span>`,
);
  $("chips").innerHTML = arr.join("");
}

$("chips").addEventListener("click", (event) => {
  const button = event.target.closest(".chip-remove");

  if (!button) {
    return;
  }

  const filterKey = button.dataset.filter;

  if (!filterKey) {
    return;
  }

  removeFilter(filterKey);
});
function removeFilter(k) {
  filters[k] = "";
  if (k === "category") filters.role = "";
  if (k === "state") filters.district = "";
  syncFilterUI();
  renderChips();
  search(1);
}
function syncFilterUI() {
  $("fCategory").value = filters.category;
  $("fRole").innerHTML =
    '<option value="">All roles</option>' +
    (filters.category
      ? (categories[filters.category] || [])
          .map(
            (x) =>
              `<option value="${esc(normalizeRoleValue(x))}">${esc(x)}</option>`,
          )
          .join("")
      : "");
  $("fRole").value = filters.role;
  $("fState").value = filters.state;
  $("fDistrict").innerHTML =
    '<option value="">All districts</option>' +
    (filters.state
      ? (districts[filters.state] || [])
          .map((x) => `<option value="${esc(x)}">${esc(x)}</option>`)
          .join("")
      : "");
  $("fDistrict").value = filters.district;
  $("fAddress").value = filters.address;
  $("fPhone").value = filters.phone;
}
function applyFilters() {
  filters.category = $("fCategory").value;
  filters.role = $("fRole").value;
  filters.address = $("fAddress").value.trim();
  filters.phone = $("fPhone").value.replace(/\D/g, "");
  filters.state = $("fState").value;
  filters.district = $("fDistrict").value;
  renderChips();
  $("filterModal").classList.remove("show");
  search(1);
}
$("filterBtn").onclick = () => {
  $("filterModal").classList.add("show");
  syncFilterUI();
};
$("filterClose").onclick = () => $("filterModal").classList.remove("show");
$("filterModal").onclick = (e) => {
  if (e.target.id === "filterModal") $("filterModal").classList.remove("show");
};
$("applyFilters").onclick = applyFilters;
$("clearFilters").onclick = () => {
  const keep = filters.search;
  filters = {
    search: keep,
    category: "",
    role: "",
    address: "",
    phone: "",
    state: "",
    district: "",
  };
  syncFilterUI();
  renderChips();
  $("filterModal").classList.remove("show");
  search(1);
};
$("fCategory").onchange = () => {
  $("fRole").innerHTML =
    '<option value="">All roles</option>' +
    (categories[$("fCategory").value] || [])
      .map(
        (x) =>
          `<option value="${esc(normalizeRoleValue(x))}">${esc(x)}</option>`,
      )
      .join("");
};
$("fState").onchange = () => {
  $("fDistrict").innerHTML =
    '<option value="">All districts</option>' +
    (districts[$("fState").value] || [])
      .map((x) => `<option value="${esc(x)}">${esc(x)}</option>`)
      .join("");
};
$("search").oninput = (e) => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    filters.search = e.target.value.trim();
    search(1);
  }, 450);
};



 const backBtn =
    document.getElementById("backBtn");
// Back button
  if (backBtn) {
    backBtn.addEventListener(
      "click",
      () => {
        history.back();
      }
    );
  }
  