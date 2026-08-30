//"use strict";
let activeRequests = 0;
/* =========================================================
   ROUTINE PAY API
========================================================= */

const ROUTINE_PAY_BASE =
  window.ROUTINE_PAY_BASE ||
  "https://api.buildskil.com/api/routinepay/buiders";

const BUILD_TOKEN_KEY = "cb_token";

const state = {
  projects: [],
  activeProjectId: null,
  contractors: [],
  workDetails: {},
  payments: [],
  sharedHistory: []
};

let editingContractorId = null;
let workContractorId = null;
let paymentContractorId = null;
let roleEditorSeq = 0;

/* =========================================================
   HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return "₹" + Math.round(Number(value) || 0).toLocaleString("en-IN");
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function showToast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 2500);
}

function token() {
  return localStorage.getItem(BUILD_TOKEN_KEY);
}

function authHeaders(json = true) {
  const headers = {};
  const t = token();

  if (t) {
    headers.Authorization = `Bearer ${t}`;
  }

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${ROUTINE_PAY_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(options.body !== undefined),
      ...(options.headers || {})
    }
  });

  let data = null;

  try {
    data = await response.json();
  } catch (_) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      `Request failed (${response.status})`
    );
  }

  return data;
}

function openModal(id) {
  $(id)?.classList.add("show");
}

function closeModal(id) {
  $(id)?.classList.remove("show");
}

function activeProject() {
  return state.projects.find(
    (p) => String(p._id || p.id) === String(state.activeProjectId)
  ) || null;
}

function projectId(project) {
  return project?._id || project?.id;
}

function contractorId(contractor) {
  return contractor?._id || contractor?.id;
}

function activeContractors() {
  return state.contractors.filter(
    (c) => String(c.project || c.projectId) === String(state.activeProjectId)
  );
}

function iconFor(c) {
  const s = String(c.category || "").toLowerCase();

  if (s.includes("lohar") || s.includes("steel") || s.includes("iron")) {
    return "fa-helmet-safety";
  }

  if (s.includes("shutter")) return "fa-layer-group";
  if (s.includes("plumb")) return "fa-faucet";
  if (s.includes("electric")) return "fa-bolt";
  if (s.includes("paint")) return "fa-paint-roller";

  return "fa-building";
}

function normalizeProject(p) {
  return {
    ...p,
    sharedWith: Array.isArray(p.sharedWith) ? p.sharedWith : []
  };
}

function normalizeContractor(c) {
  return {
    ...c,
    roles: Array.isArray(c.roles) ? c.roles : []
  };
}

/* =========================================================
   API LOAD
========================================================= */


async function loadSharedProjects() {
  try {
    const data = await apiFetch("/shared-projects");

    return Array.isArray(data)
      ? data.map((project) => ({
          ...normalizeProject(project),
          access: "shared"
        }))
      : [];
  } catch (err) {
    console.error("LOAD SHARED PROJECTS:", err);
    return [];
  }
}

async function loadProjects() {
  const [ownedData, sharedData] = await Promise.all([
    apiFetch("/projects"),
    loadSharedProjects()
  ]);

  const owned = Array.isArray(ownedData)
    ? ownedData.map((p) => ({
        ...normalizeProject(p),
        access: "owner"
      }))
    : [];

  const shared = Array.isArray(sharedData)
    ? sharedData.map((p) => ({
        ...normalizeProject(p),
        access: "shared"
      }))
    : [];

  // Avoid duplicates if the same project somehow appears in both lists.
  const map = new Map();

  owned.forEach((p) => map.set(String(projectId(p)), p));
  shared.forEach((p) => {
    if (!map.has(String(projectId(p)))) {
      map.set(String(projectId(p)), p);
    }
  });

  state.projects = [...map.values()];

  if (
    !state.activeProjectId ||
    !state.projects.some(
      (p) => String(projectId(p)) === String(state.activeProjectId)
    )
  ) {
    state.activeProjectId =
      state.projects.length
        ? projectId(state.projects[0])
        : null;
  }
}

async function loadContractors() {
  if (!state.activeProjectId) {
    state.contractors = [];
    return;
  }

  const data = await apiFetch(
    `/contractors?projectId=${encodeURIComponent(state.activeProjectId)}`
  );

  state.contractors = Array.isArray(data)
    ? data.map(normalizeContractor)
    : [];
}

async function loadWorkDetails() {
  if (!state.activeProjectId) {
    state.workDetails = {};
    return;
  }

  const data = await apiFetch(
    `/work?projectId=${encodeURIComponent(state.activeProjectId)}`
  );

  state.workDetails = {};

  if (!Array.isArray(data)) return;

  data.forEach((item) => {
    const cid =
      item.contractor?._id ||
      item.contractor ||
      item.contractorId;

    if (!cid || !item.date) return;

    state.workDetails[item.date] ||= {};
    state.workDetails[item.date][cid] = {
      ...item,
      contractorId: cid,
      roles: Array.isArray(item.roles) ? item.roles : []
    };
  });
}

async function loadPayments() {
  if (!state.activeProjectId) {
    state.payments = [];
    return;
  }

  const data = await apiFetch(
    `/payments?projectId=${encodeURIComponent(state.activeProjectId)}`
  );

  state.payments = Array.isArray(data) ? data : [];
}


