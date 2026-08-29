/* ============================================================
   Workshop Ledger — API-backed frontend
   Business data is no longer stored in localStorage.

   Authentication:
   - BuildSkil owner/admin: existing cb_token
   - Workshop worker: wl_worker_token (separate worker JWT)
   ============================================================ */

const API_BASE = "https://api.buildskil.com/api";

const BUILD_TOKEN_KEY = 'cb_token';
const WORKER_TOKEN_KEY = 'wl_worker_token';
const LEDGER_SESSION_KEY = 'workshop_ledger_session';
let DATA = {
  workshop: null,
  workers: [],
  projects: [],
  attendance: [],
  payments: [],
  sessions: []
};

let workerSalary = null;
let session = {
  role: null,
  workerId: null,
  worker: null
};

function ownerHeaders(extra = {}) {
  const headers = { ...extra };
  const token = localStorage.getItem(BUILD_TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function workerHeaders(extra = {}) {
  const headers = { ...extra };
  const token = localStorage.getItem(WORKER_TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function apiFetch(path, options = {}, auth = 'owner') {
  const headers = auth === 'worker'
    ? workerHeaders(options.headers || {})
    : auth === 'none'
      ? { ...(options.headers || {}) }
      : ownerHeaders(options.headers || {});

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  let body = null;
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try { body = await res.json(); } catch (_) {}
  } else {
    try { body = await res.text(); } catch (_) {}
  }

  if (!res.ok) {
    if (res.status === 401) {
      if (auth === 'worker') {
        localStorage.removeItem(WORKER_TOKEN_KEY);
        session = { role: null, workerId: null, worker: null };
      }
    }

    const message = body?.message || body?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = body;
    throw err;
  }

  return res.status === 204 ? null : body;
}

function idOf(value) {
  if (!value) return null;
  return String(value._id || value.id || value);
}

function normalizeWorker(w) {
  if (!w) return null;
  return {
    ...w,
    id: idOf(w),
    password: undefined
  };
}

function normalizeProject(p) {
  if (!p) return null;
  return {
    ...p,
    id: idOf(p)
  };
}

function normalizeAttendance(a) {
  if (!a) return null;
  return {
    ...a,
    id: idOf(a),
    workerId: idOf(a.worker),
    projectId: idOf(a.project),
    workerName: a.worker?.name || '',
    workerPhone: a.worker?.phone || '',
    projectName: a.project?.name || '',
    session: a.session || '',
    project: a.project ? normalizeProject(a.project) : null
  };
}

function normalizePayment(p) {
  if (!p) return null;
  return {
    ...p,
    id: idOf(p),
    workerId: idOf(p.worker),
    workerName: p.worker?.name || '',
    workerPhone: p.worker?.phone || ''
  };
}

function normalizeSession(s) {
  if (!s) return null;
  return {
    ...s,
    id: idOf(s),
    workerId: idOf(s.worker),
    workerName: s.worker?.name || '',
    workerPhone: s.worker?.phone || ''
  };
}

function todayStr() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata'
  }).format(new Date());
}

function nowTime() {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());
}

function fmtMoney(n) {
  return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
}

function fmtDateNice(iso) {
  if (!iso) return '—';
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

function monthKey(iso) {
  return String(iso || '').slice(0, 7);
}

function isThisMonth(iso) {
  return monthKey(iso) === monthKey(todayStr());
}

function initials(name = '') {
  return String(name).trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';
}

function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2400);
}

function workerById(id) {
  return DATA.workers.find(w => String(w.id) === String(id));
}

function projectById(id) {
  return DATA.projects.find(p => String(p.id) === String(id));
}

function earnedThisMonth(worker) {
  if (!worker) return 0;
  if (worker.wageType === 'monthly') return Number(worker.rate) || 0;
  const punches = DATA.attendance.filter(a =>
    String(a.workerId) === String(worker.id) && isThisMonth(a.date)
  ).length;

  return (punches / 2) * (Number(worker.rate) || 0);
}

function paidThisMonth(worker) {
  if (!worker) return 0;
  return DATA.payments
    .filter(p => String(p.workerId) === String(worker.id) && isThisMonth(p.date))
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}

function balanceDue(worker) {
  return Math.max(0, earnedThisMonth(worker) - paidThisMonth(worker));
}
document
  .getElementById("tab-admin-login")
  ?.addEventListener("click", () => {
    setLoginRole("admin");
  });

document
  .getElementById("tab-worker-login")
  ?.addEventListener("click", () => {
    setLoginRole("worker");
  });
  document
  .getElementById("adminLoginBtn")
  ?.addEventListener("click", loginAdmin);
  document
  .getElementById("worker-login-form")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    loginWorker();
  });
/* ============================================================
   AUTH / LOGIN
   ============================================================ */
function setLoginRole(role) {
  document.getElementById('tab-admin-login').classList.toggle('active', role === 'admin');
  document.getElementById('tab-worker-login').classList.toggle('active', role === 'worker');
  document.getElementById('form-admin-login').classList.toggle('hidden', role !== 'admin');
  document.getElementById('form-worker-login').classList.toggle('hidden', role !== 'worker');
}
async function loginAdmin() {
  const err = document.getElementById('admin-err');
  const token = localStorage.getItem(BUILD_TOKEN_KEY);

  if (!token) {
    err.textContent = 'Please sign in to BuildSkil first.';
    err.style.display = 'block';
    return;
  }

  try {
    err.style.display = 'none';

    await refreshAdminData();

    session = {
      role: 'admin',
      workerId: null,
      worker: null
    };

    sessionStorage.setItem(
      LEDGER_SESSION_KEY,
      'admin'
    );

    enterAdmin();

  } catch (e) {
    err.textContent =
      e.message || 'BuildSkil authentication failed.';

    err.style.display = 'block';
  }
}
/*
async function loginAdmin() {
  const err = document.getElementById('admin-err');
  const token = localStorage.getItem(BUILD_TOKEN_KEY);

  if (!token) {
    err.textContent = 'Please sign in to BuildSkil first, then return here and tap Login with BuildSkil.';
    err.style.display = 'block';
    return;
  }

  try {
    err.style.display = 'none';
    await refreshAdminData();
    session = { role: 'admin', workerId: null, worker: null };
    enterAdmin();
  } catch (e) {
    err.textContent = e.message || 'BuildSkil authentication failed.';
    err.style.display = 'block';
  }
}*/

