(function(){
  const STORAGE_KEY = 'siteWorkforce_v1';

  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function formatDay(iso){
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' });
  }
  function money(n){
    const v = Math.round(Number(n)||0);
    return '₹' + v.toLocaleString('en-IN');
  }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function uid(prefix){ return (prefix||'w') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }

  let data = { workers: [], projects: [] };
  function load(){
    try{
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(raw && raw.workers){ data = raw; if(!data.projects) data.projects = []; }
    }catch(e){}
  }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  load();

  // seed a couple of example rows on very first run so the list isn't empty/confusing
  if(data.workers.length === 0){
    data.workers.push(
      { id:uid(), name:'Ramesh Kumar', role:'Mason', wage:800, attendance:{}, notes:{}, advances:[], checkins:[] },
      { id:uid(), name:'Suresh Yadav', role:'Helper', wage:500, attendance:{}, notes:{}, advances:[], checkins:[] }
    );
    save();
  }
  // make sure every worker has well-formed fields even on existing/older saved data
  // (heals cases where a field was missing, null, or saved as the wrong type)
  if(!Array.isArray(data.projects)) data.projects = [];
  data.workers.forEach(w=>{
    if(!Array.isArray(w.checkins)) w.checkins = [];
    if(!Array.isArray(w.advances)) w.advances = [];
    if(!w.attendance || typeof w.attendance !== 'object') w.attendance = {};
    if(!w.notes || typeof w.notes !== 'object') w.notes = {};
  });
  save();

  let selectedDate = todayISO();
  let searchTerm = '';
  let activeWorkerId = null;

  const dateInput = document.getElementById('dateInput');
  const workerList = document.getElementById('workerList');
  const searchInput = document.getElementById('searchInput');
  const statPresent = document.getElementById('statPresent');
  const statHalf = document.getElementById('statHalf');
  const statAbsent = document.getElementById('statAbsent');
  const statTotal = document.getElementById('statTotal');

  dateInput.value = selectedDate;
  dateInput.addEventListener('change', ()=>{ selectedDate = dateInput.value || todayISO(); renderList(); });
  searchInput.addEventListener('input', ()=>{ searchTerm = searchInput.value.trim().toLowerCase(); renderList(); });

  const ATT_CYCLE = [undefined, 'present', 'half', 'absent'];
  function nextAtt(cur){
    const i = ATT_CYCLE.indexOf(cur);
    return ATT_CYCLE[(i + 1) % ATT_CYCLE.length];
  }
  function attLabel(a){ return a==='present'?'P' : a==='half'?'H' : a==='absent'?'A' : '—'; }
  function attClass(a){ return a==='present'?'present' : a==='half'?'half' : a==='absent'?'absent' : ''; }

  function workerEarnings(w, fromDate, toDate){
    let present=0, half=0, absent=0, earned=0;
    Object.entries(w.attendance||{}).forEach(([date,a])=>{
      if(fromDate && date < fromDate) return;
      if(toDate && date > toDate) return;
      if(a==='present'){ present++; earned += Number(w.wage)||0; }
      else if(a==='half'){ half++; earned += (Number(w.wage)||0)/2; }
      else if(a==='absent'){ absent++; }
    });
    const advTotal = (w.advances||[]).filter(a=>
      (!fromDate || a.date >= fromDate) && (!toDate || a.date <= toDate)
    ).reduce((s,a)=> s + (Number(a.amount)||0), 0);
    const balance = earned - advTotal;
    return { present, half, absent, earned, advTotal, balance };
  }

  function renderStats(){
    const list = data.workers;
    let p=0,h=0,a=0;
    list.forEach(w=>{
      const st = (w.attendance||{})[selectedDate];
      if(st==='present') p++; else if(st==='half') h++; else if(st==='absent') a++;
    });
    statPresent.textContent = p; statHalf.textContent = h; statAbsent.textContent = a; statTotal.textContent = list.length;
  }

  function renderList(){
    renderStats();
    const term = searchTerm;
    const filtered = data.workers.filter(w=>
      !term || w.name.toLowerCase().includes(term) || w.role.toLowerCase().includes(term)
    );
    workerList.innerHTML = '';
    if(filtered.length === 0){
      workerList.innerHTML = '<div class="empty-note">'+(data.workers.length? 'No workers match your search.' : 'No workers yet — tap + to add your first one.')+'</div>';
      return;
    }
    filtered.forEach(w=>{
      const st = (w.attendance||{})[selectedDate];
      const fin = workerEarnings(w);
      const balCls = fin.balance > 0.5 ? 'owe' : fin.balance < -0.5 ? 'over' : 'clear';
      const balTxt = fin.balance > 0.5 ? 'Owed ' + money(fin.balance)
                    : fin.balance < -0.5 ? 'Overpaid ' + money(-fin.balance)
                    : 'Settled';

      const row = document.createElement('div');
      row.className = 'worker-row';
      row.innerHTML =
        '<div class="w-info">' +
          '<div class="w-name">'+escHtml(w.name)+'</div>' +
          '<div class="w-meta"><span class="w-role">'+escHtml(w.role)+'</span><span class="w-wage">'+money(w.wage)+'/day</span></div>' +
          '<div class="w-balance '+balCls+'">'+balTxt+'</div>' +
        '</div>' +
        '<div class="att-chip '+attClass(st)+'" data-id="'+w.id+'">'+attLabel(st)+'</div>';

      row.querySelector('.w-info').addEventListener('click', ()=> openDetail(w.id));
      row.querySelector('.att-chip').addEventListener('click', ()=>{
        w.attendance = w.attendance || {};
        w.attendance[selectedDate] = nextAtt(w.attendance[selectedDate]);
        if(w.attendance[selectedDate] === undefined) delete w.attendance[selectedDate];
        save();
        renderList();
      });
      workerList.appendChild(row);
    });
  }

  document.getElementById('markAllBtn').addEventListener('click', ()=>{
    data.workers.forEach(w=>{
      w.attendance = w.attendance || {};
      if(!w.attendance[selectedDate]) w.attendance[selectedDate] = 'present';
    });
    save(); renderList();
  });

  // ---------- Payout summary ----------
  const mainView = document.getElementById('mainView');
  const payoutView = document.getElementById('payoutView');
  const geoView = document.getElementById('geoView');
  const rangeFrom = document.getElementById('rangeFrom');
  const rangeTo = document.getElementById('rangeTo');
  const payoutList = document.getElementById('payoutList');
  const presetBtns = document.querySelectorAll('.preset-btn');

  function earliestRecordDate(){
    let min = todayISO();
    data.workers.forEach(w=>{
      Object.keys(w.attendance||{}).forEach(d=>{ if(d < min) min = d; });
      (w.advances||[]).forEach(a=>{ if(a.date < min) min = a.date; });
    });
    return min;
  }

  function applyPreset(kind){
    presetBtns.forEach(b=> b.classList.toggle('active', b.dataset.range === kind));
    const today = todayISO();
    if(kind === 'week'){
      const d = new Date(); d.setDate(d.getDate()-6);
      rangeFrom.value = d.toISOString().slice(0,10);
      rangeTo.value = today;
    } else if(kind === 'month'){
      const d = new Date(); d.setDate(1);
      rangeFrom.value = d.toISOString().slice(0,10);
      rangeTo.value = today;
    } else {
      rangeFrom.value = earliestRecordDate();
      rangeTo.value = today;
    }
    renderPayout();
  }
  presetBtns.forEach(b=> b.addEventListener('click', ()=> applyPreset(b.dataset.range)));
  rangeFrom.addEventListener('change', ()=>{ presetBtns.forEach(b=>b.classList.remove('active')); renderPayout(); });
  rangeTo.addEventListener('change', ()=>{ presetBtns.forEach(b=>b.classList.remove('active')); renderPayout(); });

  function renderPayout(){
    const from = rangeFrom.value, to = rangeTo.value;
    let totalEarned = 0, totalAdv = 0, totalBal = 0;
    payoutList.innerHTML = '';
    if(data.workers.length === 0){
      payoutList.innerHTML = '<div class="empty-note">No workers on the roster yet.</div>';
    }
    data.workers.forEach(w=>{
      const fin = workerEarnings(w, from, to);
      const owed = Math.max(0, fin.balance); // paid/overpaid workers contribute 0, not a negative offset
      totalEarned += fin.earned; totalAdv += fin.advTotal; totalBal += owed;
      const cls = owed > 0.5 ? 'owe' : 'clear';
      const balDisplay = owed > 0.5 ? money(owed) : money(0);
      const row = document.createElement('div');
      row.className = 'payout-row';
      row.innerHTML =
        '<div class="po-top">' +
          '<div><div class="po-name">'+escHtml(w.name)+'</div><div class="po-role">'+escHtml(w.role)+'</div></div>' +
          (owed > 0.5 ? '<button class="pay-btn" data-id="'+w.id+'">Pay '+money(owed)+'</button>' : '') +
        '</div>' +
        '<div class="po-nums">' +
          '<div>Earned<span>'+money(fin.earned)+'</span></div>' +
          '<div>Paid<span>'+money(fin.advTotal)+'</span></div>' +
          '<div class="po-bal '+cls+'">Balance<span>'+balDisplay+'</span></div>' +
        '</div>';
      const payBtn = row.querySelector('.pay-btn');
      if(payBtn) payBtn.addEventListener('click', ()=> payWorker(w.id, owed));
      payoutList.appendChild(row);
    });
    document.getElementById('gcEarned').textContent = money(totalEarned);
    document.getElementById('gcAdvances').textContent = money(totalAdv);
    document.getElementById('gcBalance').textContent = money(totalBal);
  }

  function payWorker(id, amount){
    const w = data.workers.find(x=> x.id === id);
    if(!w || amount <= 0) return;
    w.advances = w.advances || [];
    w.advances.push({ amount, note:'Payout settlement', date: todayISO() });
    save(); renderPayout(); renderList();
  }

  document.getElementById('payAllBtn').addEventListener('click', ()=>{
    const from = rangeFrom.value, to = rangeTo.value;
    const owing = data.workers.map(w=> ({ w, fin: workerEarnings(w, from, to) })).filter(x=> x.fin.balance > 0.5);
    if(owing.length === 0){ alert('No one has an outstanding balance in this range.'); return; }
    const total = owing.reduce((s,x)=> s + x.fin.balance, 0);
    if(!confirm('Record a payout of ' + money(total) + ' across ' + owing.length + ' worker(s)?')) return;
    owing.forEach(x=>{
      x.w.advances = x.w.advances || [];
      x.w.advances.push({ amount: x.fin.balance, note:'Payout settlement', date: todayISO() });
    });
    save(); renderPayout(); renderList();
  });

  document.getElementById('openPayoutBtn').addEventListener('click', ()=>{
    mainView.style.display = 'none';
    payoutView.style.display = 'block';
    fabAdd.style.display = 'none';
    applyPreset('week');
  });
  document.getElementById('closePayoutBtn').addEventListener('click', ()=>{
    payoutView.style.display = 'none';
    mainView.style.display = 'block';
    fabAdd.style.display = 'flex';
  });

  // ---------- Geo attendance ----------
  const geoProjectSelect = document.getElementById('geoProjectSelect');
  const geoWorkerSelect = document.getElementById('geoWorkerSelect');
  const siteEmptyNote = document.getElementById('siteEmptyNote');
  const checkinBtn = document.getElementById('checkinBtn');
  const geoMsg = document.getElementById('geoMsg');
  const radarStatus = document.getElementById('radarStatus');
  const checkinLog = document.getElementById('checkinLog');

  function haversine(lat1,lng1,lat2,lng2){
    const R=6371000, toRad=d=>d*Math.PI/180;
    const dLat=toRad(lat2-lat1), dLng=toRad(lng2-lng1);
    const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
    return 2*R*Math.asin(Math.sqrt(a));
  }

  // fetches the live worker roster into the geo check-in dropdown, so any
  // worker added via the "+" FAB is immediately available here too
  function populateGeoSelects(){
    const prevWorker = geoWorkerSelect.value;
    const prevProject = geoProjectSelect.value;

    geoWorkerSelect.innerHTML = data.workers.map(w=>
      '<option value="'+w.id+'">'+escHtml(w.name)+' — '+escHtml(w.role)+'</option>'
    ).join('') || '<option value="">No workers on roster</option>';
    if(prevWorker && data.workers.some(w=>w.id===prevWorker)) geoWorkerSelect.value = prevWorker;

    geoProjectSelect.innerHTML = data.projects.map(p=>
      '<option value="'+p.id+'">'+escHtml(p.name)+'</option>'
    ).join('');
    siteEmptyNote.style.display = data.projects.length ? 'none' : 'block';
    if(prevProject && data.projects.some(p=>p.id===prevProject)) geoProjectSelect.value = prevProject;

    checkinBtn.disabled = !data.workers.length || !data.projects.length;
  }

  function drawRadar(distance, radius, bearingRad, active){
    const svg = document.getElementById('radarSvg');
    const cx=90, cy=90, maxR=76;
    let html = '';
    [1, 0.66, 0.33].forEach(f=>{
      html += '<circle cx="'+cx+'" cy="'+cy+'" r="'+(maxR*f)+'" fill="none" stroke="#2b3136" stroke-width="1" stroke-dasharray="3,4"/>';
    });
    const refDist = Math.max(distance, radius) * 1.4 || radius;
    const scale = Math.min(maxR / refDist, maxR / radius);
    const geoR = Math.min(radius * scale, maxR);
    html += '<circle cx="'+cx+'" cy="'+cy+'" r="'+geoR+'" fill="rgba(242,194,48,0.08)" stroke="#f2c230" stroke-width="1.5"/>';
    html += '<line x1="'+cx+'" y1="8" x2="'+cx+'" y2="172" stroke="#2b3136" stroke-width="1"/>';
    html += '<line x1="8" y1="'+cy+'" x2="172" y2="'+cy+'" stroke="#2b3136" stroke-width="1"/>';
    html += '<circle cx="'+cx+'" cy="'+cy+'" r="3" fill="#8b9298"/>';
    if(active){
      const r = Math.min(distance*scale, maxR);
      const mx = cx + r*Math.cos(bearingRad);
      const my = cy + r*Math.sin(bearingRad);
      const color = distance<=radius ? '#31d17a' : (distance<=radius*1.5 ? '#ffb020' : '#ff5347');
      html += '<line x1="'+cx+'" y1="'+cy+'" x2="'+mx+'" y2="'+my+'" stroke="'+color+'" stroke-width="1.5" stroke-dasharray="2,3"/>';
      html += '<circle cx="'+mx+'" cy="'+my+'" r="6.5" fill="'+color+'" stroke="#1c2024" stroke-width="2"/>';
    }
    svg.innerHTML = html;
  }
  drawRadar(0,150,0,false);

  // merges every worker's check-ins into one reverse-chronological feed
  function allCheckinsSorted(){
    const rows = [];
    data.workers.forEach(w=>{
      const list = Array.isArray(w.checkins) ? w.checkins : [];
      list.forEach(c=> rows.push(Object.assign({workerId:w.id, workerName:w.name}, c)));
    });
    rows.sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time));
    return rows;
  }

  function renderCheckinLog(){
    const rows = allCheckinsSorted();
    checkinLog.innerHTML = rows.length ? rows.map(c=>
      '<div class="checkin-row">' +
        '<div class="ci-left">' +
          '<div class="ci-name">'+escHtml(c.workerName)+'</div>' +
          '<div class="ci-meta">'+escHtml(c.projectName)+' · '+formatDay(c.date)+' '+escHtml(c.time)+'</div>' +
        '</div>' +
        '<div class="ci-right">' +
          '<div class="ci-dist">'+Math.round(c.distance)+' m</div>' +
          '<span class="flag-pill '+(c.ok?'ok':'bad')+'">'+(c.ok?'Verified':'Flagged')+'</span>' +
        '</div>' +
      '</div>'
    ).join('') : '<div class="empty-note">No check-ins yet.</div>';
  }

  checkinBtn.addEventListener('click', ()=>{
    const worker = data.workers.find(w=> w.id === geoWorkerSelect.value);
    const project = data.projects.find(p=> p.id === geoProjectSelect.value);
    if(!worker || !project) return;

    if(!navigator.geolocation){
      geoMsg.textContent = 'Geolocation is not supported on this device.';
      geoMsg.classList.add('err');
      return;
    }
    geoMsg.textContent = 'Locating…';
    geoMsg.classList.remove('err');
    checkinBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(pos=>{
      const { latitude, longitude } = pos.coords;
      const distance = haversine(latitude, longitude, project.lat, project.lng);
      const ok = distance <= project.radius;
      const bearing = Math.atan2(latitude - project.lat, longitude - project.lng);
      const time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

      if(!Array.isArray(worker.checkins)) worker.checkins = [];
      worker.checkins.push({
        id: uid('ci'), date: todayISO(), time, projectId: project.id, projectName: project.name,
        lat: latitude, lng: longitude, distance, ok
      });
      save();

      drawRadar(distance, project.radius, -bearing, true);
      radarStatus.textContent = ok ? 'Within geofence' : 'Outside geofence — flagged';
      radarStatus.className = 'radar-status ' + (ok ? 'ok' : (distance<=project.radius*1.5 ? 'warn' : 'bad'));
      geoMsg.textContent = 'Checked in at '+time+' · '+Math.round(distance)+'m from site';
      renderCheckinLog();
      checkinBtn.disabled = false;
    }, err=>{
      geoMsg.textContent = 'Location access denied or unavailable — enable GPS permissions to check in.';
      geoMsg.classList.add('err');
      radarStatus.textContent = 'Location unavailable';
      radarStatus.className = 'radar-status bad';
      checkinBtn.disabled = false;
    }, { enableHighAccuracy:true, timeout:8000 });
  });

  document.getElementById('openGeoBtn').addEventListener('click', ()=>{
    mainView.style.display = 'none';
    geoView.style.display = 'block';
    fabAdd.style.display = 'none';
    populateGeoSelects();
    renderCheckinLog();
  });
  document.getElementById('closeGeoBtn').addEventListener('click', ()=>{
    geoView.style.display = 'none';
    mainView.style.display = 'block';
    fabAdd.style.display = 'flex';
  });

  // ---------- Add site drawer ----------
  const siteBackdrop = document.getElementById('siteBackdrop');
  const siteDrawer = document.getElementById('siteDrawer');
  const siteName = document.getElementById('siteName');
  const siteLat = document.getElementById('siteLat');
  const siteLng = document.getElementById('siteLng');
  const siteRadius = document.getElementById('siteRadius');
  const siteLocMsg = document.getElementById('siteLocMsg');

  function openSiteDrawer(){
    siteName.value=''; siteLat.value=''; siteLng.value=''; siteRadius.value='150'; siteLocMsg.textContent='';
    siteBackdrop.classList.add('show'); siteDrawer.classList.add('show');
    setTimeout(()=> siteName.focus(), 200);
  }
  function closeSiteDrawer(){ siteBackdrop.classList.remove('show'); siteDrawer.classList.remove('show'); }
  document.getElementById('addSiteBtn').addEventListener('click', openSiteDrawer);
  siteBackdrop.addEventListener('click', closeSiteDrawer);

  document.getElementById('useCurrentLocBtn').addEventListener('click', ()=>{
    if(!navigator.geolocation){ siteLocMsg.textContent = 'Geolocation not supported on this device.'; siteLocMsg.classList.add('err'); return; }
    siteLocMsg.textContent = 'Locating…'; siteLocMsg.classList.remove('err');
    navigator.geolocation.getCurrentPosition(pos=>{
      siteLat.value = pos.coords.latitude.toFixed(6);
      siteLng.value = pos.coords.longitude.toFixed(6);
      siteLocMsg.textContent = 'Location captured.';
    }, err=>{
      siteLocMsg.textContent = 'Could not get location — enter latitude/longitude manually.';
      siteLocMsg.classList.add('err');
    }, { enableHighAccuracy:true, timeout:8000 });
  });

  document.getElementById('saveSiteBtn').addEventListener('click', ()=>{
    const name = siteName.value.trim();
    const lat = parseFloat(siteLat.value);
    const lng = parseFloat(siteLng.value);
    const radius = parseFloat(siteRadius.value) || 150;
    if(!name){ siteName.focus(); return; }
    if(isNaN(lat) || isNaN(lng)){ siteLocMsg.textContent = 'Add coordinates — tap "Use my current location" or enter them manually.'; siteLocMsg.classList.add('err'); return; }
    data.projects.push({ id: uid('site'), name, lat, lng, radius });
    save(); closeSiteDrawer(); populateGeoSelects();
  });

  // ---------- Add worker drawer ----------
  const addBackdrop = document.getElementById('addBackdrop');
  const addDrawer = document.getElementById('addDrawer');
  const fabAdd = document.getElementById('fabAdd');
  const newName = document.getElementById('newName');
  const newRole = document.getElementById('newRole');
  const newWage = document.getElementById('newWage');

  function openAdd(){
    newName.value=''; newRole.value='Mason'; newWage.value='';
    addBackdrop.classList.add('show'); addDrawer.classList.add('show');
    setTimeout(()=> newName.focus(), 200);
  }
  function closeAdd(){ addBackdrop.classList.remove('show'); addDrawer.classList.remove('show'); }
  fabAdd.addEventListener('click', openAdd);
  addBackdrop.addEventListener('click', closeAdd);

  document.getElementById('saveNewBtn').addEventListener('click', ()=>{
    const name = newName.value.trim();
    if(!name){ newName.focus(); return; }
    data.workers.push({
      id: uid(), name, role: newRole.value, wage: Number(newWage.value)||0,
      attendance:{}, notes:{}, advances:[], checkins:[]
    });
    save(); closeAdd(); renderList(); populateGeoSelects();
  });

  // ---------- Detail drawer ----------
  const detailBackdrop = document.getElementById('detailBackdrop');
  const detailDrawer = document.getElementById('detailDrawer');
  const dWage = document.getElementById('dWage');
  const dNote = document.getElementById('dNote');

  function getActiveWorker(){ return data.workers.find(w=> w.id === activeWorkerId); }

  function renderDetail(){
    const w = getActiveWorker();
    if(!w) return;
    document.getElementById('dName').textContent = w.name;
    document.getElementById('dRole').textContent = w.role;
    dWage.value = w.wage;
    dNote.value = (w.notes||{})[selectedDate] || '';

    const fin = workerEarnings(w);
    document.getElementById('dPresentDays').textContent = fin.present;
    document.getElementById('dHalfDays').textContent = fin.half;
    document.getElementById('dAbsentDays').textContent = fin.absent;

    const advList = document.getElementById('advList');
    advList.innerHTML = (w.advances||[]).length ? w.advances.map((a,i)=>
      '<div class="adv-row"><span>'+formatDay(a.date)+(a.note? ' — '+escHtml(a.note):'')+'</span>' +
      '<span><span class="amt">'+money(a.amount)+'</span><span class="del" data-i="'+i+'"> ✕</span></span></div>'
    ).join('') : '<div class="adv-empty">No advances or payments recorded</div>';
    advList.querySelectorAll('.del').forEach(el=>{
      el.addEventListener('click', ()=>{
        const i = Number(el.dataset.i);
        w.advances.splice(i,1); save(); renderDetail(); renderList();
      });
    });

    // site check-ins merged into this worker's own history
    const ciList = document.getElementById('dCheckinList');
    const checkins = (Array.isArray(w.checkins) ? w.checkins : []).slice().sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time));
    ciList.innerHTML = checkins.length ? checkins.map(c=>
      '<div class="ci-detail-row"><span class="l">'+formatDay(c.date)+' '+escHtml(c.time)+' — '+escHtml(c.projectName)+'</span>' +
      '<span class="r"><span class="ci-dist">'+Math.round(c.distance)+'m</span><br>' +
      '<span class="flag-pill '+(c.ok?'ok':'bad')+'">'+(c.ok?'Verified':'Flagged')+'</span></span></div>'
    ).join('') : '<div class="adv-empty">No site check-ins recorded</div>';

    const balEl = document.getElementById('dBalance');
    const balNote = document.getElementById('dBalanceNote');
    balEl.className = 'v';
    if(fin.balance > 0.5){ balEl.textContent = money(fin.balance); balEl.classList.add('owe'); balNote.textContent = 'Still owed to worker'; }
    else if(fin.balance < -0.5){ balEl.textContent = money(-fin.balance); balEl.classList.add('over'); balNote.textContent = 'Advances exceed wages earned'; }
    else { balEl.textContent = money(0); balEl.classList.add('clear'); balNote.textContent = 'Fully settled'; }
  }

  function openDetail(id){
    activeWorkerId = id;
    renderDetail();
    detailBackdrop.classList.add('show'); detailDrawer.classList.add('show');
  }
  function closeDetail(){ detailBackdrop.classList.remove('show'); detailDrawer.classList.remove('show'); activeWorkerId = null; }
  document.getElementById('closeDetailBtn').addEventListener('click', closeDetail);
  detailBackdrop.addEventListener('click', closeDetail);

  dWage.addEventListener('change', ()=>{
    const w = getActiveWorker(); if(!w) return;
    w.wage = Number(dWage.value) || 0; save(); renderDetail(); renderList();
  });
  dNote.addEventListener('change', ()=>{
    const w = getActiveWorker(); if(!w) return;
    w.notes = w.notes || {}; w.notes[selectedDate] = dNote.value; save();
  });

  document.getElementById('addAdvBtn').addEventListener('click', ()=>{
    const w = getActiveWorker(); if(!w) return;
    const amt = Number(document.getElementById('advAmount').value) || 0;
    if(amt <= 0) return;
    const note = document.getElementById('advNote').value.trim();
    w.advances = w.advances || [];
    w.advances.push({ amount: amt, note, date: selectedDate });
    document.getElementById('advAmount').value = ''; document.getElementById('advNote').value = '';
    save(); renderDetail(); renderList();
  });

  document.getElementById('deleteWorkerBtn').addEventListener('click', ()=>{
    const w = getActiveWorker(); if(!w) return;
    if(!confirm('Remove ' + w.name + ' from the roster? Their attendance, advance and check-in history will be deleted too.')) return;
    data.workers = data.workers.filter(x=> x.id !== w.id);
    save(); closeDetail(); renderList(); populateGeoSelects();
  });
document.getElementById('homeBtn').addEventListener('click', ()=>{
 window.history.back(); // change to your home screen's filename/URL
});
  renderList();
  populateGeoSelects();
})();