async function loadSharedHistory() {
  if (!state.activeProjectId) return null;

  const data = await apiFetch(
    `/shared-history?projectId=${encodeURIComponent(state.activeProjectId)}`
  );

  return data;
}

async function reloadActiveProjectData() {
  const p = activeProject();

  if (p?.access === "shared") {
    // Shared user is read-only and receives only project history.
    state.contractors = [];
    state.workDetails = {};
    state.payments = [];

    const data = await loadSharedHistory();

    if (data?.project) {
      state.projects = state.projects.map((item) =>
        String(projectId(item)) === String(data.project._id)
          ? normalizeProject({
              ...item,
              ...data.project,
              access: "shared"
            })
          : item
      );
    }

    state.sharedHistory = Array.isArray(data?.history)
      ? data.history
      : [];

    renderContractors();
    refreshHistoryFilters();
    renderHistory();
    return;
  }

  state.sharedHistory = [];

  await Promise.all([
    loadContractors(),
    loadWorkDetails(),
    loadPayments()
  ]);

  renderContractors();
  refreshHistoryFilters();
  renderHistory();
}

async function init() {
  try {
    if (!token()) {
      showToast("Please log in to BuildSkil first.");
      return;
    }

    await loadProjects();

    if (!state.projects.length) {
      renderProjectSelect();
      renderProjectList();
      renderContractors();
      refreshHistoryFilters();
      return;
    }

    await reloadActiveProjectData();

    renderProjectSelect();
    renderProjectList();
  } catch (err) {
    console.error("ROUTINE PAY INIT:", err);
    showToast(err.message || "Failed to load RoutinePay.");
  }
}

/* =========================================================
   PROJECTS
========================================================= */

function renderProjectSelect() {
  const select = $("projectSelect");
  const label = $("activeProjectLabel");
  const p = activeProject();

  if (select) {
    select.innerHTML = state.projects.map((project) => `
      <option
        value="${esc(projectId(project))}"
        ${String(projectId(project)) === String(state.activeProjectId) ? "selected" : ""}
      >${esc(project.name)}${project.access === "shared" ? " — Shared" : ""}</option>
    `).join("");
  }

  if (label) {
    label.textContent = p
      ? p.access === "shared"
        ? `Shared project: ${p.name}. History is read-only.`
        : `Project: ${p.name}. Manage contractors and today's work.`
      : "Create a project to begin.";
  }
}

async function selectProject(id) {
  if (
    !state.projects.some(
      (p) => String(projectId(p)) === String(id)
    )
  ) return;

  state.activeProjectId = id;
  renderProjectSelect();

  try {
    await reloadActiveProjectData();
    showToast("Project switched");
  } catch (err) {
    console.error("SELECT PROJECT:", err);
    showToast(err.message || "Failed to load project.");
  }
}