async function loginWorker() {
  const phone =
    document.getElementById('worker-phone')
      .value
      .replace(/\D/g, '');

  const name =
    document.getElementById('worker-name')
      .value
      .trim();

  const password =
    document.getElementById('worker-pass')
      .value;

  const err =
    document.getElementById('worker-err');

  if (
    !/^\d{10}$/.test(phone) ||
    !name ||
    !password
  ) {
    err.textContent =
      'Enter the worker phone, name and password.';

    err.style.display = 'block';
    return;
  }

  try {
    err.style.display = 'none';

    const data = await apiFetch(
      '/workshop/workers/login',
      {
        method: 'POST',
        body: JSON.stringify({
          phone,
          name,
          password
        })
      },
      'owner'
    );

    if (!data?.token) {
      throw new Error(
        'Worker login token was not returned.'
      );
    }

    localStorage.setItem(
      WORKER_TOKEN_KEY,
      data.token
    );

    session = {
      role: 'worker',
      workerId: idOf(data.worker),
      worker: normalizeWorker(data.worker)
    };

    sessionStorage.setItem(
      LEDGER_SESSION_KEY,
      'worker'
    );

    await refreshWorkerData();

    enterWorker();

  } catch (e) {
    err.textContent =
      e.message ||
      'We could not sign you in.';

    err.style.display = 'block';
  }
}
/*
async function logout() {
  if (session.role === 'worker' && localStorage.getItem(WORKER_TOKEN_KEY)) {
    try {
      await apiFetch('/workshop/workers/logout', { method: 'POST' }, 'worker');
    } catch (_) {}
    localStorage.removeItem(WORKER_TOKEN_KEY);
  }

  session = { role: null, workerId: null, worker: null };
  workerSalary = null;
  DATA = { workshop: null, workers: [], projects: [], attendance: [], payments: [], sessions: [] };

  document.getElementById('app-admin').classList.remove('active');
  document.getElementById('app-worker').classList.remove('active');
  document.getElementById('screen-login').style.display = 'flex';
// const adminUser = document.getElementById('admin-user');
//const adminPass = document.getElementById('admin-pass');
const workerPhone = document.getElementById('worker-phone');
const workerName = document.getElementById('worker-name');
const workerPass = document.getElementById('worker-pass');

//if (adminUser) adminUser.value = '';
//if (adminPass) adminPass.value = '';
if (workerPhone) workerPhone.value = '';
if (workerName) workerName.value = '';
if (workerPass) workerPass.value = '';
}
*/
document
    .getElementById("logoutBtn")
    ?.addEventListener("click", () => {
        logout();
    });
async function logout() {

  if (
    session.role === 'worker' &&
    localStorage.getItem(WORKER_TOKEN_KEY)
  ) {

    try {
      await apiFetch(
        '/workshop/workers/logout',
        { method: 'POST' },
        'worker'
      );
    } catch (_) {}

    localStorage.removeItem(
      WORKER_TOKEN_KEY
    );
  }

  // Important:
  // Do NOT remove cb_token.
  // It belongs to the main BuildSkil login.

  sessionStorage.removeItem(
    LEDGER_SESSION_KEY
  );

  session = {
    role: null,
    workerId: null,
    worker: null
  };

  workerSalary = null;

  DATA = {
    workshop: null,
    workers: [],
    projects: [],
    attendance: [],
    payments: [],
    sessions: []
  };

  document
    .getElementById('app-admin')
    .classList.remove('active');

  document
    .getElementById('app-worker')
    .classList.remove('active');

  document
    .getElementById('screen-login')
    .style.display = 'flex';

  const phone =
    document.getElementById('worker-phone');

  const name =
    document.getElementById('worker-name');

  const pass =
    document.getElementById('worker-pass');

  if (phone) phone.value = '';
  if (name) name.value = '';
  if (pass) pass.value = '';

  setLoginRole('admin');
}
/* ============================================================
   ADMIN DATA
   ============================================================ */
async function refreshAdminData() {
  const [workshop, workers, projects, attendance, payments, sessions] = await Promise.all([
    apiFetch('/workshop'),
    apiFetch('/workshop/workers'),
    apiFetch('/workshop/projects'),
    apiFetch('/workshop/attendance'),
    apiFetch('/workshop/payments'),
    apiFetch('/workshop/sessions')
  ]);

  DATA.workshop = workshop;
  DATA.workers = Array.isArray(workers) ? workers.map(normalizeWorker).filter(Boolean) : [];
  DATA.projects = Array.isArray(projects) ? projects.map(normalizeProject).filter(Boolean) : [];
  DATA.attendance = Array.isArray(attendance) ? attendance.map(normalizeAttendance).filter(Boolean) : [];
  DATA.payments = Array.isArray(payments) ? payments.map(normalizePayment).filter(Boolean) : [];
  DATA.sessions = Array.isArray(sessions) ? sessions.map(normalizeSession).filter(Boolean) : [];
}

function enterAdmin() {
  document.getElementById('screen-login').style.display = 'none';
  document.getElementById('app-worker').classList.remove('active');
  document.getElementById('app-admin').classList.add('active');

  document.getElementById('today-label').textContent = fmtDateNice(todayStr());
  document.getElementById('admin-who-name').textContent = DATA.workshop?.name || 'Workshop';

  populateWorkerFilter();
  populateProjectFilter();
  showAdminView('overview');
}
document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
        const view = button.dataset.view;
        showAdminView(view);
    });
});

document
    .getElementById("adminLogoutBtn")
    ?.addEventListener("click", () => {
        logout();
    });
async function showAdminView(view) {
  ['overview', 'projects', 'attendance', 'payments', 'workers', 'account'].forEach(v => {
    document.getElementById(`view-${v}`).classList.toggle('hidden', v !== view);
  });
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));

  try {
    await refreshAdminData();

    if (view === 'overview') renderOverview();
    if (view === 'projects') renderProjectsView();
    if (view === 'attendance') { populateProjectFilter(); renderAttendanceView(); }
    if (view === 'payments') renderPaymentsView();
    if (view === 'workers') renderWorkersView();
    if (view === 'account') renderAdminAccountView();
  } catch (e) {
    showToast(e.message || 'Could not load workshop data.');
  }
}

function renderOverview() {
  const total = DATA.workers.length;
  const presentIds = new Set(
    DATA.attendance.filter(a => a.date === todayStr()).map(a => a.workerId)
  );

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-present').textContent = presentIds.size;
  document.getElementById('stat-present-sub').textContent = `of ${total} checked in today`;

  const totalDue = DATA.workers.reduce((sum, w) => sum + balanceDue(w), 0);
  const totalPaid = DATA.workers.reduce((sum, w) => sum + paidThisMonth(w), 0);

  document.getElementById('stat-due').textContent = fmtMoney(totalDue);
  document.getElementById('stat-paid').textContent = fmtMoney(totalPaid);

  const todays = DATA.attendance
    .filter(a => a.date === todayStr())
    .sort((a, b) => String(a.time).localeCompare(String(b.time)));

  const attHtml = todays.length
    ? `<table><thead><tr><th>Worker</th><th>Project</th><th>Session</th><th>Check-in</th><th>Location</th></tr></thead><tbody>` +
      todays.map(a => `<tr>
        <td class="name-cell"><span class="avatar">${initials(a.workerName)}</span>${a.workerName || '—'}</td>
        <td class="muted">${a.projectName || '—'}</td>
        <td><span class="badge badge-pending">${a.session === 'afternoon' ? 'Afternoon' : 'Morning'}</span></td>
        <td class="mono">${a.time || '—'}</td>
        <td>${geoLink(a)}</td>
      </tr>`).join('') +
      `</tbody></table>`
    : emptyState('◷', 'No check-ins yet today');

  document.getElementById('overview-attendance-table').innerHTML = attHtml;

  const recent = [...DATA.payments]
    .sort((a, b) => (String(b.date) + String(b.id)).localeCompare(String(a.date) + String(a.id)))
    .slice(0, 6);

  const payHtml = recent.length
    ? `<table><thead><tr><th>Worker</th><th>Type</th><th>Amount</th><th>Date</th></tr></thead><tbody>` +
      recent.map(p => `<tr>
        <td class="name-cell"><span class="avatar">${initials(p.workerName)}</span>${p.workerName || '—'}</td>
        <td>${typeBadge(p.type)}</td>
        <td class="mono">${fmtMoney(p.amount)}</td>
        <td class="muted">${fmtDateNice(p.date)}</td>
      </tr>`).join('') +
      `</tbody></table>`
    : emptyState('₹', 'No payments recorded yet');

  document.getElementById('overview-payments-table').innerHTML = payHtml;
}

