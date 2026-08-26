(function(){
  // ---------- Backend connection ----------
  // Backend runs on a different port than this static file, so this must be
  // an absolute URL, not a relative '/api' path. Update this if the backend's
  // port/host ever changes (e.g. when you deploy, switch to your real domain).
 // const API_BASE = 'http://localhost:5000/api';
  const API_BASE = 'https://api.buildskil.com/api';
  async function apiFetch(path, options = {}) {
    // Adjust 'token' to whatever localStorage key your login flow actually uses.
    // Not sending credentials:'include' — this backend uses a Bearer token, not
    // cookie sessions, and including it can trip CORS if the server doesn't
    // explicitly allow credentials from this origin.
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
 
  const UNITS = ['bags','kg','tons','pcs','m','m³','ltr','rolls'];
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
      currentReport = normalizeReport(saved);
      renderTicket(currentReport);
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
 
  // ---------- Share drawer (no third-party links — native share / SMS only) ----------
  const SHARED_NUMS_KEY = 'dailySiteReportSharedNumbers_v1';
  const shareBackdrop = document.getElementById('shareBackdrop');
  const shareDrawer = document.getElementById('shareDrawer');
  const sharePhone = document.getElementById('sharePhone');
  const shareNote = document.getElementById('shareNote');
  const sharedListWrap = document.getElementById('sharedListWrap');
  const sharedList = document.getElementById('sharedList');
 
  function loadSharedNumbers(){
    try{ return JSON.parse(localStorage.getItem(SHARED_NUMS_KEY)) || []; }catch(e){ return []; }
  }
  function saveSharedNumbers(list){
    try{ localStorage.setItem(SHARED_NUMS_KEY, JSON.stringify(list)); }catch(e){}
  }
  function addSharedNumber(num){
    let list = loadSharedNumbers().filter(n=> n !== num);
    list.unshift(num);
    list = list.slice(0, 8);
    saveSharedNumbers(list);
    renderSharedList();
  }
  function renderSharedList(){
    const list = loadSharedNumbers();
    sharedListWrap.style.display = list.length ? 'block' : 'none';
    sharedList.innerHTML = list.map(num=>
      '<div class="shared-row" data-num="'+escAttr(num)+'">' +
        '<span>'+escHtml(num)+'</span>' +
        '<button class="mini-x" aria-label="Remove">✕</button>' +
      '</div>'
    ).join('');
    sharedList.querySelectorAll('.shared-row').forEach(row=>{
      row.addEventListener('click', (e)=>{
        const num = row.getAttribute('data-num');
        if(e.target.classList.contains('mini-x')){
          e.stopPropagation();
          saveSharedNumbers(loadSharedNumbers().filter(n=> n !== num));
          renderSharedList();
        } else {
          sharePhone.value = num;
        }
      });
    });
  }
 
  function openShareDrawer(){
    shareNote.textContent = '';
    renderSharedList();
    shareBackdrop.classList.add('show');
    shareDrawer.classList.add('show');
  }
  function closeShareDrawer(){
    shareBackdrop.classList.remove('show');
    shareDrawer.classList.remove('show');
  }
  //document.getElementById('shareBtn').addEventListener('click', openShareDrawer);
  shareBackdrop.addEventListener('click', closeShareDrawer);
 
  document.getElementById('shareSendBtn').addEventListener('click', ()=>{
    const phone = sharePhone.value.trim();
    const text = reportToText(currentReport);
 
    if(phone){
      const digits = phone.replace(/[^\d+]/g,'');
      const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
      const sep = isIOS ? '&' : '?';
      window.location.href = 'sms:' + digits + sep + 'body=' + encodeURIComponent(text);
      shareNote.textContent = 'Opening your messages app…';
      addSharedNumber(phone);
    } else if(navigator.share){
      navigator.share({ title:'Daily Site Report', text: text }).catch(()=>{});
      shareNote.textContent = '';
    } else if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text);
      shareNote.textContent = 'No phone entered — report text copied instead.';
    }
  });
 
  document.getElementById('newDayBtn').addEventListener('click', ()=>{
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
        currentReport = r;
        renderTicket(r);
        histView.style.display = 'none';
        reportView.style.display = 'block';
        ctaBar.style.display = 'none';
      });
      histList.appendChild(item);
    });
  }
 
  document.getElementById('openHistBtn').addEventListener('click', ()=>{
    formView.style.display = 'none';
    ctaBar.style.display = 'none';
    renderHistory();
    histView.style.display = 'block';
    setBackVisible(true);
  });
  /*document.getElementById('closeHistBtn').addEventListener('click', ()=>{
    histView.style.display = 'none';
    formView.style.display = 'block';
    ctaBar.style.display = 'flex';
    setBackVisible(false);
  });*/
 
})();