function renderProjectList() {
  const list = $("projectList");

  if (!state.projects.length) {
    list.innerHTML = `
      <div class="empty">
        No projects yet. Create your first construction site.
      </div>
    `;
    return;
  }

  list.innerHTML = state.projects.map((p) => {
    const pid = projectId(p);
    const gps = p.lat != null && p.lng != null
      ? `GPS · ${p.radius || 150}m`
      : "GPS not set";

    const shared = (p.sharedWith || []).length;

    return `
      <div class="project-item ${String(pid) === String(state.activeProjectId) ? "active" : ""}">
        <div class="project-item-top">
          <div>
            <strong style="font-size:13px">${esc(p.name)}</strong>
            <div class="project-meta">
              ${esc(p.location || "No location")}
              ${p.code ? ` · ${esc(p.code)}` : ""}
              · ${gps}
              ${shared ? ` · ${shared} shared` : ""}
            </div>
          </div>

          <div class="project-actions">
            <button
              class="btn btn-light"
              data-action="select-project"
              data-id="${esc(pid)}"
            >Open</button>

            <button
              class="btn btn-light"
              data-action="edit-project"
              data-id="${esc(pid)}"
            >Edit</button>

            <button
              class="icon-btn"
              data-action="delete-project"
              data-id="${esc(pid)}"
              title="Delete"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function clearProjectForm() {
  $("projectIdEdit").value = "";
  $("projectName").value = "";
  $("projectLocation").value = "";
  $("projectCode").value = "";
  $("projectLat").value = "";
  $("projectLng").value = "";
  $("projectRadius").value = 150;
}

function openProjectModal(id = null) {
  if (id) {
    const p = state.projects.find(
      (x) => String(projectId(x)) === String(id)
    );
    if (p?.access === "shared") {
      showToast("Shared project cannot be edited.");
      return;
    }
  }

  clearProjectForm();

  if (id) {
    const p = state.projects.find(
      (x) => String(projectId(x)) === String(id)
    );

    if (!p) return;

    $("projectIdEdit").value = projectId(p);
    $("projectName").value = p.name || "";
    $("projectLocation").value = p.location || "";
    $("projectCode").value = p.code || "";
    $("projectLat").value = p.lat ?? "";
    $("projectLng").value = p.lng ?? "";
    $("projectRadius").value = p.radius || 150;
  }

  renderProjectList();
  openModal("projectModal");
}

async function saveProject() {
  const editId = $("projectIdEdit").value;
  const name = $("projectName").value.trim();
  const location = $("projectLocation").value.trim();
  const code = $("projectCode").value.trim();
  const latRaw = $("projectLat").value.trim();
  const lngRaw = $("projectLng").value.trim();
  const radius = Number($("projectRadius").value) || 150;

  if (!name) {
    showToast("Enter project name");
    return;
  }

  if (
    latRaw !== "" &&
    (
      !Number.isFinite(Number(latRaw)) ||
      Number(latRaw) < -90 ||
      Number(latRaw) > 90
    )
  ) {
    showToast("Invalid latitude");
    return;
  }

  if (
    lngRaw !== "" &&
    (
      !Number.isFinite(Number(lngRaw)) ||
      Number(lngRaw) < -180 ||
      Number(lngRaw) > 180
    )
  ) {
    showToast("Invalid longitude");
    return;
  }

  if (radius <= 0) {
    showToast("Radius must be greater than zero");
    return;
  }

  const body = {
    name,
    location,
    code,
    lat: latRaw === "" ? null : Number(latRaw),
    lng: lngRaw === "" ? null : Number(lngRaw),
    radius
  };

  try {
    let saved;

    if (editId) {
      saved = await apiFetch(
        `/projects/${encodeURIComponent(editId)}`,
        {
          method: "PUT",
          body: JSON.stringify(body)
        }
      );

      state.projects = state.projects.map((p) =>
        String(projectId(p)) === String(editId)
          ? normalizeProject(saved)
          : p
      );
    } else {
      saved = await apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify(body)
      });

      state.projects.unshift(normalizeProject(saved));
      state.activeProjectId = projectId(saved);
    }

    closeModal("projectModal");

    renderProjectSelect();
    renderProjectList();

    await reloadActiveProjectData();

    showToast(editId ? "Project updated" : "Project created");
  } catch (err) {
    console.error("SAVE PROJECT:", err);
    showToast(err.message || "Failed to save project.");
  }
}

async function deleteProject(id) {
  const p = state.projects.find(
    (x) => String(projectId(x)) === String(id)
  );

  if (!p) return;

  if (
    !confirm(
      `Delete ${p.name}? All contractors, work and payments for this project will be deleted.`
    )
  ) return;

  try {
    await apiFetch(
      `/projects/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );

    state.projects = state.projects.filter(
      (x) => String(projectId(x)) !== String(id)
    );

    if (!state.projects.length) {
      state.activeProjectId = null;
      state.contractors = [];
      state.workDetails = {};
      state.payments = [];
    } else if (
      String(state.activeProjectId) === String(id)
    ) {
      state.activeProjectId = projectId(state.projects[0]);
      await reloadActiveProjectData();
    }

    renderProjectSelect();
    renderProjectList();
    renderContractors();
    refreshHistoryFilters();
    renderHistory();

    showToast("Project deleted");
  } catch (err) {
    console.error("DELETE PROJECT:", err);
    showToast(err.message || "Failed to delete project.");
  }
}