function geoLink(a) {
  if (Number.isFinite(Number(a.lat)) && Number.isFinite(Number(a.lng))) {
    return `<a class="geo-link" target="_blank" rel="noopener" href="https://maps.google.com/?q=${a.lat},${a.lng}">${Number(a.lat).toFixed(4)}, ${Number(a.lng).toFixed(4)} ↗</a>`;
  }
  return `<span class="muted mono">not shared</span>`;
}

function typeBadge(type) {
  const map = {
    wage: ['badge-pending', 'Wage'],
    monthly: ['badge-paid', 'Monthly'],
    advance: ['badge-absent', 'Advance']
  };
  const [cls, label] = map[type] || ['badge-pending', type];
  return `<span class="badge ${cls}">${label}</span>`;
}

function emptyState(ic, text) {
  return `<div class="empty-state"><div class="ic">${ic}</div>${text}</div>`;
}

function populateWorkerFilter() {
  const sel = document.getElementById('att-worker-filter');
  if (!sel) return;
  sel.innerHTML = '<option value="">All workers</option>' +
    DATA.workers.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
}

function populateProjectFilter() {
  const sel = document.getElementById('att-project-filter');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">All projects</option>' +
    DATA.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  sel.value = current;
}

function clearAttFilters() {
  document.getElementById('att-date-filter').value = '';
  document.getElementById('att-worker-filter').value = '';
  document.getElementById('att-project-filter').value = '';
  renderAttendanceView();
}
const attDateFilter = document.getElementById("att-date-filter");
const attWorkerFilter = document.getElementById("att-worker-filter");
const attProjectFilter = document.getElementById("att-project-filter");
const clearAttFiltersBtn = document.getElementById("clearAttFiltersBtn");

attDateFilter?.addEventListener("change", () => {
    renderAttendanceView();
});

attWorkerFilter?.addEventListener("change", () => {
    renderAttendanceView();
});

attProjectFilter?.addEventListener("change", () => {
    renderAttendanceView();
});

clearAttFiltersBtn?.addEventListener("click", () => {
    clearAttFilters();
});
function renderAttendanceView() {
  const dateF = document.getElementById('att-date-filter').value;
  const workerF = document.getElementById('att-worker-filter').value;
  const projectF = document.getElementById('att-project-filter').value;

  let rows = [...DATA.attendance];
  if (dateF) rows = rows.filter(a => a.date === dateF);
  if (workerF) rows = rows.filter(a => String(a.workerId) === String(workerF));
  if (projectF) rows = rows.filter(a => String(a.projectId) === String(projectF));

 // rows.sort((a, b) => (String(b.date) + String(b.time)).localeCompare(String(a.date) + String(a.time)));
rows.sort((a, b) => a.date !== b.date
  ? String(b.date).localeCompare(String(a.date))   // newest date on top
  : String(a.time).localeCompare(String(b.time))); // morning above afternoon
  if (!rows.length) {
    document.getElementById('attendance-table').innerHTML = emptyState('◷', 'No attendance records match');
    return;
  }

  document.getElementById('attendance-table').innerHTML =
    `<table><thead><tr><th>Worker</th><th>Project</th><th>Date</th><th>Session</th><th>Check-in time</th><th>Location</th><th>Distance</th><th>Status</th><th></th></tr></thead><tbody>` +
    rows.map(a => {
      const distTxt = a.distance !== undefined && a.distance !== null ? `${Math.round(Number(a.distance))} m` : '—';
      const mapBtn = a.lat !== undefined && a.lng !== undefined
        ? `<button
    class="btn btn-ghost btn-sm attendance-map-btn"
    data-attendance-id="${a.id}"
    type="button"
>
    🗺 Map
</button>`
        : `<span class="muted">—</span>`;
      return `<tr>
        <td class="name-cell"><span class="avatar">${initials(a.workerName)}</span>${a.workerName || '—'}</td>
        <td class="muted">${a.projectName || '—'}</td>
        <td>${fmtDateNice(a.date)}</td>
        <td><span class="badge badge-pending">${a.session === 'afternoon' ? 'Afternoon' : 'Morning'}</span></td>
        <td class="mono">${a.time || '—'}</td>
        <td>${geoLink(a)}</td>
        <td class="mono">${distTxt}</td>
        <td><span class="badge badge-present">Present</span></td>
        <td>${mapBtn}</td>
      </tr>`;
    }).join('') +
    `</tbody></table>`;
}

function renderPaymentsView() {
  document.getElementById('payments-balance-table').innerHTML =
    `<table><thead><tr><th>Worker</th><th>Wage type</th><th>Earned (month)</th><th>Paid (month)</th><th>Balance due</th><th></th></tr></thead><tbody>` +
    DATA.workers.map(w => {
      const earned = earnedThisMonth(w);
      const paid = paidThisMonth(w);
      const due = balanceDue(w);
      return `<tr>
        <td class="name-cell"><span class="avatar">${initials(w.name)}</span>${w.name}</td>
        <td class="muted">${w.wageType === 'daily' ? `Daily · ${fmtMoney(w.rate)}/day` : `Monthly · ${fmtMoney(w.rate)}`}</td>
        <td class="mono">${fmtMoney(earned)}</td>
        <td class="mono">${fmtMoney(paid)}</td>
        <td class="mono" style="font-weight:700; color:${due > 0 ? 'var(--rust-dark)' : 'var(--sage)'}">${fmtMoney(due)}</td>
        <td><button
    class="btn btn-sage btn-sm"
    type="button"
    data-worker-id="${w.id}">
    Send payment
</button></td>
      </tr>`;
    }).join('') +
    `</tbody></table>`;

  const hist = [...DATA.payments].sort((a, b) => (String(b.date) + String(b.id)).localeCompare(String(a.date) + String(a.id)));
  document.getElementById('payments-history-table').innerHTML = hist.length
    ? `<table><thead><tr><th>Worker</th><th>Type</th><th>Amount</th><th>Note</th><th>Date</th></tr></thead><tbody>` +
      hist.map(p => `<tr>
        <td class="name-cell"><span class="avatar">${initials(p.workerName)}</span>${p.workerName || '—'}</td>
        <td>${typeBadge(p.type)}</td>
        <td class="mono">${fmtMoney(p.amount)}</td>
        <td class="muted">${p.note || '—'}</td>
        <td class="muted">${fmtDateNice(p.date)}</td>
      </tr>`).join('') +
      `</tbody></table>`
    : emptyState('₹', 'No payments sent yet');
}

