(function(){
  const API_BASE = 'https://api.buildskil.com/api';
  //const API_BASE = 'http://localhost:5000/api';
  async function apiFetch(path, options = {}) {

    const token = localStorage.getItem('cb_token');
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (token) headers['Authorization'] = 'Bearer ' + token;
 
    const res = await fetch(API_BASE + path, { ...options, headers });
 
    if (res.status === 401) {
      alert('Your session has expired — please log in again.');
      throw new Error('Not logged in');
    }
    if (!res.ok) {
      let msg = 'Something went wrong.';
      try { msg = (await res.json()).message || msg; } catch (e) {}
      throw new Error(msg);
    }
    return res.status === 204 ? null : res.json();
  }
 
  // Server sends Mongo's _id and a full ISO datetime for `date` — normalize once
  // so the rest of this file can keep using .id and plain 'YYYY-MM-DD' strings.
  function normalizeReport(r){
    r.id = r._id || r.id;
    if (r.date) r.date = String(r.date).slice(0, 10);
    return r;
  }
 
  const dateInput = document.getElementById('dateInput');
  const dateBig = document.getElementById('dateBig');
  const siteNameInput = document.getElementById('siteNameInput');
  const backBtn = document.getElementById('backBtn');
  const exitBtn = document.getElementById('exitBtn');
  const techInput = document.getElementById('techInput');
  const labourInput = document.getElementById('labourInput');
  const otherInput = document.getElementById('otherInput');
  const workersTotal = document.getElementById('workersTotal');
  const pctNumber = document.getElementById('pctNumber');
  const pctSlider = document.getElementById('pctSlider');
  const pctBar = document.getElementById('pctBar');
  const materialsList = document.getElementById('materialsList');
  const problemsList = document.getElementById('problemsList');
  const tomorrowList = document.getElementById('tomorrowList');
  /* Photos elements removed along with the Photos section — see commented HTML above.
  const photoZone = document.getElementById('photoZone');
  const photoInput = document.getElementById('photoInput');
  const photoCount = document.getElementById('photoCount');
  const thumbs = document.getElementById('thumbs');
  */
 
  const formView = document.getElementById('formView');
  const reportView = document.getElementById('reportView');
  const histView = document.getElementById('histView');
  const ctaBar = document.getElementById('ctaBar');
 
  let materials = [];   // {name, qty, unit}
  let problems = [];    // strings
  let tomorrow = [];    // strings
  /* let photoFiles = []; — photos feature disabled for now */
 
  const UNITS = ['bags','kg','tons','pcs','m','m³','ltr','rolls','foot'];
  const SITE_NAME_KEY = 'dailySiteReportSiteName_v1';
 
  function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
  function formatDay(iso){
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday:'long', month:'short', day:'numeric', year:'numeric' });
  }
 
  // remember the last-used site name so it doesn't need retyping every day
  try{ siteNameInput.value = localStorage.getItem(SITE_NAME_KEY) || ''; }catch(e){}
  siteNameInput.addEventListener('input', ()=>{
    try{ localStorage.setItem(SITE_NAME_KEY, siteNameInput.value); }catch(e){}
  });
 
  // ---------- Fixed-header back button: shown on report/history views ----------
  function setBackVisible(show){ backBtn.style.display = show ? 'flex' : 'none'; }
  backBtn.addEventListener('click', ()=>{
    if(reportView.style.display === 'block'){
      reportView.style.display = 'none';
      formView.style.display = 'block';
      ctaBar.style.display = 'flex';
      setBackVisible(false);
    } else if(histView.style.display === 'block'){
      histView.style.display = 'none';
      formView.style.display = 'block';
      ctaBar.style.display = 'flex';
      setBackVisible(false);
    }
  });
 
  // Header ✕ — always visible; leaves the page entirely (browser back) rather
  // than navigating within the app, so it's reachable from the main form too.
  exitBtn.addEventListener('click', ()=> window.history.back());
 
  dateInput.value = todayISO();
  dateBig.textContent = formatDay(dateInput.value);
  dateInput.addEventListener('change', ()=>{ dateBig.textContent = formatDay(dateInput.value || todayISO()); });
 
  function updateWorkersTotal(){
    const total = (Number(techInput.value)||0) + (Number(labourInput.value)||0) + (Number(otherInput.value)||0);
    workersTotal.textContent = total;
    return total;
  }
  [techInput, labourInput, otherInput].forEach(inp=> inp.addEventListener('input', updateWorkersTotal));
  updateWorkersTotal();
 
  function barColor(p){ return p >= 80 ? 'var(--green)' : p >= 40 ? 'var(--yellow)' : 'var(--amber)'; }
 
 
  function syncPct(val){
    val = Math.max(0, Math.min(100, Number(val) || 0));
    pctNumber.value = val; pctSlider.value = val;
    pctBar.style.width = val + '%';
    pctBar.style.background = barColor(val);
  }
  pctNumber.addEventListener('input', ()=> syncPct(pctNumber.value));
  pctSlider.addEventListener('input', ()=> syncPct(pctSlider.value));
  syncPct(0);
 
  // ---------- Materials ----------
  function renderMaterials(){
    materialsList.innerHTML = '';
    materials.forEach((m, i)=>{
      const row = document.createElement('div');
      row.className = 'mat-row';
      row.innerHTML =
        '<input class="mname" type="text" placeholder="Material (e.g. Cement)" value="'+escAttr(m.name)+'">' +
        '<input class="mqty" type="number" placeholder="Qty" value="'+(m.qty||'')+'" inputmode="decimal">' +
        '<select>' + UNITS.map(u=>'<option '+(u===m.unit?'selected':'')+'>'+u+'</option>').join('') + '</select>' +
        '<div class="row-x">✕</div>';
      const [nameEl, qtyEl, unitEl, xEl] = row.children;
      nameEl.addEventListener('input', e=> m.name = e.target.value);
      qtyEl.addEventListener('input', e=> m.qty = e.target.value);
      unitEl.addEventListener('change', e=> m.unit = e.target.value);
      xEl.addEventListener('click', ()=>{ materials.splice(i,1); renderMaterials(); });
      materialsList.appendChild(row);
    });
  }
  document.getElementById('addMaterialBtn').addEventListener('click', ()=>{
    materials.push({name:'', qty:'', unit:'bags'}); renderMaterials();
  });
  materials.push({name:'Cement', qty:'', unit:'bags'});
  renderMaterials();
 
  // ---------- Generic text list (problems / tomorrow) ----------
  function renderTextList(container, arr, placeholder, onChange){
    container.innerHTML = '';
    arr.forEach((val, i)=>{
      const row = document.createElement('div');
      row.className = 'txt-row';
      row.innerHTML = '<input type="text" placeholder="'+placeholder+'" value="'+escAttr(val)+'"><div class="row-x">✕</div>';
      const [inp, xEl] = row.children;
      inp.addEventListener('input', e=>{ arr[i] = e.target.value; });
      xEl.addEventListener('click', ()=>{ arr.splice(i,1); onChange(); });
      container.appendChild(row);
    });
  }
  function renderProblems(){ renderTextList(problemsList, problems, 'e.g. Water shortage', renderProblems); }
  function renderTomorrow(){ renderTextList(tomorrowList, tomorrow, 'e.g. Slab shuttering', renderTomorrow); }
  document.getElementById('addProblemBtn').addEventListener('click', ()=>{ problems.push(''); renderProblems(); });
  document.getElementById('addTomorrowBtn').addEventListener('click', ()=>{ tomorrow.push(''); renderTomorrow(); });
  renderProblems(); renderTomorrow();
 
  /* ---------- Photos (disabled — see commented HTML section above) ----------
  photoZone.addEventListener('click', ()=> photoInput.click());
  photoInput.addEventListener('change', (e)=>{
    photoFiles = Array.from(e.target.files || []);
    photoCount.textContent = photoFiles.length;
    photoZone.classList.toggle('has', photoFiles.length > 0);
    thumbs.innerHTML = '';
    photoFiles.slice(0, 12).forEach(f=>{
      const img = document.createElement('img');
      img.src = URL.createObjectURL(f);
      thumbs.appendChild(img);
    });
  });
  */
 
  function escAttr(s){ return String(s||'').replace(/"/g,'&quot;'); }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
 
  // ---------- Build + show report ----------
  function collect(){
    return {
      date: dateInput.value || todayISO(),
      siteName: siteNameInput.value.trim(),
      technicians: Number(techInput.value) || 0,
      labour: Number(labourInput.value) || 0,
      other: Number(otherInput.value) || 0,
      workers: updateWorkersTotal(),
      pct: Number(pctNumber.value) || 0,
      materials: materials.filter(m=>m.name.trim()!==''),
      problems: problems.map(p=>p.trim()).filter(Boolean),
      tomorrow: tomorrow.map(t=>t.trim()).filter(Boolean),
      savedAt: new Date().toISOString()
    };
  }
 
  function renderTicket(r){
    document.getElementById('rSiteName').textContent = r.siteName ? r.siteName : 'Daily Site Report';
    document.getElementById('rDay').textContent = formatDay(r.date);
    document.getElementById('rWorkersBreakdown').innerHTML =
      '<div class="t-list-row"><span>Technicians</span><span>'+r.technicians+'</span></div>' +
      '<div class="t-list-row"><span>Labour/Helpers</span><span>'+r.labour+'</span></div>' +
      '<div class="t-list-row"><span>Other</span><span>'+r.other+'</span></div>' +
      '<div class="t-list-row" style="font-weight:700;color:var(--yellow);"><span>Total</span><span>'+r.workers+'</span></div>';
    document.getElementById('rPct').textContent = r.pct + '%';
    const rBar = document.getElementById('rBar');
    rBar.style.width = r.pct + '%'; rBar.style.background = barColor(r.pct);
 
    const rMat = document.getElementById('rMaterials');
    rMat.innerHTML = r.materials.length ? r.materials.map(m=>
      '<div class="t-list-row"><span>'+escHtml(m.name)+'</span><span>'+escHtml(m.qty||'—')+' '+escHtml(m.unit)+'</span></div>'
    ).join('') : '<div class="t-empty">None logged</div>';
 
    const rProb = document.getElementById('rProblems');
    rProb.innerHTML = r.problems.length ? r.problems.map(p=>'<div class="t-bullet">'+escHtml(p)+'</div>').join('')
      : '<div class="t-empty">No problems reported</div>';
 
    /* document.getElementById('rPhotos').textContent = r.photoCount; — Photos disabled */
 
    const rTom = document.getElementById('rTomorrow');
    rTom.innerHTML = r.tomorrow.length ? r.tomorrow.map(t=>'<div class="t-bullet">'+escHtml(t)+'</div>').join('')
      : '<div class="t-empty">Not set</div>';
  }
 
  function reportToText(r){
    let lines = [];
    lines.push('DAILY SITE REPORT');
    if(r.siteName) lines.push(r.siteName);
    lines.push(formatDay(r.date));
    lines.push('');
    lines.push('Workers:');
    lines.push('  Technicians   ' + r.technicians);
    lines.push('  Labour/Helper ' + r.labour);
    lines.push('  Other         ' + r.other);
    lines.push('  Total         ' + r.workers);
    lines.push('');
    lines.push('Work completed: ' + r.pct + '%');
    lines.push('');
    lines.push('Material used:');
    if(r.materials.length) r.materials.forEach(m=> lines.push('  ' + m.name.padEnd(14) + (m.qty||'—') + ' ' + m.unit));
    else lines.push('  None logged');
    lines.push('');
    lines.push('Problems:');
    if(r.problems.length) r.problems.forEach(p=> lines.push('  - ' + p));
    else lines.push('  None reported');
    lines.push('');
    /* lines.push('Photos: ' + r.photoCount); lines.push(''); — Photos disabled */
    lines.push('Tomorrow:');
    if(r.tomorrow.length) r.tomorrow.forEach(t=> lines.push('  - ' + t));
    else lines.push('  Not set');
    return lines.join('\n');
  }
 
  let currentReport = null;
 
  document.getElementById('finishBtn').addEventListener('click', async ()=>{
    const payload = collect();
    try {
      const saved = await apiFetch('/daily-reports', { method:'POST', body: JSON.stringify(payload) });
      showOwnerReport(saved);
      formView.style.display = 'none';
      ctaBar.style.display = 'none';
      reportView.style.display = 'block';
      setBackVisible(true);
    } catch (err) {
      alert('Could not save today\'s report: ' + err.message);
    }
  });
 
  document.getElementById('editBtn').addEventListener('click', ()=>{
    reportView.style.display = 'none';
    formView.style.display = 'block';
    ctaBar.style.display = 'flex';
    setBackVisible(false);
  });
 
  document.getElementById('copyBtn').addEventListener('click', ()=>{
    const flag = document.getElementById('copiedFlag');
    const txt = reportToText(currentReport);
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(()=>{
        flag.textContent = 'Copied — paste it into a message or email.';
        setTimeout(()=> flag.textContent='', 3000);
      }).catch(()=>{ flag.textContent = 'Could not copy — select and copy manually.'; });
    }
  });
 
  // =========================================================
  // DAILY REPORT SHARING
  // =========================================================
  // Owner endpoints:
  //   POST   /daily-reports/:id/share
  //   GET    /daily-reports/:id/shared
  //   DELETE /daily-reports/:id/share/:phone
  //
  // Recipient endpoints:
  //   GET /daily-reports/shared-with-me
  //   GET /daily-reports/shared-with-me/:id
  // =========================================================

  let viewingSharedReport = false;
  let sharedReports = [];

  const shareBackdrop = document.getElementById('shareBackdrop');
  const shareDrawer = document.getElementById('shareDrawer');
  const sharePhone = document.getElementById('sharePhone');
  const shareNote = document.getElementById('shareNote');
  const sharedListWrap = document.getElementById('sharedListWrap');
  const sharedList = document.getElementById('sharedList');
  const shareSendBtn = document.getElementById('shareSendBtn');

  function normalizeIndianPhone(value){
    let digits = String(value || '').replace(/\D/g, '');

    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.slice(2);
    }

    if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }

    return /^[6-9]\d{9}$/.test(digits) ? digits : '';
  }

  function displayIndianPhone(phone){
    const normalized = normalizeIndianPhone(phone);
    return normalized ? '+91 ' + normalized : String(phone || '');
  }

  function getReportId(report){
    return String(
      report?.id ||
      report?._id ||
      (report?.reportId && typeof report.reportId === 'object'
        ? report.reportId._id || report.reportId.id
        : report?.reportId) ||
      ''
    );
  }

  function normalizeSharedReport(item){
    // Backend normally returns a flattened report. This fallback also
    // supports a response where reportId is populated as an object.
    const source =
      item?.reportId && typeof item.reportId === 'object'
        ? { ...item.reportId, ...item }
        : item || {};

    source.id =
      source._id ||
      source.id ||
      (item?.reportId && typeof item.reportId === 'object'
        ? item.reportId._id || item.reportId.id
        : item?.reportId) ||
      '';

    if (source.date) {
      source.date = String(source.date).slice(0, 10);
    }

    source.siteName = String(source.siteName || '');
    source.technicians = Number(source.technicians) || 0;
    source.labour = Number(source.labour) || 0;
    source.other = Number(source.other) || 0;
    source.pct = Math.max(0, Math.min(100, Number(source.pct) || 0));

    source.workers =
      Number(source.workers) ||
      source.technicians + source.labour + source.other;

    source.materials = Array.isArray(source.materials)
      ? source.materials.map(m => ({
          name: String(m?.name || ''),
          qty: String(m?.qty ?? ''),
          unit: String(m?.unit || 'bags'),
        }))
      : [];

    source.problems = Array.isArray(source.problems)
      ? source.problems.map(p => String(p).trim()).filter(Boolean)
      : [];

    source.tomorrow = Array.isArray(source.tomorrow)
      ? source.tomorrow.map(t => String(t).trim()).filter(Boolean)
      : [];

    return source;
  }

  function setReportActionMode(isShared){
    viewingSharedReport = !!isShared;

    const editButton = document.getElementById('editBtn');
    const shareButton = document.getElementById('shareBtn');
    const newDayButton = document.getElementById('newDayBtn');

    if(editButton){
      editButton.style.display = isShared ? 'none' : '';
    }

    if(shareButton){
      shareButton.style.display = isShared ? 'none' : '';
    }

    if(newDayButton){
      newDayButton.style.display = isShared ? 'none' : '';
    }
  }

  function showOwnerReport(report){
    viewingSharedReport = false;
    setReportActionMode(false);

    currentReport = normalizeReport(report);
    renderTicket(currentReport);

    formView.style.display = 'none';
    histView.style.display = 'none';
    ctaBar.style.display = 'none';
    reportView.style.display = 'block';

    setBackVisible(true);
  }

  function showSharedReport(report){
    viewingSharedReport = true;
    setReportActionMode(true);

    currentReport = normalizeSharedReport(report);
    renderTicket(currentReport);

    formView.style.display = 'none';
    histView.style.display = 'none';
    ctaBar.style.display = 'none';
    reportView.style.display = 'block';

    setBackVisible(true);

    const siteTitle = document.getElementById('rSiteName');

    if(siteTitle){
      const ownerName = report?.owner?.name || ' user';
      const ownerPhone = report?.owner?.phone || '';

      let title = currentReport.siteName || 'Daily Site Report';
      title += ' · Shared by ' + ownerName;

      if(ownerPhone){
        title += ' (' + displayIndianPhone(ownerPhone) + ')';
      }

      siteTitle.textContent = title;
    }
  }

  function ensureSharedReportsUI(){
    let button = document.getElementById('openSharedReportsBtn');
    if(button) return button;

    const historyButton = document.getElementById('openHistBtn');
    if(!historyButton || !historyButton.parentElement){
      console.warn('openHistBtn not found.');
      return null;
    }

    button = document.createElement('button');
    button.id = 'openSharedReportsBtn';
    button.type = 'button';
   button.className = 'shared-reports-btn';

button.innerHTML =
  '<span class="shared-reports-icon">↗</span>' +
  '<span class="shared-reports-text">Shared with me</span>' +
  '<span id="sharedReportsBadge" class="shared-reports-badge">0</span>';

    historyButton.parentElement.insertBefore(
      button,
      historyButton.nextSibling
    );

    button.addEventListener('click', openSharedReports);
    return button;
  }

  function updateSharedReportsBadge(count){
    const badge = document.getElementById('sharedReportsBadge');
    if(!badge) return;

    const total = Math.max(0, Number(count) || 0);
    badge.textContent = String(total);
    badge.style.display = total > 0 ? 'inline-flex' : 'none';
  }

  async function fetchSharedReports(){
    const data = await apiFetch('/daily-reports/shared-with-me');

    sharedReports = Array.isArray(data)
      ? data.map(normalizeSharedReport)
      : [];

    updateSharedReportsBadge(sharedReports.length);
    return sharedReports;
  }

  async function fetchSharedReportDetails(report){
    const reportId = getReportId(report);

    if(!reportId){
      throw new Error('Shared report ID is missing.');
    }

    // Always fetch the protected single-report endpoint when opening.
    // This guarantees the preview uses the complete report content.
    const data = await apiFetch(
      '/daily-reports/shared-with-me/' +
      encodeURIComponent(reportId)
    );

    return normalizeSharedReport({
      ...(report || {}),
      ...(data || {}),
    });
  }

  async function openSharedReports(){
    const button = document.getElementById('openSharedReportsBtn');

    if(button) button.disabled = true;

    try{
      const all = await fetchSharedReports();

      formView.style.display = 'none';
      reportView.style.display = 'none';
      ctaBar.style.display = 'none';
      histView.style.display = 'block';

      setBackVisible(true);
      renderSharedHistory(all);
    }catch(error){
      console.error('OPEN SHARED DAILY REPORTS ERROR:', error);

      alert(
        'Could not load shared reports: ' +
        (error?.message || 'Something went wrong.')
      );
    }finally{
      if(button) button.disabled = false;
    }
  }

  function renderSharedHistory(all){
    const histList = document.getElementById('histList');
    const histEmpty = document.getElementById('histEmpty');

    if(!histList || !histEmpty) return;

    histList.innerHTML = '';
    histEmpty.textContent =
      'No reports have been shared with you yet.';
    histEmpty.style.display = all.length ? 'none' : 'block';

    all.forEach(report => {
      const item = document.createElement('div');
      item.className = 'hist-item';

      const ownerName =
        report?.owner?.name || ' user';

      const ownerPhone =
        report?.owner?.phone || '';

      const siteText = report.siteName
        ? ' · ' + escHtml(report.siteName)
        : '';

      item.innerHTML =
        '<div>' +
          '<div class="d">' +
            formatDay(report.date) +
            siteText +
          '</div>' +
          '<div class="m">' +
            escHtml(ownerName) +
            (ownerPhone ? ' · ' + escHtml(ownerPhone) : '') +
            ' · ' + report.workers +
            ' workers · ' + report.pct + '% complete' +
          '</div>' +
          '<div style="margin-top:5px;font-size:12px;font-weight:700;color:#2563eb;">' +
            '🔒 Read Only · Shared with you' +
          '</div>' +
        '</div>' +
        '<button type="button" class="del-btn shared-open-btn">Open</button>';

      item.addEventListener('click', async event => {
        event.preventDefault();
        event.stopPropagation();

        try{
          histList.querySelectorAll('.shared-open-btn').forEach(btn => {
            btn.disabled = true;
          });

          // Fetch the complete protected report before showing it.
          const completeReport =
            await fetchSharedReportDetails(report);

          showSharedReport(completeReport);
        }catch(error){
          console.error('OPEN SHARED REPORT ERROR:', error);

          alert(
            'Preview unavailable: ' +
            (error?.message || 'This shared report cannot be opened.')
          );
        }finally{
          histList.querySelectorAll('.shared-open-btn').forEach(btn => {
            btn.disabled = false;
          });
        }
      });

      histList.appendChild(item);
    });
  }

  // =========================================================
  // OWNER SHARE DRAWER
  // =========================================================

  function openShareDrawer(){
    if(!currentReport || !getReportId(currentReport)){
      alert('Save the daily report first before sharing it.');
      return;
    }

    shareNote.textContent = '';
    sharePhone.value = '';

    shareBackdrop.classList.add('show');
    shareDrawer.classList.add('show');

    loadSharedUsers();
  }

  function closeShareDrawer(){
    shareBackdrop.classList.remove('show');
    shareDrawer.classList.remove('show');
    shareNote.textContent = '';
  }

  if(document.getElementById('shareBtn')){
    document.getElementById('shareBtn').addEventListener(
      'click',
      openShareDrawer
    );
  }

  if(shareBackdrop){
    shareBackdrop.addEventListener('click', closeShareDrawer);
  }

  async function loadSharedUsers(){
    if(!currentReport || !getReportId(currentReport)) return;

    if(sharedListWrap){
      sharedListWrap.style.display = 'block';
    }

    if(sharedList){
      sharedList.innerHTML =
        '<div class="shared-row"><span>Loading shared users...</span></div>';
    }

    try{
      const users = await apiFetch(
        '/daily-reports/' +
        encodeURIComponent(getReportId(currentReport)) +
        '/shared'
      );

      if(!Array.isArray(users) || !users.length){
        sharedList.innerHTML =
          '<div class="shared-row"><span>No users have access yet.</span></div>';
        return;
      }

      sharedList.innerHTML = users.map(user => {
        const phone = user.userPhone || user.phone || '';
        const name = user.name || ' user';

        return (
          '<div class="shared-row">' +
            '<div style="display:flex;flex-direction:column;gap:3px;min-width:0;flex:1;">' +
              '<strong>' + escHtml(name) + '</strong>' +
              '<span>' + escHtml(displayIndianPhone(phone)) + '</span>' +
              '<small>🔒 Read Only</small>' +
            '</div>' +
            '<button class="mini-x" type="button" data-remove-phone="' +
              escAttr(phone) +
              '" aria-label="Remove access">✕</button>' +
          '</div>'
        );
      }).join('');

      sharedList
        .querySelectorAll('[data-remove-phone]')
        .forEach(button => {
          button.addEventListener('click', async event => {
            event.stopPropagation();

            const phone = button.getAttribute('data-remove-phone');
            if(phone) await removeSharedUser(phone);
          });
        });
    }catch(error){
      console.error('LOAD SHARED USERS ERROR:', error);

      if(sharedList){
        sharedList.innerHTML =
          '<div class="shared-row"><span>Unable to load shared users.</span></div>';
      }
    }
  }

  async function shareCurrentReport(){
    if(viewingSharedReport){
      shareNote.textContent =
        'Shared reports are read-only.';
      return;
    }

    const reportId = getReportId(currentReport);

    if(!reportId){
      shareNote.textContent =
        'Save the report before sharing it.';
      return;
    }

    const rawPhone = sharePhone.value.trim();

    if(!rawPhone){
      shareNote.textContent =
        'Please enter a phone number.';
      sharePhone.focus();
      return;
    }

    const phone = normalizeIndianPhone(rawPhone);

    if(!phone){
      shareNote.textContent =
        'Enter a valid 10-digit Indian mobile number.';
      sharePhone.focus();
      return;
    }

    shareSendBtn.disabled = true;
    const oldText = shareSendBtn.textContent;

    shareSendBtn.textContent = 'Sharing...';
    shareNote.textContent = 'Checking your account...';

    try{
      const result = await apiFetch(
        '/daily-reports/' +
        encodeURIComponent(reportId) +
        '/share',
        {
          method: 'POST',
          body: JSON.stringify({ phone })
        }
      );

      shareNote.textContent =
        result?.message ||
        'Report shared successfully.';

      sharePhone.value = '';
      await loadSharedUsers();

      // Keep the existing direct SMS behavior after successful API sharing.
      const text = reportToText(currentReport);
      const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
      const sep = isIOS ? '&' : '?';

      setTimeout(() => {
        window.location.href =
          'sms:' +
          phone +
          sep +
          'body=' +
          encodeURIComponent(text);
      }, 150);
    }catch(error){
      console.error('SHARE DAILY REPORT ERROR:', error);
      shareNote.textContent =
        error?.message ||
        'Failed to share report.';
    }finally{
      shareSendBtn.disabled = false;
      shareSendBtn.textContent = oldText;
    }
  }

  if(shareSendBtn){
    shareSendBtn.addEventListener(
      'click',
      shareCurrentReport
    );
  }

  async function removeSharedUser(phone){
    const reportId = getReportId(currentReport);

    if(!reportId) return;

    const normalizedPhone = normalizeIndianPhone(phone);

    if(!normalizedPhone){
      shareNote.textContent = 'Invalid shared phone number.';
      return;
    }

    if(!window.confirm(
      'Remove report access for ' +
      displayIndianPhone(normalizedPhone) +
      '?' 
    )){
      return;
    }

    shareNote.textContent = 'Removing access...';

    try{
      const result = await apiFetch(
        '/daily-reports/' +
        encodeURIComponent(reportId) +
        '/share/' +
        encodeURIComponent(normalizedPhone),
        { method: 'DELETE' }
      );

      shareNote.textContent =
        result?.message ||
        'Report access removed.';

      await loadSharedUsers();
    }catch(error){
      console.error('REMOVE REPORT SHARE ERROR:', error);
      shareNote.textContent =
        error?.message ||
        'Failed to remove report access.';
    }
  }

  ensureSharedReportsUI();

  document.getElementById('newDayBtn').addEventListener('click', ()=>{
    if(viewingSharedReport){
      alert('A shared report is read-only.');
      return;
    }
    currentReport = null;
    setReportActionMode(false);
    techInput.value = ''; labourInput.value = ''; otherInput.value = ''; updateWorkersTotal();
    syncPct(0);
    materials = [{name:'', qty:'', unit:'bags'}]; renderMaterials();
    problems = []; renderProblems();
    tomorrow = []; renderTomorrow();
    /* photoFiles = []; photoCount.textContent = '0'; thumbs.innerHTML=''; photoZone.classList.remove('has'); — Photos disabled */
    dateInput.value = todayISO(); dateBig.textContent = formatDay(dateInput.value);
    reportView.style.display = 'none';
    formView.style.display = 'block';
    ctaBar.style.display = 'flex';
  });
 
  // ---------- History ----------
  async function fetchHistory(){
    try {
      const data = await apiFetch('/daily-reports');
      return data.map(normalizeReport);
    } catch (err) {
      alert('Could not load past reports: ' + err.message);
      return [];
    }
  }
 
  async function renderHistory(){
    const all = await fetchHistory();
    const histList = document.getElementById('histList');
    const histEmpty = document.getElementById('histEmpty');
    histList.innerHTML = '';
    histEmpty.style.display = all.length ? 'none' : 'block';
    all.forEach(r=>{
      const item = document.createElement('div');
      item.className = 'hist-item';
      item.innerHTML =
        '<div><div class="d">'+formatDay(r.date)+(r.siteName? ' · '+escHtml(r.siteName):'')+'</div><div class="m">'+r.workers+' workers · '+r.pct+'% complete</div></div>' +
        '<button class="del-btn">Delete</button>';
      item.addEventListener('click', async (e)=>{
        if(e.target.classList.contains('del-btn')){
          e.stopPropagation();
          if(!confirm('Delete the report for ' + formatDay(r.date) + '? This cannot be undone.')) return;
          try {
            await apiFetch('/daily-reports/' + r.id, { method:'DELETE' });
            renderHistory();
          } catch (err) {
            alert('Could not delete this report: ' + err.message);
          }
          return;
        }
        showOwnerReport(r);
      });
      histList.appendChild(item);
    });
  }
 
  document.getElementById('openHistBtn').addEventListener('click', ()=>{
    setReportActionMode(false);
    formView.style.display = 'none';
    ctaBar.style.display = 'none';
    renderHistory();
    histView.style.display = 'block';
    setBackVisible(true);
  });
  // Preload recipient inbox badge when the page opens.
  (async function preloadSharedReports(){
    try{
      await fetchSharedReports();
    }catch(error){
      console.warn(
        'Shared daily reports preload failed:',
        error?.message || error
      );
    }
  })();

  document.getElementById('closeHistBtn').addEventListener('click', ()=>{
    setReportActionMode(false);
    histView.style.display = 'none';
    formView.style.display = 'block';
    ctaBar.style.display = 'flex';
    setBackVisible(false);
  });
 
})();
