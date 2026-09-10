(function(){
  const DB_NAME = 'incidentReports';
  const STORE = 'incidents';
  let dbPromise = new Promise((resolve, reject)=>{
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = ()=>{
      const db = req.result;
      if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath:'id', autoIncrement:true });
    };
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error);
  });
  async function dbAdd(entry){ const db = await dbPromise; return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); const r=tx.objectStore(STORE).add(entry); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
  async function dbAll(){ const db = await dbPromise; return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const r=tx.objectStore(STORE).getAll(); r.onsuccess=()=>res(r.result.sort((a,b)=>b.id-a.id)); r.onerror=()=>rej(r.error); }); }
  async function dbDelete(id){ const db = await dbPromise; return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); const r=tx.objectStore(STORE).delete(id); r.onsuccess=()=>res(); r.onerror=()=>rej(r.error); }); }

  const TYPES = ['Theft','Damage','Trespassing','Suspicious Activity','Fire/Safety','Other'];
  let selectedType = null;
  let photoFiles = [];
  let lastPos = null;

  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function fmtTime(iso){ return new Date(iso).toLocaleString(undefined,{ month:'short', day:'numeric', hour:'numeric', minute:'2-digit' }); }

  const typeGrid = document.getElementById('typeGrid');
  TYPES.forEach(t=>{
    const opt = document.createElement('div');
    opt.className = 'type-opt';
    opt.textContent = t;
    opt.addEventListener('click', ()=>{
      selectedType = t;
      typeGrid.querySelectorAll('.type-opt').forEach(o=> o.classList.remove('sel'));
      opt.classList.add('sel');
    });
    typeGrid.appendChild(opt);
  });

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      pos=>{ lastPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }; document.getElementById('gpsNote').textContent = 'Location: ' + lastPos.lat.toFixed(4) + ', ' + lastPos.lng.toFixed(4); },
      ()=>{ document.getElementById('gpsNote').textContent = 'Location unavailable — will save without GPS.'; },
      { timeout:8000 }
    );
  } else {
    document.getElementById('gpsNote').textContent = 'GPS not supported on this device.';
  }

  const photoZone = document.getElementById('photoZone');
  const photoInput = document.getElementById('photoInput');
  const photoThumbs = document.getElementById('photoThumbs');
  photoZone.addEventListener('click', ()=> photoInput.click());
  photoInput.addEventListener('change', (e)=>{
    photoFiles = Array.from(e.target.files || []);
    photoThumbs.innerHTML = '';
    photoFiles.forEach(f=>{
      const img = document.createElement('img');
      img.src = URL.createObjectURL(f);
      photoThumbs.appendChild(img);
    });
  });

  async function render(){
    const all = await dbAll();
    const list = document.getElementById('incidentsList');
    const empty = document.getElementById('emptyState');
    list.innerHTML = '';
    empty.style.display = all.length ? 'none' : 'block';

    all.forEach(inc=>{
      const card = document.createElement('div');
      card.className = 'card';
      const thumbs = (inc.photos||[]).map(p=> '<img src="'+URL.createObjectURL(p)+'">').join('');
      card.innerHTML =
        '<div class="inc-top"><span class="inc-type-badge">'+escHtml(inc.type)+'</span><span class="inc-time">'+fmtTime(inc.timestamp)+'</span></div>'+
        '<div class="inc-desc">'+escHtml(inc.description)+'</div>'+
        '<div class="inc-meta">Reported by '+escHtml(inc.reporter||'—')+(inc.lat?' · GPS tagged':'')+'</div>'+
        (thumbs ? '<div class="inc-thumbs">'+thumbs+'</div>' : '')+
        '<div class="inc-actions"><button class="share-btn">Share</button><button class="del-btn">Delete</button></div>';
      card.querySelector('.share-btn').addEventListener('click', ()=> openShareDrawer(inc));
      card.querySelector('.del-btn').addEventListener('click', async ()=>{
        if(!confirm('Delete this incident report?')) return;
        await dbDelete(inc.id);
        render();
      });
      list.appendChild(card);
    });
  }

  document.getElementById('addBtn').addEventListener('click', ()=>{
    document.getElementById('drawerBackdrop').classList.add('show');
    document.getElementById('addDrawer').classList.add('show');
  });
  document.getElementById('drawerBackdrop').addEventListener('click', ()=>{
    document.getElementById('drawerBackdrop').classList.remove('show');
    document.getElementById('addDrawer').classList.remove('show');
  });

  document.getElementById('saveIncidentBtn').addEventListener('click', async ()=>{
    if(!selectedType){ alert('Choose an incident type.'); return; }
    const desc = document.getElementById('incDesc').value.trim();
    if(!desc){ alert('Add a short description.'); return; }
    await dbAdd({
      type: selectedType,
      description: desc,
      reporter: document.getElementById('incReporter').value.trim(),
      lat: lastPos ? lastPos.lat : null,
      lng: lastPos ? lastPos.lng : null,
      photos: photoFiles,
      timestamp: new Date().toISOString()
    });
    document.getElementById('drawerBackdrop').classList.remove('show');
    document.getElementById('addDrawer').classList.remove('show');
    selectedType = null;
    photoFiles = [];
    typeGrid.querySelectorAll('.type-opt').forEach(o=> o.classList.remove('sel'));
    document.getElementById('incDesc').value = '';
    document.getElementById('incReporter').value = '';
    photoThumbs.innerHTML = '';
    photoInput.value = '';
    render();
  });

  // ---- Share drawer ----
  const shareBackdrop = document.getElementById('shareBackdrop');
  const shareDrawer = document.getElementById('shareDrawer');
  const sharePhone = document.getElementById('sharePhone');
  const shareNote = document.getElementById('shareNote');
  let currentShareIncident = null;

  function openShareDrawer(inc){
    currentShareIncident = inc;
    sharePhone.value = '';
    shareNote.textContent = '';
    shareBackdrop.classList.add('show');
    shareDrawer.classList.add('show');
  }
  shareBackdrop.addEventListener('click', ()=>{
    shareBackdrop.classList.remove('show');
    shareDrawer.classList.remove('show');
  });
  document.getElementById('shareSendBtn').addEventListener('click', ()=>{
    if(!currentShareIncident) return;
    const inc = currentShareIncident;
    const lines = [
      'SECURITY INCIDENT REPORT',
      inc.type,
      fmtTime(inc.timestamp),
      '',
      inc.description,
      '',
      'Reported by: ' + (inc.reporter || '—'),
      inc.lat ? ('Location: ' + inc.lat.toFixed(4) + ', ' + inc.lng.toFixed(4)) : ''
    ].filter(Boolean);
    const text = lines.join('\n');
    const phone = sharePhone.value.trim();
    if(phone){
      const digits = phone.replace(/[^\d+]/g,'');
      const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
      const sep = isIOS ? '&' : '?';
      window.location.href = 'sms:' + digits + sep + 'body=' + encodeURIComponent(text);
      shareNote.textContent = 'Opening your messages app…';
    } else if(navigator.share){
      navigator.share({ title:'Security Incident Report', text }).catch(()=>{});
    } else if(navigator.clipboard){
      navigator.clipboard.writeText(text);
      shareNote.textContent = 'No phone entered — copied instead.';
    }
  });

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  render();
})();