function renderWorkersView() {
  document.getElementById('workers-table').innerHTML = DATA.workers.length
    ? `<table><thead><tr><th>Worker</th><th>Phone</th><th>Wage type</th><th>Rate</th><th></th></tr></thead><tbody>` +
      DATA.workers.map(w => `<tr>
        <td class="name-cell"><span class="avatar">${initials(w.name)}</span>${w.name}</td>
        <td class="mono">${w.phone}</td>
        <td class="muted">${w.wageType === 'daily' ? 'Daily wage' : 'Monthly salary'}</td>
        <td class="mono">${fmtMoney(w.rate)}${w.wageType === 'daily' ? '/day' : '/mo'}</td>
        <td>
          <button
    class="btn btn-ghost btn-sm worker-edit-btn"
    data-worker-id="${w.id}"
    type="button"
>
    Edit
</button>

<button
    class="btn btn-ghost btn-sm worker-remove-btn"
    data-worker-id="${w.id}"
    type="button"
>
    Remove
</button>
        </td>
      </tr>`).join('') +
      `</tbody></table>`
    : emptyState('☰', 'No workers yet');
}

function renderAdminAccountView() {
  document.getElementById('admin-account-name').value = DATA.workshop?.name || '';
  document.getElementById('admin-account-username').value = 'BuildSkil account';

  const hist = [...DATA.sessions].sort((a, b) => (String(b.date) + String(b.loginTime)).localeCompare(String(a.date) + String(a.loginTime)));

  document.getElementById('admin-sessions-table').innerHTML = hist.length
    ? `<table><thead><tr><th>Worker</th><th>Phone</th><th>Date</th><th>Login time</th><th>Logout time</th></tr></thead><tbody>` +
      hist.map(s => `<tr>
        <td class="name-cell"><span class="avatar">${initials(s.workerName)}</span>${s.workerName || '—'}</td>
        <td class="mono">${s.workerPhone || '—'}</td>
        <td class="muted">${fmtDateNice(s.date)}</td>
        <td class="mono">${s.loginTime || '—'}</td>
        <td class="mono">${s.logoutTime || '<span class="badge badge-present">Still signed in</span>'}</td>
      </tr>`).join('') +
      `</tbody></table>`
    : emptyState('⚙', 'No worker sign-ins recorded yet');
}
document
    .getElementById("saveAdminAccountBtn")
    ?.addEventListener("click", () => {
        saveAdminAccount();
    });
async function saveAdminAccount() {
  const name = document.getElementById('admin-account-name').value.trim();
  if (!name) return showToast('Enter a workshop name to save.');

  try {
    const updated = await apiFetch('/workshop', {
      method: 'PUT',
      body: JSON.stringify({ name })
    });
    DATA.workshop = updated;
    document.getElementById('admin-who-name').textContent = updated.name || name;
    showToast('Workshop updated.');
  } catch (e) {
    showToast(e.message);
  }
}

/* ============================================================
   PROJECTS
   ============================================================ */
let pjmMap = null;
let pjmMarker = null;
let pjmCircle = null;
function renderProjectsView() {
  document.getElementById('projects-table').innerHTML = DATA.projects.length
    ? `<table><thead><tr><th>Project</th><th>Latitude</th><th>Longitude</th><th>Radius</th><th></th></tr></thead><tbody>` +
      DATA.projects.map(p => `<tr>
        <td class="name-cell">
          <span class="avatar">${initials(p.name)}</span>
          ${p.name}
        </td>
        <td class="mono">${p.lat}</td>
        <td class="mono">${p.lng}</td>
        <td class="mono">${p.radius} m</td>
        <td>
          <button
            type="button"
            class="btn btn-ghost btn-sm project-edit-btn"
            data-project-id="${p.id}">
            Edit
          </button>

          <button
            type="button"
            class="btn btn-ghost btn-sm project-remove-btn"
            data-project-id="${p.id}">
            Remove
          </button>
        </td>
      </tr>`).join('') +
      `</tbody></table>`
    : emptyState('⌂', 'No projects yet — add one so workers can check in');

  bindProjectActions();
}

function initProjectMap(lat, lng, radius) {
  const centerLat = Number.isFinite(Number(lat)) ? Number(lat) : 28.6139;
  const centerLng = Number.isFinite(Number(lng)) ? Number(lng) : 77.2090;
  const r = Number(radius) || 150;

  if (!pjmMap) {
    pjmMap = L.map('pjm-map', { attributionControl: false }).setView([centerLat, centerLng], lat ? 16 : 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(pjmMap);
    pjmMarker = L.marker([centerLat, centerLng], { draggable: true }).addTo(pjmMap);
    pjmCircle = L.circle([centerLat, centerLng], { radius: r, color: '#C1440E', fillColor: '#C1440E', fillOpacity: 0.12, weight: 1.5 }).addTo(pjmMap);

    pjmMarker.on('drag', e => {
      const pos = e.target.getLatLng();
      pjmCircle.setLatLng(pos);
      document.getElementById('pjm-lat').value = pos.lat.toFixed(6);
      document.getElementById('pjm-lng').value = pos.lng.toFixed(6);
    });

    pjmMap.on('click', e => {
      pjmMarker.setLatLng(e.latlng);
      pjmCircle.setLatLng(e.latlng);
      document.getElementById('pjm-lat').value = e.latlng.lat.toFixed(6);
      document.getElementById('pjm-lng').value = e.latlng.lng.toFixed(6);
    });
  } else {
    pjmMap.setView([centerLat, centerLng], lat ? 16 : 12);
    pjmMarker.setLatLng([centerLat, centerLng]);
    pjmCircle.setLatLng([centerLat, centerLng]);
    pjmCircle.setRadius(r);
  }

  setTimeout(() => pjmMap?.invalidateSize(), 150);
}

function syncProjectMapFromFields() {
  if (!pjmMap) return;
  const lat = Number(document.getElementById('pjm-lat').value);
  const lng = Number(document.getElementById('pjm-lng').value);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  pjmMarker.setLatLng([lat, lng]);
  pjmCircle.setLatLng([lat, lng]);
  pjmMap.setView([lat, lng]);
}

function syncProjectRadiusFromField() {
  if (!pjmCircle) return;
  pjmCircle.setRadius(Number(document.getElementById('pjm-radius').value) || 150);
}

document.getElementById('pjm-lat').addEventListener('input', syncProjectMapFromFields);
document.getElementById('pjm-lng').addEventListener('input', syncProjectMapFromFields);
document.getElementById('pjm-radius').addEventListener('input', syncProjectRadiusFromField);
document
    .getElementById("addProjectBtn")
    ?.addEventListener("click", () => {
        openProjectModal();
    });
function openProjectModal(id) {
  document.getElementById('project-modal-backdrop').classList.add('show');

  if (id) {
    const p = projectById(id);
    if (!p) return closeProjectModal();
    document.getElementById('project-modal-title').textContent = 'Edit project';
    document.getElementById('pjm-id').value = p.id;
    document.getElementById('pjm-name').value = p.name;
    document.getElementById('pjm-lat').value = p.lat;
    document.getElementById('pjm-lng').value = p.lng;
    document.getElementById('pjm-radius').value = p.radius;
    initProjectMap(p.lat, p.lng, p.radius);
  } else {
    document.getElementById('project-modal-title').textContent = 'Add project';
    document.getElementById('pjm-id').value = '';
    document.getElementById('pjm-name').value = '';
    document.getElementById('pjm-lat').value = '';
    document.getElementById('pjm-lng').value = '';
    document.getElementById('pjm-radius').value = '';
    initProjectMap(null, null, 150);
  }
}
document
    .getElementById("cancelProjectBtn")
    ?.addEventListener("click", () => {
        closeProjectModal();
    });
function closeProjectModal() {
  document.getElementById('project-modal-backdrop').classList.remove('show');
}
document
    .getElementById("useProjectLocationBtn")
    ?.addEventListener("click", () => {
        useCurrentLocationForProject();
    });
function useCurrentLocationForProject() {
  if (!navigator.geolocation) return showToast('Location is not available on this device.');
  showToast('Getting your location…');

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      document.getElementById('pjm-lat').value = lat.toFixed(6);
      document.getElementById('pjm-lng').value = lng.toFixed(6);
      if (pjmMap) {
        pjmMarker.setLatLng([lat, lng]);
        pjmCircle.setLatLng([lat, lng]);
        pjmMap.setView([lat, lng], 16);
        setTimeout(() => pjmMap.invalidateSize(), 100);
      }
      showToast('Location filled in on the map.');
    },
    () => showToast("Couldn't get your location.")
  );
}
document
    .getElementById("saveProjectBtn")
    ?.addEventListener("click", () => {
        saveProject();
    });