function useCurrentProjectLocation() {
  if (!navigator.geolocation) {
    showToast("Geolocation is not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      $("projectLat").value =
        pos.coords.latitude.toFixed(6);

      $("projectLng").value =
        pos.coords.longitude.toFixed(6);

      showToast("Current location added");
    },
    () => showToast("Could not get current location"),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

/* =========================================================
   CONTRACTORS
========================================================= */

function resetContractorForm() {
  $("contractorId").value = "";
  $("contractorName").value = "";
  $("contractorCategory").value = "";
  $("contractorPhone").value = "";
  $("roleEditors").innerHTML = "";

  addRoleEditor({
    name: "Technician",
    count: 0,
    wage: 0
  });

  addRoleEditor({
    name: "Helper",
    count: 0,
    wage: 0
  });
}

function openContractorModal(id = null) {
  if (activeProject()?.access === "shared") {
    showToast("Shared project is read-only.");
    return;
  }

  editingContractorId = id;
  roleEditorSeq = 0;
  $("contractorModalTitle").textContent =
    id ? "Edit Contractor" : "Create Contractor";

  if (id) {
    const c = state.contractors.find(
      (x) => String(contractorId(x)) === String(id)
    );

    if (!c) return;

    $("contractorId").value = contractorId(c);
    $("contractorName").value = c.name || "";
    $("contractorCategory").value = c.category || "";
    $("contractorPhone").value = c.phone || "";
    $("roleEditors").innerHTML = "";

    (c.roles || []).forEach((role) =>
      addRoleEditor(role)
    );
  } else {
    resetContractorForm();
  }

  openModal("contractorModal");
}

function addRoleEditor(role = {}) {
  const id = `role-editor-${++roleEditorSeq}`;

  $("roleEditors").insertAdjacentHTML(
    "beforeend",
    `
      <div class="role-editor" id="${id}">
        <div class="role-editor-head">
          <strong>Role</strong>
          <button
            class="icon-btn"
            data-action="remove-role"
            data-role-editor="${id}"
            title="Remove"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="role-grid">
          <div class="form-group">
            <label>Role Name</label>
            <input
              class="role-name"
              value="${esc(role.name || "")}"
              placeholder="Technician"
            >
          </div>

          <div class="form-group">
            <label>Number</label>
            <input
              class="role-count"
              type="number"
              min="0"
              value="${Number(role.count) || 0}"
            >
          </div>

          <div class="form-group">
            <label>Daily Wage</label>
            <input
              class="role-wage"
              type="number"
              min="0"
              value="${Number(role.wage) || 0}"
              placeholder="₹"
            >
          </div>
        </div>
      </div>
    `
  );
}

async function saveContractor() {
  if (activeProject()?.access === "shared") {
    showToast("Shared project is read-only.");
    return;
  }
  if (!state.activeProjectId) {
    showToast("Create/select a project first");
    return;
  }

  const id = $("contractorId").value;
  const name = $("contractorName").value.trim();
  const category = $("contractorCategory").value.trim();
  const phone = $("contractorPhone").value.replace(/\D/g, "");

  if (!name) {
    showToast("Enter contractor name");
    return;
  }

  if (phone && phone.length !== 10) {
    showToast("Phone must contain 10 digits");
    return;
  }

  const roles = [
    ...$("roleEditors").querySelectorAll(".role-editor")
  ]
    .map((el) => ({
      name: el.querySelector(".role-name").value.trim(),
      count: Number(el.querySelector(".role-count").value) || 0,
      wage: Number(el.querySelector(".role-wage").value) || 0
    }))
    .filter((r) => r.name);

  if (!roles.length) {
    showToast("Add at least one role");
    return;
  }

  const body = {
    projectId: state.activeProjectId,
    name,
    category: category || "Contractor",
    phone,
    roles
  };

  try {
    if (id) {
      await apiFetch(
        `/contractors/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(body)
        }
      );

      showToast("Contractor updated");
    } else {
      await apiFetch("/contractors", {
        method: "POST",
        body: JSON.stringify(body)
      });

      showToast("Contractor created");
    }

    closeModal("contractorModal");
    await reloadActiveProjectData();
  } catch (err) {
    console.error("SAVE CONTRACTOR:", err);
    showToast(err.message || "Failed to save contractor.");
  }
}

async function deleteContractor(id) {
  const c = state.contractors.find(
    (x) => String(contractorId(x)) === String(id)
  );

  if (!c) return;

  if (!confirm(`Delete ${c.name}? Related work and payment records will also be deleted.`)) {
    return;
  }

  try {
    await apiFetch(
      `/contractors/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );

    await reloadActiveProjectData();
    showToast("Contractor deleted");
  } catch (err) {
    console.error("DELETE CONTRACTOR:", err);
    showToast(err.message || "Failed to delete contractor.");
  }
}

/* =========================================================
   WORK
========================================================= */

function rolesForDate(c, date) {
  const cid = contractorId(c);
  const saved = state.workDetails?.[date]?.[cid]?.roles;

  return Array.isArray(saved)
    ? saved.map((r) => ({ ...r }))
    : (c.roles || []).map((r) => ({ ...r }));
}

function totalCost(c, date) {
  return rolesForDate(c, date).reduce(
    (sum, role) =>
      sum +
      (Number(role.count) || 0) *
      (Number(role.wage) || 0),
    0
  );
}

function totalWorkers(c, date) {
  return rolesForDate(c, date).reduce(
    (sum, role) =>
      sum + (Number(role.count) || 0),
    0
  );
}
//current date value
function setCurrentWorkDate() {
  const input = document.getElementById("workDate");

  if (!input) return;

  const now = new Date();

  input.value =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

document.addEventListener("DOMContentLoaded", () => {
  setCurrentWorkDate();
});
function renderContractors() {
  const grid = $("contractorGrid");
  const date = $("workDate").value || todayISO();
  const list = activeContractors();

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty" style="grid-column:1/-1">
        <i
          class="fa-solid fa-building-circle-plus"
          style="font-size:28px;margin-bottom:8px"
        ></i>
        <div>No contractors for this project.</div>
        <div style="font-size:11px;margin-top:5px">
          Create a contractor to start recording work.
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map((c) => {
    const roles = rolesForDate(c, date);

    return `
      <article class="contractor-card">
        <div class="contractor-head">
          <div class="contractor-title">
            <div class="contractor-icon">
              <i class="fa-solid ${iconFor(c)}"></i>
            </div>
            <div>
              <h3>${esc(c.name)}</h3>
              <p>
                ${esc(c.category || "Contractor")}
                ${c.phone ? ` · ${esc(c.phone)}` : ""}
              </p>
            </div>
          </div>

          <div class="contractor-menu">
            <button
              class="icon-btn"
              data-action="edit-contractor"
              data-id="${esc(contractorId(c))}"
              title="Edit"
            >
              <i class="fa-solid fa-pen"></i>
            </button>

            <button
              class="icon-btn"
              data-action="delete-contractor"
              data-id="${esc(contractorId(c))}"
              title="Delete"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="contractor-body">
          <div class="contractor-stats">
            <div class="mini-stat">
              <small>Workers</small>
              <strong>${totalWorkers(c, date)}</strong>
            </div>

            <div class="mini-stat">
              <small>Today's Cost</small>
              <strong>${money(totalCost(c, date))}</strong>
            </div>
          </div>

          <div class="contractor-work">
            <div class="contractor-work-title">
              Today's workforce
            </div>

            ${
              roles.length
                ? roles.map((r) => `
                    <div class="work-line">
                      <span>${esc(r.name)}</span>
                      <b>
                        ${Number(r.count) || 0}
                        × ${money(r.wage)}
                      </b>
                    </div>
                  `).join("")
                : `
                  <div style="font-size:11px;color:#87919a">
                    No roles added.
                  </div>
                `
            }
          </div>
        </div>

        <div class="contractor-actions">
          <button
            class="btn btn-light"
            data-action="work-detail"
            data-id="${esc(contractorId(c))}"
          >
            <i class="fa-solid fa-list-check"></i>
            Today's Work Detail
          </button>

          <button
            class="btn btn-success"
            data-action="payment"
            data-id="${esc(contractorId(c))}"
          >
            <i class="fa-solid fa-indian-rupee-sign"></i>
            Payment
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function openWorkModal(id) {
  const c = state.contractors.find(
    (x) => String(contractorId(x)) === String(id)
  );

  if (!c) return;

  workContractorId = id;

  const date = $("workDate").value || todayISO();
  const roles = rolesForDate(c, date);

  $("workModalSub").textContent =
    `${c.name} · ${date}`;

  $("workEditor").innerHTML = roles.map(
    (role, index) => `
      <div class="role-editor">
        <div class="role-editor-head">
          <strong>${esc(role.name)}</strong>
          <span style="font-size:10px;color:#87919a">
            Today's detail
          </span>
        </div>

        <div class="role-grid">
          <div class="form-group">
            <label>Number</label>
            <input
              class="work-count"
              data-index="${index}"
              type="number"
              min="0"
              value="${Number(role.count) || 0}"
            >
          </div>

          <div class="form-group">
            <label>Daily Wage</label>
            <input
              class="work-wage"
              data-index="${index}"
              type="number"
              min="0"
              value="${Number(role.wage) || 0}"
            >
          </div>

          <div class="form-group">
            <label>Cost</label>
            <input
              class="work-cost"
              data-index="${index}"
              value="${money(
                (Number(role.count) || 0) *
                (Number(role.wage) || 0)
              )}"
              disabled
            >
          </div>
        </div>
      </div>
    `
  ).join("");

  updateWorkCosts();
  openModal("workModal");
}

function updateWorkCosts() {
  const editor = $("workEditor");

  [
    ...editor.querySelectorAll(".work-count")
  ].forEach((countInput, index) => {
    const wageInput = editor.querySelector(
      `.work-wage[data-index="${index}"]`
    );

    const costInput = editor.querySelector(
      `.work-cost[data-index="${index}"]`
    );

    if (wageInput && costInput) {
      costInput.value = money(
        (Number(countInput.value) || 0) *
        (Number(wageInput.value) || 0)
      );
    }
  });
}

async function saveTodayWorkDetail() {
  if (activeProject()?.access === "shared") {
    showToast("Shared project is read-only.");
    return;
  }
  const c = state.contractors.find(
    (x) => String(contractorId(x)) === String(workContractorId)
  );

  if (!c) return;

  const date = $("workDate").value || todayISO();
  const base = rolesForDate(c, date);

  const counts = [
    ...$("workEditor").querySelectorAll(".work-count")
  ];

  const wages = [
    ...$("workEditor").querySelectorAll(".work-wage")
  ];

  const roles = base.map((role, index) => ({
    name: role.name,
    count: Number(counts[index]?.value) || 0,
    wage: Number(wages[index]?.value) || 0
  }));

  try {
    const saved = await apiFetch("/work", {
      method: "POST",
      body: JSON.stringify({
        projectId: state.activeProjectId,
        contractorId: contractorId(c),
        date,
        roles
      })
    });

    state.workDetails[date] ||= {};
    state.workDetails[date][contractorId(c)] = {
      ...saved,
      contractorId: contractorId(c),
      roles
    };

    closeModal("workModal");
    renderContractors();
    renderHistory();

    showToast("Today's work detail saved");
  } catch (err) {
    console.error("SAVE WORK:", err);
    showToast(err.message || "Failed to save work.");
  }
}

async function saveAllTodayWork() {
  if (activeProject()?.access === "shared") {
    showToast("Shared project is read-only.");
    return;
  }
  const date = $("workDate").value || todayISO();

  try {
    for (const c of activeContractors()) {
      const existing = state.workDetails?.[date]?.[contractorId(c)];

      await apiFetch("/work", {
        method: "POST",
        body: JSON.stringify({
          projectId: state.activeProjectId,
          contractorId: contractorId(c),
          date,
          roles: rolesForDate(c, date)
        })
      });
    }

    await loadWorkDetails();
    renderContractors();
    renderHistory();
    showToast("Today's work saved");
  } catch (err) {
    console.error("SAVE ALL WORK:", err);
    showToast(err.message || "Failed to save today's work.");
  }
}

/* =========================================================
   PAYMENTS
========================================================= */

function openPaymentModal(id) {
  const c = state.contractors.find(
    (x) => String(contractorId(x)) === String(id)
  );

  if (!c) return;

  paymentContractorId = id;

  $("paymentModalSub").textContent =
    `${c.name} · ${c.category || "Contractor"}`;

  $("paymentDate").value = todayISO();
  $("paymentAmount").value = "";
  $("paymentBy").value = "";
  $("paymentDetails").value = "";

  openModal("paymentModal");
}

async function savePayment() {
  if (activeProject()?.access === "shared") {
    showToast("Shared project is read-only.");
    return;
  }
  const c = state.contractors.find(
    (x) => String(contractorId(x)) === String(paymentContractorId)
  );

  if (!c) return;

  const amount = Number($("paymentAmount").value) || 0;
  const by = $("paymentBy").value.trim();
  const details = $("paymentDetails").value.trim();

  if (amount <= 0) {
    showToast("Enter a valid payment amount");
    return;
  }

  if (!by) {
    showToast("Enter Build's member / client");
    return;
  }

  if (!details) {
    showToast("Enter payment details");
    return;
  }

  try {
    await apiFetch("/payments", {
      method: "POST",
      body: JSON.stringify({
        projectId: state.activeProjectId,
        contractorId: contractorId(c),
        date: $("paymentDate").value,
        amount,
        method: $("paymentMethod").value,
        by,
        details
      })
    });

    closeModal("paymentModal");
    await loadPayments();
    renderHistory();

    showToast("Payment recorded");
  } catch (err) {
    console.error("SAVE PAYMENT:", err);
    showToast(err.message || "Failed to record payment.");
  }
}

/* =========================================================
   HISTORY
========================================================= */

function refreshHistoryFilters() {
  const projectSelect = $("historyProjectFilter");
  const contractorSelect = $("historyContractorFilter");

  if (!projectSelect || !contractorSelect) return;

  projectSelect.innerHTML =
    state.projects.map((p) =>
      `<option value="${esc(projectId(p))}">
        ${esc(p.name)}${p.access === "shared" ? " — Shared" : ""}
      </option>`
    ).join("");

  projectSelect.value = state.activeProjectId || "";

  const p = activeProject();

  // Shared users get contractor information from /shared-history.
  // Do not call the owner-only /contractors API for them.
  if (p?.access === "shared") {
    contractorSelect.innerHTML =
      `<option value="all">All contractors</option>`;
  } else {
    contractorSelect.innerHTML =
      `<option value="all">All contractors</option>` +
      activeContractors().map((c) =>
        `<option value="${esc(contractorId(c))}">
          ${esc(c.name)}
        </option>`
      ).join("");
  }

  renderHistoryShareList();
}

async function selectHistoryProject(id) {
  if (!state.projects.some(
    (p) => String(projectId(p)) === String(id)
  )) return;

  await selectProject(id);
}

function buildHistoryEvents() {
  const p = activeProject();

  if (p?.access === "shared") {
    return (state.sharedHistory || []).map((item) => {
      const contractor = item.contractor || {};
      const name =
        contractor.name ||
        item.contractorName ||
        "Contractor";

      if (item.type === "payment") {
        return {
          date: item.date,
          type: "payment",
          contractorId:
            contractor._id ||
            contractor.id ||
            item.contractorId ||
            "",
          name,
          details:
            `<b>Amount:</b> ${money(item.amount)} · ` +
            `<b>Method:</b> ${esc(item.method || "")}<br>` +
            `<b>Build's member / client:</b> ${esc(item.by || "")}<br>` +
            `<b>Payment details:</b> ${esc(item.details || "")}`
        };
      }

      const roles = Array.isArray(item.roles)
        ? item.roles
        : [];

      return {
        date: item.date,
        type: "work",
        contractorId:
          contractor._id ||
          contractor.id ||
          item.contractorId ||
          "",
        name,
        details:
          (roles.length
            ? roles.map(
                (role) =>
                  `${esc(role.name)}: <b>${Number(role.count) || 0}</b> × ${money(role.wage)}`
              ).join(" · ")
            : "No role details") +
          `<br><b>Total workers:</b> ${Number(item.totalWorkers) || 0}` +
          `<br><b>Total work cost:</b> ${money(item.totalCost)}`
      };
    }).sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
    );
  }

  const events = [];

  Object.values(state.workDetails || {}).forEach((byContractor) => {
    Object.values(byContractor || {}).forEach((item) => {
      const c = state.contractors.find(
        (x) =>
          String(contractorId(x)) ===
          String(
            item.contractor?._id ||
            item.contractor ||
            item.contractorId
          )
      );

      if (!c) return;

      const total = (item.roles || []).reduce(
        (sum, role) =>
          sum +
          (Number(role.count) || 0) *
          (Number(role.wage) || 0),
        0
      );

      events.push({
        date: item.date,
        type: "work",
        contractorId: contractorId(c),
        name: c.name,
        details:
          (item.roles || [])
            .map(
              (role) =>
                `${esc(role.name)}: <b>${Number(role.count) || 0}</b> × ${money(role.wage)}`
            )
            .join(" · ") +
          `<br><b>Total work cost:</b> ${money(total)}`
      });
    });
  });

  (state.payments || []).forEach((payment) => {
    const c = payment.contractor || state.contractors.find(
      (x) =>
        String(contractorId(x)) ===
        String(
          payment.contractor?._id ||
          payment.contractor ||
          payment.contractorId
        )
    );

    events.push({
      date: payment.date,
      type: "payment",
      contractorId:
        payment.contractor?._id ||
        payment.contractor ||
        payment.contractorId ||
        "",
      name:
        c?.name ||
        payment.contractorName ||
        "Contractor",
      details:
        `<b>Amount:</b> ${money(payment.amount)} · ` +
        `<b>Method:</b> ${esc(payment.method || "")}<br>` +
        `<b>Build's member / client:</b> ${esc(payment.by || "")}<br>` +
        `<b>Payment details:</b> ${esc(payment.details || "")}`
    });
  });

  return events.sort((a, b) =>
    String(b.date).localeCompare(String(a.date))
  );
}

