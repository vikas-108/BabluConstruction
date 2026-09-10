(function(){
  const STORAGE_KEY = 'wallDeductionCalc_v1';

  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function formatDay(iso){
    if(!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  }
  function money(n){ return '₹' + Math.round(Number(n)||0).toLocaleString('en-IN'); }
  function sqft(n){ return Math.round((Number(n)||0)*100)/100 + ' sqft'; }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function uid(p){ return (p||'w') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }

  let calcs = [];
  function loadCalcs(){
    try{ const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)); if(Array.isArray(raw)) calcs = raw; }catch(e){}
    calcs.forEach(c=>{
      if(!Array.isArray(c.walls)) c.walls = [];
      // migrate any old flat top-level `openings` list onto the first wall, then drop it
      if(Array.isArray(c.openings) && c.openings.length && c.walls.length){
        c.walls[0].openings = (c.walls[0].openings || []).concat(c.openings);
      }
      delete c.openings;
      c.walls.forEach(w=>{ if(!Array.isArray(w.openings)) w.openings = []; });
    });
  }
  function saveCalcs(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(calcs)); }
  loadCalcs();

  let searchTerm = '';
  let editingId = null;
  let walls = []; // each wall now owns its own openings[]

  const listView = document.getElementById('listView');
  const editorView = document.getElementById('editorView');
  const calcList = document.getElementById('calcList');
  const fabAdd = document.getElementById('fabAdd');

  function wallDeductions(w){
    let door=0, win=0, other=0;
    (w.openings||[]).forEach(o=>{
      const area = (Number(o.width)||0)*(Number(o.height)||0)*(Number(o.qty)||1);
      if(o.type==='door') door += area;
      else if(o.type==='window') win += area;
      else other += area;
    });
    return { door, win, other };
  }
  function wallGross(w){ return (Number(w.width)||0)*(Number(w.height)||0); }
  function wallNet(w){
    const d = wallDeductions(w);
    return Math.max(0, wallGross(w) - d.door - d.win - d.other);
  }

  function totalsOf(c){
    let gross=0, doorDed=0, winDed=0, otherDed=0;
    (c.walls||[]).forEach(w=>{
      gross += wallGross(w);
      const d = wallDeductions(w);
      doorDed += d.door; winDed += d.win; otherDed += d.other;
    });
    const net = Math.max(0, gross - doorDed - winDed - otherDed);
    const plasterCost = net * (Number(c.plasterRate)||0);
    const paintCost = net * (Number(c.paintRate)||0);
    return { gross, doorDed, winDed, otherDed, net, plasterCost, paintCost, total: plasterCost+paintCost };
  }

  document.getElementById('searchInput').addEventListener('input', (e)=>{
    searchTerm = e.target.value.trim().toLowerCase();
    renderList();
  });

  function renderList(){
    const filtered = calcs.filter(c => !searchTerm || (c.room||'').toLowerCase().includes(searchTerm));
    calcList.innerHTML = '';
    if(filtered.length === 0){
      calcList.innerHTML = '<div class="empty-note">'+(calcs.length ? 'No calculations match your search.' : 'No calculations yet — tap + to start your first room.')+'</div>';
      return;
    }
    filtered.slice().sort((a,b)=> (b.date||'').localeCompare(a.date||'')).forEach(c=>{
      const t = totalsOf(c);
      const card = document.createElement('div');
      card.className = 'calc-card';
      card.innerHTML =
        '<div class="cc-top">' +
          '<div>' +
            '<div class="cc-name">'+escHtml(c.room || 'Untitled room')+'</div>' +
            '<div class="cc-meta">'+formatDay(c.date)+'</div>' +
          '</div>' +
          '<div><div class="cc-total">'+sqft(t.net)+'</div><div class="cc-sub">'+money(t.total)+' est.</div></div>' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button data-act="edit">Edit</button>' +
          '<button data-act="dup">Duplicate</button>' +
          '<button data-act="del" class="danger">Delete</button>' +
        '</div>';
      card.querySelector('[data-act="edit"]').addEventListener('click', ()=> openEditor(c.id));
      card.querySelector('[data-act="dup"]').addEventListener('click', ()=> duplicateCalc(c.id));
      card.querySelector('[data-act="del"]').addEventListener('click', ()=> deleteCalc(c.id));
      calcList.appendChild(card);
    });
  }

  function duplicateCalc(id){
    const c = calcs.find(x=> x.id === id);
    if(!c) return;
    const copy = JSON.parse(JSON.stringify(c));
    copy.id = uid();
    copy.date = todayISO();
    calcs.push(copy);
    saveCalcs(); renderList();
  }
  function deleteCalc(id){
    if(!confirm('Delete this calculation? This cannot be undone.')) return;
    calcs = calcs.filter(x=> x.id !== id);
    saveCalcs(); renderList();
  }

  // ---------- editor: walls, each with its own nested openings ----------
  const wallCards = document.getElementById('wallCards');

  function renderOpeningsFor(wall, container){
    container.innerHTML = '';
    if(!wall.openings.length){
      container.innerHTML = '<div class="no-openings">No doors/windows on this wall</div>';
      return;
    }
    wall.openings.forEach(o=>{
      const row = document.createElement('div');
      row.className = 'opening-row';
      row.innerHTML =
        '<div class="opening-top">' +
          '<div class="mini-field"><label>Type</label>' +
            '<select class="o-type">' +
              '<option value="door" '+(o.type==='door'?'selected':'')+'>Door</option>' +
              '<option value="window" '+(o.type==='window'?'selected':'')+'>Window</option>' +
              '<option value="other" '+(o.type==='other'?'selected':'')+'>Other</option>' +
            '</select>' +
          '</div>' +
          '<div class="mini-field"><label>Label</label><input type="text" class="o-name" value="'+escHtml(o.name)+'" placeholder="e.g. Main door"></div>' +
        '</div>' +
        '<div class="opening-dims">' +
          '<div class="mini-field"><label>Width ft</label><input type="number" class="o-dim" value="'+escHtml(o.width)+'" placeholder="0"></div>' +
          '<div class="mini-field"><label>Height ft</label><input type="number" class="o-dim" value="'+escHtml(o.height)+'" placeholder="0"></div>' +
          '<div class="mini-field"><label>Qty</label><input type="number" class="o-qty" value="'+escHtml(o.qty||1)+'" placeholder="1" min="1"></div>' +
        '</div>' +
        '<div class="opening-foot">' +
          '<span class="o-area">− '+sqft((Number(o.width)||0)*(Number(o.height)||0)*(Number(o.qty)||1))+'</span>' +
          '<button class="o-del">✕</button>' +
        '</div>';
      const refresh = ()=>{
        row.querySelector('.o-area').textContent = '− ' + sqft((Number(o.width)||0)*(Number(o.height)||0)*(Number(o.qty)||1));
        renderWallSummaryLine(wall, container.closest('.wall-card'));
        renderSummary();
      };
      row.querySelector('.o-type').addEventListener('change', e=>{ o.type = e.target.value; refresh(); });
      row.querySelector('.o-name').addEventListener('input', e=>{ o.name = e.target.value; });
      const dims = row.querySelectorAll('.o-dim');
      dims[0].addEventListener('input', e=>{ o.width = e.target.value; refresh(); });
      dims[1].addEventListener('input', e=>{ o.height = e.target.value; refresh(); });
      row.querySelector('.o-qty').addEventListener('input', e=>{ o.qty = e.target.value; refresh(); });
      row.querySelector('.o-del').addEventListener('click', ()=>{
        wall.openings = wall.openings.filter(x=> x.id !== o.id);
        renderOpeningsFor(wall, container);
        renderWallSummaryLine(wall, container.closest('.wall-card'));
        renderSummary();
      });
      container.appendChild(row);
    });
  }

  function renderWallSummaryLine(wall, cardEl){
    const line = cardEl.querySelector('.wall-net-line .val');
    if(line) line.textContent = sqft(wallNet(wall));
  }

  function renderWalls(){
    wallCards.innerHTML = '';
    walls.forEach(w=>{
      if(!Array.isArray(w.openings)) w.openings = [];
      const card = document.createElement('div');
      card.className = 'wall-card';
      card.innerHTML =
        '<div class="wall-head">' +
          '<div class="wall-head-top">' +
            '<div class="mini-field"><label>Wall name</label><input type="text" class="w-name" value="'+escHtml(w.name)+'" placeholder="e.g. North wall"></div>' +
            '<button class="w-del">✕</button>' +
          '</div>' +
          '<div class="wall-head-dims">' +
            '<div class="mini-field"><label>Width ft</label><input type="number" class="w-dim" value="'+escHtml(w.width)+'" placeholder="0"></div>' +
            '<div class="mini-field"><label>Height ft</label><input type="number" class="w-dim" value="'+escHtml(w.height)+'" placeholder="0"></div>' +
          '</div>' +
        '</div>' +
        '<div class="openings-wrap"><div class="opening-list"></div></div>' +
        '<button class="add-opening-btn">+ Add door/window to this wall</button>' +
        '<div class="wall-net-line"><span>Net area (this wall)</span><span class="val">'+sqft(wallNet(w))+'</span></div>';

      card.querySelector('.w-name').addEventListener('input', e=>{ w.name = e.target.value; });
      const dimInputs = card.querySelectorAll('.w-dim');
      dimInputs[0].addEventListener('input', e=>{ w.width = e.target.value; renderWallSummaryLine(w, card); renderSummary(); });
      dimInputs[1].addEventListener('input', e=>{ w.height = e.target.value; renderWallSummaryLine(w, card); renderSummary(); });
      card.querySelector('.w-del').addEventListener('click', ()=>{ walls = walls.filter(x=> x.id!==w.id); renderWalls(); renderSummary(); });

      const openingList = card.querySelector('.opening-list');
      renderOpeningsFor(w, openingList);

      card.querySelector('.add-opening-btn').addEventListener('click', ()=>{
        w.openings.push({ id: uid('o'), type:'door', name:'', width:'', height:'', qty:1 });
        renderOpeningsFor(w, openingList);
        renderWallSummaryLine(w, card);
        renderSummary();
      });

      wallCards.appendChild(card);
    });
  }
  document.getElementById('addWallBtn').addEventListener('click', ()=>{
    walls.push({ id: uid('w'), name:'Wall '+(walls.length+1), width:'', height:'', openings:[] });
    renderWalls();
  });

  // ---------- live summary (aggregated across all walls) ----------
  const fPlasterRate = document.getElementById('fPlasterRate');
  const fPaintRate = document.getElementById('fPaintRate');
  function renderSummary(){
    let gross=0, doorDed=0, winDed=0, otherDed=0;
    walls.forEach(w=>{
      gross += wallGross(w);
      const d = wallDeductions(w);
      doorDed += d.door; winDed += d.win; otherDed += d.other;
    });
    const net = Math.max(0, gross - doorDed - winDed - otherDed);

    document.getElementById('sumGross').textContent = sqft(gross);
    document.getElementById('sumDoor').textContent = '− ' + sqft(doorDed);
    document.getElementById('sumWindow').textContent = '− ' + sqft(winDed);
    document.getElementById('otherRow').style.display = otherDed > 0 ? 'flex' : 'none';
    document.getElementById('sumOther').textContent = '− ' + sqft(otherDed);
    document.getElementById('sumNet').textContent = sqft(net);

    const plasterCost = net * (Number(fPlasterRate.value)||0);
    const paintCost = net * (Number(fPaintRate.value)||0);
    document.getElementById('plasterCost').textContent = money(plasterCost);
    document.getElementById('paintCost').textContent = money(paintCost);
    document.getElementById('combinedTotal').textContent = money(plasterCost + paintCost);

    return { gross, doorDed, winDed, otherDed, net, plasterCost, paintCost };
  }
  fPlasterRate.addEventListener('input', renderSummary);
  fPaintRate.addEventListener('input', renderSummary);

  function openEditor(id){
    editingId = id || null;
    const c = id ? calcs.find(x=> x.id === id) : null;

    document.getElementById('fRoom').value = c ? c.room : '';
    document.getElementById('fDate').value = c ? c.date : todayISO();
    fPlasterRate.value = c ? c.plasterRate : 45;
    fPaintRate.value = c ? c.paintRate : 28;

    walls = c ? JSON.parse(JSON.stringify(c.walls)) : [{ id: uid('w'), name:'Wall 1', width:'', height:'', openings:[] }];
    walls.forEach(w=>{ if(!Array.isArray(w.openings)) w.openings = []; });
    renderWalls(); renderSummary();

    document.getElementById('deleteCalcBtn').style.display = c ? 'block' : 'none';

    listView.style.display = 'none';
    editorView.style.display = 'block';
    fabAdd.style.display = 'none';
    window.scrollTo(0,0);
  }
  function closeEditor(){
    listView.style.display = 'block';
    editorView.style.display = 'none';
    fabAdd.style.display = 'flex';
    renderList();
  }
  document.getElementById('closeEditorBtn').addEventListener('click', closeEditor);
  fabAdd.addEventListener('click', ()=> openEditor(null));

  document.getElementById('saveCalcBtn').addEventListener('click', ()=>{
    const room = document.getElementById('fRoom').value.trim();
    if(!room){ document.getElementById('fRoom').focus(); return; }
    const payload = {
      id: editingId || uid(),
      room,
      date: document.getElementById('fDate').value || todayISO(),
      walls: walls
        .filter(w=> w.name.trim() !== '' || w.width || w.height)
        .map(w=> ({ ...w, openings: (w.openings||[]).filter(o=> o.width || o.height) })),
      plasterRate: Number(fPlasterRate.value)||0,
      paintRate: Number(fPaintRate.value)||0
    };
    if(editingId){ calcs = calcs.map(c=> c.id===editingId ? payload : c); }
    else { calcs.push(payload); editingId = payload.id; }
    saveCalcs();
    closeEditor();
  });

  document.getElementById('deleteCalcBtn').addEventListener('click', ()=>{
    if(!editingId) return;
    if(!confirm('Delete this calculation? This cannot be undone.')) return;
    calcs = calcs.filter(x=> x.id !== editingId);
    saveCalcs();
    closeEditor();
  });

  // ---------- toast ----------
  let toastTimer = null;
  function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> t.classList.remove('show'), 2200);
  }

  // ---------- copy net area ----------
  document.getElementById('copyNetBtn').addEventListener('click', ()=>{
    const t = renderSummary();
    const text = Math.round(t.net*100)/100 + ' sqft';
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(()=> showToast('Copied: ' + text)).catch(()=> showToast('Could not copy — select manually.'));
    } else {
      showToast('Net area: ' + text);
    }
  });

  // ---------- send straight into Estimate Generator ----------
  document.getElementById('sendEstimateBtn').addEventListener('click', ()=>{
    const t = renderSummary();
    if(t.net <= 0){ showToast('Add wall dimensions first.'); return; }
    const room = document.getElementById('fRoom').value.trim() || 'Room';
    const cats = [
      'Plastering — ' + room + ':' + Math.round(t.plasterCost),
      'Painting — ' + room + ':' + Math.round(t.paintCost)
    ].join('|');
    window.open('estimate-generator.html?cat=' + encodeURIComponent(cats), '_blank');
  });

  document.getElementById('homeBtn').addEventListener('click', ()=>{
    window.history.back(); // change to your home screen's filename/URL
  });

  document.getElementById('fDate').value = todayISO();
  renderList();
})();