async function saveProject() {
  const id = document.getElementById('pjm-id').value;
  const name = document.getElementById('pjm-name').value.trim();
  const lat = Number(document.getElementById('pjm-lat').value);
  const lng = Number(document.getElementById('pjm-lng').value);
  const radius = Number(document.getElementById('pjm-radius').value);

  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(radius) || radius <= 0) {
    return showToast('Fill in valid project details.');
  }

  try {
    let saved;
    if (id) {
      saved = await apiFetch(`/workshop/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, lat, lng, radius })
      });
      showToast('Project updated.');
    } else {
      saved = await apiFetch('/workshop/projects', {
        method: 'POST',
        body: JSON.stringify({ name, lat, lng, radius })
      });
      showToast('Project added.');
    }

    closeProjectModal();
    await refreshAdminData();
    renderProjectsView();
    populateProjectFilter();
  } catch (e) {
    showToast(e.message);
  }
}
function bindProjectActions() {

  document
    .querySelectorAll('.project-edit-btn')
    .forEach(button => {

      button.addEventListener('click', () => {

        const projectId =
          button.dataset.projectId;

        openProjectModal(projectId);

      });

    });


  document
    .querySelectorAll('.project-remove-btn')
    .forEach(button => {

      button.addEventListener('click', () => {

        const projectId =
          button.dataset.projectId;

        removeProject(projectId);

      });

    });

}
async function removeProject(id) {
  if (!confirm('Remove this project? Existing attendance records will remain.')) return;
  try {
    await apiFetch(`/workshop/projects/${id}`, { method: 'DELETE' });
    await refreshAdminData();
    renderProjectsView();
    populateProjectFilter();
    showToast('Project removed.');
  } catch (e) {
    showToast(e.message);
  }
}

/* ============================================================
   ATTENDANCE MAP
   ============================================================ */
let attMap = null;
let attWorkerMarker = null;
let attProjectMarker = null;
let attProjectCircle = null;
document.addEventListener("click", (event) => {

    const button =
        event.target.closest(".attendance-map-btn");

    if (!button) return;

    const attendanceId =
        button.dataset.attendanceId;

    if (!attendanceId) return;

    openAttendanceMap(attendanceId);

});
function openAttendanceMap(attId) {
  const a = DATA.attendance.find(x => String(x.id) === String(attId));
  if (!a) return showToast('Record not found.');

  const p = a.project || projectById(a.projectId);
  const w = workerById(a.workerId) || { name: a.workerName };

  document.getElementById('attendance-map-backdrop').classList.add('show');
  document.getElementById('attendance-map-title').textContent = `${w?.name || 'Worker'} — ${fmtDateNice(a.date)}`;

  const infoLines = [];
  if (p) infoLines.push(`<b>${p.name}</b> · check-in radius ${p.radius}m`);
  if (a.lat !== undefined && a.lng !== undefined) {
    infoLines.push(`Checked in at <b>${a.time}</b> · ${Math.round(Number(a.distance) || 0)}m from the site center`);
  } else {
    infoLines.push('No location was recorded for this check-in.');
  }
  document.getElementById('attendance-map-info').innerHTML = infoLines.join('<br>');

  if (!attMap) {
    attMap = L.map('attendance-map', { attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(attMap);
  }

  [attProjectCircle, attProjectMarker, attWorkerMarker].forEach(layer => {
    if (layer) attMap.removeLayer(layer);
  });
  attProjectCircle = attProjectMarker = attWorkerMarker = null;

  const bounds = [];

  if (p) {
    attProjectMarker = L.marker([p.lat, p.lng]).addTo(attMap).bindPopup(`${p.name} (site)`);
    attProjectCircle = L.circle([p.lat, p.lng], { radius: p.radius, color: '#C1440E', fillColor: '#C1440E', fillOpacity: 0.1, weight: 1.5 }).addTo(attMap);
    bounds.push([p.lat, p.lng]);
  }

  if (a.lat !== undefined && a.lng !== undefined) {
    attWorkerMarker = L.circleMarker([a.lat, a.lng], { radius: 9, color: '#4A5D43', fillColor: '#4A5D43', fillOpacity: 0.9, weight: 2 })
      .addTo(attMap)
      .bindPopup(`${w?.name || 'Worker'} checked in here`);
    bounds.push([a.lat, a.lng]);
  }

  if (bounds.length === 2) attMap.fitBounds(bounds, { padding: [36, 36] });
  else if (bounds.length === 1) attMap.setView(bounds[0], 16);
  else attMap.setView([28.6139, 77.2090], 12);

  setTimeout(() => attMap?.invalidateSize(), 150);
}
document
    .getElementById("closeAttendanceMapBtn")
    ?.addEventListener("click", () => {
        closeAttendanceMap();
    });
function closeAttendanceMap() {
  document.getElementById('attendance-map-backdrop').classList.remove('show');
}

/* ============================================================
   WORKERS
   ============================================================ */
   document
    .getElementById("wm-wage-daily")
    ?.addEventListener("click", () => {
        setWmWageType("daily");
    });

document
    .getElementById("wm-wage-monthly")
    ?.addEventListener("click", () => {
        setWmWageType("monthly");
    });
let wmWageType = 'daily';

function setWmWageType(t) {
  wmWageType = t;
  document.getElementById('wm-wage-daily').classList.toggle('active', t === 'daily');
  document.getElementById('wm-wage-monthly').classList.toggle('active', t === 'monthly');
  document.getElementById('wm-rate-label').textContent = t === 'daily' ? 'Daily rate (₹)' : 'Monthly salary (₹)';
}
document
    .getElementById("addWorkerBtn")
    ?.addEventListener("click", () => {
        openWorkerModal();
    });
document
  .getElementById("workers-table")
  ?.addEventListener("click", (event) => {

    const editButton =
      event.target.closest(".worker-edit-btn");

    if (editButton) {
      const workerId =
        editButton.dataset.workerId;

      if (!workerId) return;

      openWorkerModal(workerId);
      return;
    }

    const removeButton =
      event.target.closest(".worker-remove-btn");

    if (removeButton) {
      const workerId =
        removeButton.dataset.workerId;

      if (!workerId) return;

      removeWorker(workerId);
    }

  });
function openWorkerModal(id) {
  document.getElementById('worker-modal-backdrop').classList.add('show');

  if (id) {
    const w = workerById(id);
    if (!w) return closeWorkerModal();
    document.getElementById('worker-modal-title').textContent = 'Edit worker';
    document.getElementById('wm-id').value = w.id;
    document.getElementById('wm-name').value = w.name;
    document.getElementById('wm-phone').value = w.phone;
    document.getElementById('wm-pass').value = '';
    document.getElementById('wm-rate').value = w.rate;
    setWmWageType(w.wageType);
  } else {
    document.getElementById('worker-modal-title').textContent = 'Add worker';
    document.getElementById('wm-id').value = '';
    document.getElementById('wm-name').value = '';
    document.getElementById('wm-phone').value = '';
    document.getElementById('wm-pass').value = '';
    document.getElementById('wm-rate').value = '';
    setWmWageType('daily');
  }
}

function closeWorkerModal() {
  document.getElementById('worker-modal-backdrop').classList.remove('show');
}
document
    .getElementById("cancelWorkerBtn")
    ?.addEventListener("click", () => {
        closeWorkerModal();
    });

document
    .getElementById("saveWorkerBtn")
    ?.addEventListener("click", () => {
        saveWorker();
    });
async function saveWorker() {
  const id = document.getElementById('wm-id').value;
  const name = document.getElementById('wm-name').value.trim();
  const phone = document.getElementById('wm-phone').value.replace(/\D/g, '');
  const pass = document.getElementById('wm-pass').value;
  const rate = Number(document.getElementById('wm-rate').value);

  if (!name || !/^\d{10}$/.test(phone) || !Number.isFinite(rate) || rate < 0) {
    return showToast('Enter a valid name, 10-digit phone and rate.');
  }
  if (!id && !pass) return showToast('Set a password for the worker.');

  try {
    const payload = { name, phone, wageType: wmWageType, rate };
    if (pass) payload.password = pass;

    if (id) {
      await apiFetch(`/workshop/workers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      showToast('Worker updated.');
    } else {
      await apiFetch('/workshop/workers', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast('Worker added to the crew.');
    }

    closeWorkerModal();
    await refreshAdminData();
    populateWorkerFilter();
    renderWorkersView();
  } catch (e) {
    showToast(e.message);
  }
}

async function removeWorker(id) {
  if (!confirm('Remove this worker? Existing attendance and payment records will remain.')) return;

  try {
    await apiFetch(`/workshop/workers/${id}`, { method: 'DELETE' });
    await refreshAdminData();
    populateWorkerFilter();
    renderWorkersView();
    showToast('Worker removed.');
  } catch (e) {
    showToast(e.message);
  }
}

/* ============================================================
   PAYMENTS
   ============================================================ */
document.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-sage[data-worker-id]");

    if (!button) return;

    openPayModal(button.dataset.workerId);
});
function openPayModal(workerId) {
  const w = workerById(workerId);
  if (!w) return showToast('Worker not found.');

  document.getElementById('pm-worker-id').value = workerId;
  document.getElementById('pm-worker-name').textContent = w.name;
  document.getElementById('pm-type').value = w.wageType === 'monthly' ? 'monthly' : 'wage';
  document.getElementById('pm-amount').value = '';
  document.getElementById('pm-note').value = '';
  document.getElementById('pay-modal-backdrop').classList.add('show');
}

