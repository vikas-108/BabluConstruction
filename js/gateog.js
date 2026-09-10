(function(){
  const DB_NAME = 'visitorLog';
  const STORE = 'visitors';
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
  async function dbPut(entry){ const db = await dbPromise; return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); const r=tx.objectStore(STORE).put(entry); r.onsuccess=()=>res(); r.onerror=()=>rej(r.error); }); }
  async function dbAll(){ const db = await dbPromise; return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const r=tx.objectStore(STORE).getAll(); r.onsuccess=()=>res(r.result.sort((a,b)=>b.id-a.id)); r.onerror=()=>rej(r.error); }); }
  async function dbDelete(id){ const db = await dbPromise; return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); const r=tx.objectStore(STORE).delete(id); r.onsuccess=()=>res(); r.onerror=()=>rej(r.error); }); }

  const mainView = document.getElementById('mainView');
  const histView = document.getElementById('histView');
  const ctaBar = document.getElementById('ctaBar');
  let photoBlob = null;

  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function fmtTime(iso){ return new Date(iso).toLocaleString(undefined,{ month:'short', day:'numeric', hour:'numeric', minute:'2-digit' }); }

  async function render(){
    const all = await dbAll();
    const onsite = all.filter(v=> !v.exitTime);
    document.getElementById('onsiteCount').textContent = onsite.length;
    const list = document.getElementById('visitorsList');
    const empty = document.getElementById('emptyState');
    list.innerHTML = '';
    empty.style.display = onsite.length ? 'none' : 'block';

    onsite.forEach(v=>{
      const card = document.createElement('div');
      card.className = 'visitor-card';
      const imgUrl = v.photo ? URL.createObjectURL(v.photo) : null;
      card.innerHTML =
        '<div class="v-thumb">'+(imgUrl?'<img src="'+imgUrl+'">':'👤')+'</div>'+
        '<div class="v-info">'+
          '<div class="v-name">'+escHtml(v.name)+'</div>'+
          '<div class="v-meta">'+escHtml(v.purpose||'')+(v.host?' · to see '+escHtml(v.host):'')+'<br>In: '+fmtTime(v.entryTime)+(v.vehicle?' · '+escHtml(v.vehicle):'')+'</div>'+
          '<span class="v-badge in">On Site</span>'+
        '</div>'+
        '<div class="v-actions"><button class="exit-btn">Mark Exit</button></div>';
      card.querySelector('.exit-btn').addEventListener('click', async ()=>{
        v.exitTime = new Date().toISOString();
        await dbPut(v);
        render();
      });
      list.appendChild(card);
    });
  }

  async function renderHistory(){
    const all = await dbAll();
    const exited = all.filter(v=> v.exitTime);
    const list = document.getElementById('histList');
    const empty = document.getElementById('histEmpty');
    list.innerHTML = '';
    empty.style.display = exited.length ? 'none' : 'block';
    exited.forEach(v=>{
      const card = document.createElement('div');
      card.className = 'visitor-card exited';
      const imgUrl = v.photo ? URL.createObjectURL(v.photo) : null;
      card.innerHTML =
        '<div class="v-thumb">'+(imgUrl?'<img src="'+imgUrl+'">':'👤')+'</div>'+
        '<div class="v-info">'+
          '<div class="v-name">'+escHtml(v.name)+'</div>'+
          '<div class="v-meta">'+escHtml(v.purpose||'')+'<br>In: '+fmtTime(v.entryTime)+'<br>Out: '+fmtTime(v.exitTime)+'</div>'+
          '<span class="v-badge out">Exited</span>'+
        '</div>'+
        '<div class="v-actions"><button class="del-btn">Delete</button></div>';
      card.querySelector('.del-btn').addEventListener('click', async ()=>{
        if(!confirm('Delete this visitor record?')) return;
        await dbDelete(v.id);
        renderHistory();
      });
      list.appendChild(card);
    });
  }

  document.getElementById('openHistBtn').addEventListener('click', ()=>{
    mainView.style.display = 'none'; ctaBar.style.display = 'none';
    renderHistory();
    histView.style.display = 'block';
  });
  document.getElementById('closeHistBtn').addEventListener('click', ()=>{
    histView.style.display = 'none'; mainView.style.display = 'block'; ctaBar.style.display = 'flex';
  });

  // ---- Add drawer ----
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const addDrawer = document.getElementById('addDrawer');
  const photoZone = document.getElementById('photoZone');
  const photoInput = document.getElementById('photoInput');
  const photoPlaceholder = document.getElementById('photoPlaceholder');

  photoZone.addEventListener('click', ()=> photoInput.click());
  photoInput.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    photoBlob = file;
    photoZone.classList.add('has');
    photoZone.innerHTML = '<img src="'+URL.createObjectURL(file)+'">';
  });

  function resetForm(){
    photoBlob = null;
    photoZone.classList.remove('has');
    photoZone.innerHTML = '📷 Tap to take a photo';
    document.getElementById('visName').value = '';
    document.getElementById('visPhone').value = '';
    document.getElementById('visVehicle').value = '';
    document.getElementById('visPurpose').value = '';
    document.getElementById('visHost').value = '';
    photoInput.value = '';
  }

  document.getElementById('addBtn').addEventListener('click', ()=>{
    drawerBackdrop.classList.add('show');
    addDrawer.classList.add('show');
  });
  drawerBackdrop.addEventListener('click', ()=>{
    drawerBackdrop.classList.remove('show');
    addDrawer.classList.remove('show');
  });

  document.getElementById('saveVisitorBtn').addEventListener('click', async ()=>{
    const name = document.getElementById('visName').value.trim();
    if(!name){ alert('Enter the visitor\'s name.'); return; }
    await dbAdd({
      name,
      phone: document.getElementById('visPhone').value.trim(),
      vehicle: document.getElementById('visVehicle').value.trim(),
      purpose: document.getElementById('visPurpose').value.trim(),
      host: document.getElementById('visHost').value.trim(),
      photo: photoBlob,
      entryTime: new Date().toISOString(),
      exitTime: null
    });
    drawerBackdrop.classList.remove('show');
    addDrawer.classList.remove('show');
    resetForm();
    render();
  });

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  render();
})();