function renderHistory() {
  const list = $("historyList");
  const type = $("historyFilter").value;
  const contractor =
    $("historyContractorFilter").value;

  const events = buildHistoryEvents().filter((event) => {
    if (type !== "all" && event.type !== type) {
      return false;
    }

    return (
      contractor === "all" ||
      String(event.contractorId) === String(contractor)
    );
  });

  if (!events.length) {
    list.innerHTML = `
      <div class="empty">
        <i
          class="fa-solid fa-clock-rotate-left"
          style="font-size:26px;margin-bottom:8px"
        ></i>
        <div>No history found.</div>
      </div>
    `;
    return;
  }

  list.innerHTML = `
    <div class="history-list">
      ${events.map((event) => `
        <div class="history-item">
          <div class="history-item-head">
            <strong>${esc(event.name)}</strong>
            <span>${esc(event.date)}</span>
          </div>

          <span class="history-type">
            ${event.type === "payment"
              ? "PAYMENT"
              : "TODAY'S WORK"}
          </span>

          <div class="history-details">
            ${event.details}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

async function openHistory() {
  try {
    const p = activeProject();

    if (!p) {
      showToast("Select a project first.");
      return;
    }

    if (p.access === "shared") {
      const data = await loadSharedHistory();

      state.sharedHistory = Array.isArray(data?.history)
        ? data.history
        : [];

      // Keep the server's project information for the shared card.
      if (data?.project?._id) {
        state.projects = state.projects.map((item) =>
          String(projectId(item)) === String(data.project._id)
            ? normalizeProject({
                ...item,
                ...data.project,
                access: "shared"
              })
            : item
        );
      }
    } else {
      // Make sure owner's history is current too.
      await Promise.all([
        loadWorkDetails(),
        loadPayments()
      ]);
    }

    refreshHistoryFilters();
    renderHistory();
    openModal("historyModal");
  } catch (err) {
    console.error("OPEN HISTORY:", err);
    showToast(err.message || "Failed to load history.");
  }
}

function openContractorHistory(id) {
  openHistory();
  $("historyContractorFilter").value = id;
  renderHistory();
}

/* =========================================================
   PROJECT HISTORY SHARING
========================================================= */

function renderHistoryShareList() {
  const box = $("historyShareList");
  const p = activeProject();

  if (!box || !p) return;

  const shared = p.sharedWith || [];

  if (!shared.length) {
    box.innerHTML =
      `<div style="font-size:10px;color:#89939c">
        No shared numbers yet.
      </div>`;
    return;
  }

  box.innerHTML = shared.map((phone) => `
    <div class="share-item">
      <span class="share-phone">
        <i
          class="fa-solid fa-phone"
          style="margin-right:7px"
        ></i>
        ${esc(phone)}
      </span>

      <button
        class="icon-btn"
        data-action="remove-share"
        data-phone="${esc(phone)}"
        title="Remove"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join("");
}

function buildProjectHistoryText() {
  const p = activeProject();

  if (!p) return "";

  const workDate = $("workDate").value || todayISO();

  const work = activeContractors().map((c) => {
    const roles = rolesForDate(c, workDate);

    return [
      c.name,
      ...roles.map((r) =>
        `  ${r.name}: ${Number(r.count) || 0} × ₹${Number(r.wage || 0).toLocaleString("en-IN")}`
      ),
      `  Total: ₹${totalCost(c, workDate).toLocaleString("en-IN")}`
    ].join("\n");
  });

  const payments = state.payments.map((p) =>
    `${p.date} | ${p.contractor?.name || p.contractorName || "Contractor"} | ` +
    `₹${Number(p.amount || 0).toLocaleString("en-IN")} | ${p.method} | ` +
    `By: ${p.by} | ${p.details}`
  );

  return [
    "PROJECT HISTORY",
    `Project: ${p.name}`,
    p.location ? `Location: ${p.location}` : "",
    p.lat != null && p.lng != null
      ? `GPS: ${p.lat}, ${p.lng} | Radius: ${p.radius || 150}m`
      : "",
    "",
    `TODAY'S WORK (${workDate}):`,
    work.length ? work.join("\n") : "No work details.",
    "",
    "PAYMENTS:",
    payments.length ? payments.join("\n") : "No payment records."
  ].filter(Boolean).join("\n");
}

async function shareProjectHistory() {
  const p = activeProject();

  if (!p) {
    showToast("Select a project first");
    return;
  }

  const input = $("historySharePhone");
  const phone = input.value.replace(/\D/g, "");

  if (!/^\d{10}$/.test(phone)) {
    showToast("Enter a valid 10-digit phone number");
    return;
  }

  try {
    const data = await apiFetch(
      `/projects/${encodeURIComponent(projectId(p))}/share`,
      {
        method: "POST",
        body: JSON.stringify({ phone })
      }
    );

    const updatedProject =
      data.project ||
      data;

    const index = state.projects.findIndex(
      (x) => String(projectId(x)) ===
        String(projectId(p))
    );

    if (index !== -1) {
      state.projects[index] =
        normalizeProject(updatedProject);
    }

    renderProjectList();
    renderHistoryShareList();

    input.value = "";

    const message =
      buildProjectHistoryText();

    const separator =
      /iPhone|iPad|iPod/i.test(navigator.userAgent)
        ? "&"
        : "?";

    window.location.href =
      "sms:" +
      phone +
      separator +
      "body=" +
      encodeURIComponent(message);

    showToast("Project history shared");
  } catch (err) {
    console.error("SHARE PROJECT:", err);
    showToast(err.message || "Could not share project.");
  }
}

async function removeShare(phone) {
  const p = activeProject();

  if (!p) return;

  try {
    const data = await apiFetch(
      `/projects/${encodeURIComponent(projectId(p))}/share`,
      {
        method: "DELETE",
        body: JSON.stringify({ phone })
      }
    );

    const updatedProject =
      data.project ||
      data;

    const index = state.projects.findIndex(
      (x) => String(projectId(x)) ===
        String(projectId(p))
    );

    if (index !== -1) {
      state.projects[index] =
        normalizeProject(updatedProject);
    }

    renderProjectList();
    renderHistoryShareList();

    showToast("Shared number removed");
  } catch (err) {
    console.error("REMOVE SHARE:", err);
    showToast(err.message || "Failed to remove shared number.");
  }
}

/* =========================================================
   EVENT WIRING — NO INLINE JS
========================================================= */

function bindEvents() {
  $("projectSelect").addEventListener(
    "change",
    (event) => selectProject(event.target.value)
  );

  $("projectsBtn").addEventListener(
    "click",
    () => openProjectModal()
  );

  $("historyBtn").addEventListener(
    "click",
    openHistory
  );

  $("createContractorBtn").addEventListener(
    "click",
    () => openContractorModal()
  );

  $("saveProjectBtn").addEventListener(
    "click",
    saveProject
  );

  $("useProjectLocationBtn").addEventListener(
    "click",
    useCurrentProjectLocation
  );

  $("addRoleBtn").addEventListener(
    "click",
    () => addRoleEditor()
  );

  $("saveContractorBtn").addEventListener(
    "click",
    saveContractor
  );

  $("saveWorkBtn").addEventListener(
    "click",
    saveAllTodayWork
  );

  $("saveWorkDetailBtn").addEventListener(
    "click",
    saveTodayWorkDetail
  );

  $("savePaymentBtn").addEventListener(
    "click",
    savePayment
  );

  $("shareHistoryBtn").addEventListener(
    "click",
    shareProjectHistory
  );

  $("workDate").addEventListener(
    "change",
    () => {
      renderContractors();
    }
  );

  $("historyFilter").addEventListener(
    "change",
    renderHistory
  );

  $("historyProjectFilter").addEventListener(
    "change",
    (event) => selectHistoryProject(event.target.value)
  );

  $("historyContractorFilter").addEventListener(
    "change",
    renderHistory
  );

  $("workEditor").addEventListener(
    "input",
    (event) => {
      if (
        event.target.matches(
          ".work-count,.work-wage"
        )
      ) {
        updateWorkCosts();
      }
    }
  );

  document.addEventListener(
    "click",
    async (event) => {
      const actionEl =
        event.target.closest("[data-action]");

      if (!actionEl) return;

      const action =
        actionEl.dataset.action;

      const id =
        actionEl.dataset.id;

      if (action === "close-modal") {
        closeModal(
          actionEl.dataset.target
        );
        return;
      }

      if (action === "select-project") {
        await selectProject(id);
        closeModal("projectModal");
        renderProjectList();
        return;
      }

      if (action === "edit-project") {
        openProjectModal(id);
        return;
      }

      if (action === "delete-project") {
        await deleteProject(id);
        return;
      }

      if (action === "edit-contractor") {
        openContractorModal(id);
        return;
      }

      if (action === "delete-contractor") {
        await deleteContractor(id);
        return;
      }

      if (action === "work-detail") {
        openWorkModal(id);
        return;
      }

      if (action === "payment") {
        openPaymentModal(id);
        return;
      }

      if (action === "remove-role") {
        $(actionEl.dataset.roleEditor)?.remove();
        return;
      }

      if (action === "remove-share") {
        await removeShare(
          actionEl.dataset.phone
        );
      }
    }
  );

  document.querySelectorAll(
    '[data-action="close-modal"]'
  ).forEach(() => {});
}

init().then(() => {
  bindEvents();
  renderProjectSelect();
  renderProjectList();
  renderContractors();
  refreshHistoryFilters();
  renderHistory();
});


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