function closePayModal() {
  document.getElementById('pay-modal-backdrop').classList.remove('show');
}
document
    .getElementById("cancelPayBtn")
    ?.addEventListener("click", () => {
        closePayModal();
    });

document
    .getElementById("confirmPayBtn")
    ?.addEventListener("click", () => {
        savePayment();
    });
async function savePayment() {
  const workerId = document.getElementById('pm-worker-id').value;
  const type = document.getElementById('pm-type').value;
  const amount = Number(document.getElementById('pm-amount').value);
  const note = document.getElementById('pm-note').value.trim();

  if (!workerId || !['wage', 'monthly', 'advance'].includes(type) || !Number.isFinite(amount) || amount <= 0) {
    return showToast('Enter a valid payment.');
  }

  try {
    await apiFetch('/workshop/payments', {
      method: 'POST',
      body: JSON.stringify({ workerId, type, amount, note })
    });

    closePayModal();
    await refreshAdminData();
    renderPaymentsView();
    renderOverview();
    showToast('Payment sent to worker.');
  } catch (e) {
    showToast(e.message);
  }
}

/* ============================================================
   WORKER APP
   ============================================================ */
async function refreshWorkerData() {
  const [worker, projects, attendance, payments, salary, sessions] = await Promise.all([
    apiFetch('/workshop/workers/me', {}, 'worker'),
    apiFetch('/workshop/projects/worker', {}, 'worker'),
    apiFetch('/workshop/attendance/mine', {}, 'worker'),
    apiFetch('/workshop/payments/mine', {}, 'worker'),
    apiFetch('/workshop/payments/salary', {}, 'worker'),
    apiFetch('/workshop/sessions/mine', {}, 'worker')
  ]);

  session.worker = normalizeWorker(worker);
  session.workerId = idOf(worker);
  DATA.projects = Array.isArray(projects) ? projects.map(normalizeProject).filter(Boolean) : [];
  DATA.attendance = Array.isArray(attendance) ? attendance.map(normalizeAttendance).filter(Boolean) : [];
  DATA.payments = Array.isArray(payments) ? payments.map(normalizePayment).filter(Boolean) : [];
  DATA.sessions = Array.isArray(sessions) ? sessions.map(normalizeSession).filter(Boolean) : [];
  workerSalary = salary || null;
}

function enterWorker() {
  document.getElementById('screen-login').style.display = 'none';
  document.getElementById('app-admin').classList.remove('active');
  document.getElementById('app-worker').classList.add('active');

  const w = session.worker;
  document.getElementById('worker-greet-name').textContent = w?.name || 'Worker';
  document.getElementById('worker-today-date').textContent = fmtDateNice(todayStr()).toUpperCase();

  populateWorkerProjectSelect();
  refreshWorkerPunchState();
  renderWorkerSalary();
  renderWorkerAttendance();
  renderWorkerAccountView();
  setWorkerTab('salary');
}

function populateWorkerProjectSelect() {
  const sel = document.getElementById('punch-project-select');

  if (!DATA.projects.length) {
    sel.innerHTML = '<option value="">No project sites set up yet</option>';
    sel.disabled = true;
    return;
  }

  sel.disabled = false;
  sel.innerHTML = '<option value="">Select a project site…</option>' +
    DATA.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}

function refreshWorkerPunchState() {
  const todayRecords = DATA.attendance
    .filter(a =>
      String(a.workerId) === String(session.workerId) &&
      a.date === todayStr()
    )
    .sort((a, b) =>
      String(a.time).localeCompare(String(b.time))
    );

  const btn = document.getElementById('punch-btn');
  const label = document.getElementById('punch-label');
  const status = document.getElementById('punch-status');
  const geo = document.getElementById('punch-geo');
  const sel = document.getElementById('punch-project-select');

  const now = new Date();

  // India time
  const indiaParts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now);

  const hour = Number(
    indiaParts.find(p => p.type === 'hour')?.value || 0
  );

  const minute = Number(
    indiaParts.find(p => p.type === 'minute')?.value || 0
  );

  const currentMinutes = hour * 60 + minute;

  // 12:00 PM cutoff
  const isAfternoon = currentMinutes >= 12 * 60;


  // ==================================================
  // NO ATTENDANCE TODAY
  // ==================================================
  if (!todayRecords.length) {

    btn.classList.remove('checked');

    label.textContent = isAfternoon
      ? 'MARK AFTERNOON ATTENDANCE'
      : 'MARK MORNING ATTENDANCE';

    status.innerHTML = isAfternoon
      ? 'Afternoon attendance is available. Select your project and mark attendance.'
      : 'Morning attendance is available. Select your project and mark attendance.';

    geo.classList.add('hidden');

    sel.disabled = false;

    return;
  }


  // ==================================================
  // FIND MORNING / AFTERNOON RECORDS
  // ==================================================
  const morning = todayRecords.find(
    a => a.session === 'morning'
  );

  const afternoon = todayRecords.find(
    a => a.session === 'afternoon'
  );


  // ==================================================
  // ONLY ONE ATTENDANCE TODAY
  // ==================================================
  if (todayRecords.length === 1) {

    const record = todayRecords[0];

    const sessionName =
      record.session === 'afternoon'
        ? 'Afternoon'
        : 'Morning';

    const project =
      projectById(record.projectId) ||
      record.project;

    btn.classList.remove('checked');

    // If afternoon already exists, the missing slot
    // is morning. Normally this only happens when the
    // worker first comes after noon, so don't offer
    // an impossible second "morning" button.
    if (afternoon && !morning) {

      label.textContent = 'AFTERNOON COMPLETE';

      status.innerHTML =
        `Afternoon attendance marked at <b>${record.time}</b>` +
        `${project ? ` — <b>${project.name}</b>` : ''}.`;

    } else {

      label.textContent = isAfternoon
        ? 'MARK AFTERNOON ATTENDANCE'
        : 'MARK AFTERNOON ATTENDANCE';

      status.innerHTML =
        `${sessionName} attendance marked at <b>${record.time}</b>` +
        `${project ? ` — <b>${project.name}</b>` : ''}.<br>` +
        `Second attendance is available after the worker returns.`;
    }

    sel.disabled = false;

    if (
      record.lat !== undefined &&
      record.lng !== undefined
    ) {

      geo.classList.remove('hidden');

      const distTxt =
        record.distance !== undefined &&
        record.distance !== null
          ? ` · ${Math.round(Number(record.distance))}m from site`
          : '';

      geo.innerHTML =
        `<span class="geo-row">📍 ` +
        `${Number(record.lat).toFixed(4)}, ` +
        `${Number(record.lng).toFixed(4)}` +
        `${distTxt}</span>`;
    }

    if (project) {
      sel.value =
        project.id ||
        project._id ||
        '';
    }

    return;
  }


  // ==================================================
  // BOTH ATTENDANCES COMPLETED
  // ==================================================
  btn.classList.add('checked');

  label.textContent = 'ATTENDANCE COMPLETE';

  const morningText = morning
    ? `Morning: <b>${morning.time}</b>`
    : 'Morning: —';

  const afternoonText = afternoon
    ? `Afternoon: <b>${afternoon.time}</b>`
    : 'Afternoon: —';

  status.innerHTML =
    `${morningText}<br>${afternoonText}`;

  sel.disabled = true;

  // Show latest attendance location
  const latest = afternoon || morning;

  if (
    latest &&
    latest.lat !== undefined &&
    latest.lng !== undefined
  ) {

    geo.classList.remove('hidden');

    const distTxt =
      latest.distance !== undefined &&
      latest.distance !== null
        ? ` · ${Math.round(Number(latest.distance))}m from site`
        : '';

    geo.innerHTML =
      `<span class="geo-row">📍 ` +
      `${Number(latest.lat).toFixed(4)}, ` +
      `${Number(latest.lng).toFixed(4)}` +
      `${distTxt}</span>`;

  } else {
    geo.classList.add('hidden');
  }
}
document
    .getElementById("punch-btn")
    ?.addEventListener("click", () => {
        workerPunch();
    });
function workerPunch() {
  const todayRecords = DATA.attendance.filter(a =>
    String(a.workerId) === String(session.workerId) && a.date === todayStr()
  );

  if (todayRecords.length >= 2) {
    return showToast('Attendance is already marked twice for today.');
  }

  const projectId = document.getElementById('punch-project-select').value;
  if (!projectId) return showToast('Select a project site first.');

  if (!navigator.geolocation) {
    return showToast("Your device doesn't support location — can't verify you're on site.");
  }
const now = new Date();

const indiaParts = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).formatToParts(now);

const hour = Number(
  indiaParts.find(p => p.type === 'hour')?.value || 0
);

const minute = Number(
  indiaParts.find(p => p.type === 'minute')?.value || 0
);

const currentMinutes = hour * 60 + minute;

const sessionLabel =
  currentMinutes >= 720
    ? 'afternoon'
    : 'morning';

showToast(
  `Getting your ${sessionLabel} location…`
);
 // showToast(todayRecords.length === 0 ? 'Getting your morning location…' : 'Getting your afternoon location…');

  navigator.geolocation.getCurrentPosition(
    async pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const result = await apiFetch('/workshop/attendance/check-in', {
          method: 'POST',
          body: JSON.stringify({ projectId, lat, lng })
        }, 'worker');

        await refreshWorkerData();
        refreshWorkerPunchState();
        renderWorkerAttendance();
        renderWorkerSalary();
        showToast(result?.message || 'Attendance marked successfully.');
      } catch (e) {
        showToast(e.message || 'Could not mark attendance.');
      }
    },
    () => showToast("Couldn't get your location — attendance requires location access to verify you're on site."),
    { timeout: 8000, enableHighAccuracy: true }
  );
}
document
    .querySelectorAll(".tab-btn[id^='wtab-']")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const tab =
                button.id.replace("wtab-", "");

            setWorkerTab(tab);

        });

    });
function setWorkerTab(tab) {
  document.getElementById('wtab-salary').classList.toggle('active', tab === 'salary');
  document.getElementById('wtab-attendance').classList.toggle('active', tab === 'attendance');
  document.getElementById('wtab-account').classList.toggle('active', tab === 'account');
  document.getElementById('worker-panel-salary').classList.toggle('hidden', tab !== 'salary');
  document.getElementById('worker-panel-attendance').classList.toggle('hidden', tab !== 'attendance');
  document.getElementById('worker-panel-account').classList.toggle('hidden', tab !== 'account');
}

function renderWorkerSalary() {
  const w = session.worker;
  if (!w) return;

  const earned = Number(workerSalary?.earned ?? earnedThisMonth(w));
  const paid = Number(workerSalary?.paid ?? paidThisMonth(w));
  const due = Number(workerSalary?.due ?? Math.max(0, earned - paid));

  document.getElementById('wk-due').textContent = fmtMoney(due);
  document.getElementById('wk-paid').textContent = fmtMoney(paid);
  document.getElementById('wk-wagetype').textContent = w.wageType === 'daily' ? 'Daily wage' : 'Monthly salary';
  document.getElementById('wk-rate').textContent = w.wageType === 'daily' ? fmtMoney(w.rate) + ' / day' : fmtMoney(w.rate) + ' / month';

  const hist = [...DATA.payments].sort((a, b) => (String(b.date) + String(b.id)).localeCompare(String(a.date) + String(a.id)));
  document.getElementById('wk-payment-list').innerHTML = hist.length
    ? hist.map(p => `<div class="hist-item"><div class="l"><div class="d">${typeLabel(p.type)}</div><div class="t">${fmtDateNice(p.date)}${p.note ? ' · ' + p.note : ''}</div></div><div class="amt">${fmtMoney(p.amount)}</div></div>`).join('')
    : emptyState('₹', 'No payments received yet');
}

function typeLabel(t) {
  return t === 'wage' ? 'Wage payment' : t === 'monthly' ? 'Monthly salary' : 'Advance';
}

function renderWorkerAttendance() {
  const recs = [...DATA.attendance].sort((a, b) =>
    (String(b.date) + String(b.time)).localeCompare(String(a.date) + String(a.time))
  );

  const monthPunches = recs.filter(a => isThisMonth(a.date)).length;
  const monthDays = monthPunches / 2;
  const dayLabel = Number.isInteger(monthDays)
    ? String(monthDays)
    : monthDays.toFixed(1);

  document.getElementById('wk-att-count').textContent = `${dayLabel} paid day${monthDays === 1 ? '' : 's'} this month`;

  document.getElementById('wk-attendance-list').innerHTML = recs.length
    ? recs.map(a => {
        const proj = projectById(a.projectId) || a.project;
        const distTxt = a.distance !== undefined && a.distance !== null
          ? ` · ${Math.round(Number(a.distance))}m from site`
          : '';
        const sessionLabel = a.session === 'afternoon' ? 'Afternoon' : 'Morning';
        return `<div class="hist-item">
          <div class="l">
            <div class="d">${fmtDateNice(a.date)}${proj ? ' — ' + proj.name : ''}</div>
            <div class="t">${sessionLabel} · In at ${a.time}${distTxt}</div>
          </div>
          <span class="badge badge-present">${sessionLabel}</span>
        </div>`;
      }).join('')
    : emptyState('◷', 'No attendance recorded yet');
    
    recs.sort((a, b) => a.date !== b.date
  ? String(b.date).localeCompare(String(a.date))
  : String(a.time).localeCompare(String(b.time)));
}

function renderWorkerAccountView() {
  const w = session.worker;
  if (!w) return;

  document.getElementById('worker-account-name').value = w.name || '';
  document.getElementById('worker-account-phone').value = w.phone || '';

  const hist = [...DATA.sessions].sort((a, b) => (String(b.date) + String(b.loginTime)).localeCompare(String(a.date) + String(a.loginTime)));

  document.getElementById('worker-sessions-list').innerHTML = hist.length
    ? hist.map(s => `<div class="hist-item"><div class="l"><div class="d">${fmtDateNice(s.date)}</div><div class="t">In at ${s.loginTime}${s.logoutTime ? ' · Out at ' + s.logoutTime : ''}</div></div>${s.logoutTime ? '' : '<span class="badge badge-present">Signed in</span>'}</div>`).join('')
    : emptyState('⚙', 'No sign-in history yet');
}
document
    .getElementById("saveWorkerAccountBtn")
    ?.addEventListener("click", () => {
        saveWorkerAccount();
    });
async function saveWorkerAccount() {
  const name = document.getElementById('worker-account-name').value.trim();
  if (!name) return showToast('Enter a name to save.');

  try {
    const updated = await apiFetch('/workshop/workers/me', {
      method: 'PUT',
      body: JSON.stringify({ name })
    }, 'worker');

    session.worker = normalizeWorker(updated);
    session.workerId = idOf(updated);
    document.getElementById('worker-greet-name').textContent = updated.name || name;
    showToast('Account updated.');
  } catch (e) {
    showToast(e.message);
  }
}

/* ============================================================
   STARTUP
   ============================================================ 
async function initWorkshopLedger() {
  setLoginRole('admin');

  // Prefer the real BuildSkil account token when present.
  if (localStorage.getItem(BUILD_TOKEN_KEY)) {
    try {
      await refreshAdminData();
      session = { role: 'admin', workerId: null, worker: null };
      enterAdmin();
      return;
    } catch (_) {
      // Keep login screen visible if BuildSkil token is not valid.
    }
  }

  // Otherwise resume a valid worker login token.
  if (localStorage.getItem(WORKER_TOKEN_KEY)) {
    try {
      session = { role: 'worker', workerId: null, worker: null };
      await refreshWorkerData();
      enterWorker();
      return;
    } catch (_) {
      localStorage.removeItem(WORKER_TOKEN_KEY);
    }
  }
}*/
async function initWorkshopLedger() {

  // Always begin with the login UI hidden/shown correctly.
  document
    .getElementById('app-admin')
    .classList.remove('active');

  document
    .getElementById('app-worker')
    .classList.remove('active');

  document
    .getElementById('screen-login')
    .style.display = 'flex';


  const previousSession =
    sessionStorage.getItem(
      LEDGER_SESSION_KEY
    );


  // ==================================================
  // RESTORE ADMIN AFTER PAGE REFRESH
  // ==================================================
  if (
    previousSession === 'admin' &&
    localStorage.getItem(BUILD_TOKEN_KEY)
  ) {

    try {

      await refreshAdminData();

      session = {
        role: 'admin',
        workerId: null,
        worker: null
      };

      enterAdmin();
      return;

    } catch (err) {

      console.error(
        'Could not restore admin session:',
        err
      );

      sessionStorage.removeItem(
        LEDGER_SESSION_KEY
      );
    }
  }


  // ==================================================
  // RESTORE WORKER AFTER PAGE REFRESH
  // ==================================================
  if (
    previousSession === 'worker' &&
    localStorage.getItem(WORKER_TOKEN_KEY)
  ) {

    try {

      session = {
        role: 'worker',
        workerId: null,
        worker: null
      };

      await refreshWorkerData();

      enterWorker();
      return;

    } catch (err) {

      console.error(
        'Could not restore worker session:',
        err
      );

      localStorage.removeItem(
        WORKER_TOKEN_KEY
      );

      sessionStorage.removeItem(
        LEDGER_SESSION_KEY
      );

      session = {
        role: null,
        workerId: null,
        worker: null
      };
    }
  }


  // ==================================================
  // NO ACTIVE LEDGER SESSION
  // SHOW LOGIN SCREEN
  // ==================================================
  session = {
    role: null,
    workerId: null,
    worker: null
  };

  setLoginRole('admin');
}

initWorkshopLedger();

