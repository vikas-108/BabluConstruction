(function(){
  const LS_SHIFT = 'guardCurrentShift';
  const LS_HISTORY = 'guardHistory';
  const LS_CHECKPOINTS = 'guardCheckpoints';

  function loadJSON(key, fallback){ try{ const v = JSON.parse(localStorage.getItem(key)); return v===null||v===undefined ? fallback : v; }catch(e){ return fallback; } }
  function saveJSON(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }

  let currentShift = loadJSON(LS_SHIFT, null);
  let history = loadJSON(LS_HISTORY, []);
  let checkpoints = loadJSON(LS_CHECKPOINTS, [
    { name:'Main Gate', checked:false, time:null },
    { name:'Store Room', checked:false, time:null },
    { name:'Perimeter Fence', checked:false, time:null },
    { name:'Generator Yard', checked:false, time:null }
  ]);

  function fmtTime(iso){ return iso ? new Date(iso).toLocaleString(undefined,{ month:'short', day:'numeric', hour:'numeric', minute:'2-digit' }) : '—'; }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  // ---- Tabs ----
  document.querySelectorAll('.tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(t=> t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('shiftTab').style.display = tab.dataset.tab==='shift' ? 'block':'none';
      document.getElementById('patrolTab').style.display = tab.dataset.tab==='patrol' ? 'block':'none';
      document.getElementById('historyTab').style.display = tab.dataset.tab==='history' ? 'block':'none';
      if(tab.dataset.tab==='history') renderHistory();
    });
  });

  // ---- Shift ----
  function renderShift(){
    const card = document.getElementById('shiftCard');
    if(currentShift){
      card.innerHTML =
        '<div class="shift-active-box"><div class="name">'+escHtml(currentShift.guard)+'</div><div class="time">On duty since '+fmtTime(currentShift.start)+'</div></div>'+
        '<div class="field"><label>Notes</label><textarea id="shiftNotes" rows="3" placeholder="Anything to note during this shift">'+escHtml(currentShift.notes||'')+'</textarea></div>'+
        '<button class="gbtn end" id="endShiftBtn">End Shift</button>';
      document.getElementById('shiftNotes').addEventListener('input', e=>{
        currentShift.notes = e.target.value;
        saveJSON(LS_SHIFT, currentShift);
      });
      document.getElementById('endShiftBtn').addEventListener('click', ()=>{
        if(!confirm('End this shift?')) return;
        history.unshift({ type:'shift', guard: currentShift.guard, start: currentShift.start, end: new Date().toISOString(), notes: currentShift.notes||'' });
        saveJSON(LS_HISTORY, history);
        currentShift = null;
        saveJSON(LS_SHIFT, null);
        renderShift();
      });
    } else {
      card.innerHTML =
        '<div class="field"><label>Guard name</label><input type="text" id="guardName" placeholder="Who\'s starting this shift?"></div>'+
        '<button class="gbtn start" id="startShiftBtn">Start Shift</button>';
      document.getElementById('startShiftBtn').addEventListener('click', ()=>{
        const name = document.getElementById('guardName').value.trim();
        if(!name){ alert('Enter the guard\'s name.'); return; }
        currentShift = { guard: name, start: new Date().toISOString(), notes:'' };
        saveJSON(LS_SHIFT, currentShift);
        renderShift();
      });
    }
  }

  // ---- Patrol ----
  function renderCheckpoints(){
    const list = document.getElementById('checkpointsList');
    list.innerHTML = '';
    let checked = 0;
    checkpoints.forEach((cp, i)=>{
      if(cp.checked) checked++;
      const row = document.createElement('div');
      row.className = 'checkpoint-row' + (cp.checked ? ' checked' : '');
      row.innerHTML = '<div class="cp-box">'+(cp.checked?'✓':'')+'</div><div class="cp-name">'+escHtml(cp.name)+'</div><div class="cp-time">'+(cp.time ? new Date(cp.time).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'}) : '')+'</div>';
      row.addEventListener('click', ()=>{
        cp.checked = !cp.checked;
        cp.time = cp.checked ? new Date().toISOString() : null;
        saveJSON(LS_CHECKPOINTS, checkpoints);
        renderCheckpoints();
      });
      list.appendChild(row);
    });
    document.getElementById('roundProgress').textContent = checked + ' / ' + checkpoints.length + ' checked';
  }
  document.getElementById('addCpBtn').addEventListener('click', ()=>{
    const input = document.getElementById('newCpName');
    const name = input.value.trim();
    if(!name) return;
    checkpoints.push({ name, checked:false, time:null });
    saveJSON(LS_CHECKPOINTS, checkpoints);
    input.value = '';
    renderCheckpoints();
  });
  document.getElementById('completeRoundBtn').addEventListener('click', ()=>{
    const checkedCount = checkpoints.filter(c=>c.checked).length;
    if(checkedCount === 0){ alert('Check at least one checkpoint before completing the round.'); return; }
    history.unshift({
      type:'patrol',
      guard: currentShift ? currentShift.guard : 'Unassigned',
      time: new Date().toISOString(),
      checked: checkedCount,
      total: checkpoints.length,
      checkpoints: checkpoints.map(c=> ({ name:c.name, checked:c.checked, time:c.time }))
    });
    saveJSON(LS_HISTORY, history);
    checkpoints.forEach(c=>{ c.checked = false; c.time = null; });
    saveJSON(LS_CHECKPOINTS, checkpoints);
    renderCheckpoints();
    alert('Patrol round saved.');
  });

  // ---- History ----
  function renderHistory(){
    const list = document.getElementById('historyList');
    const empty = document.getElementById('historyEmpty');
    list.innerHTML = '';
    empty.style.display = history.length ? 'none' : 'block';
    history.forEach(h=>{
      const item = document.createElement('div');
      item.className = 'hist-item';
      if(h.type === 'shift'){
        item.innerHTML = '<div class="h-title">Shift — '+escHtml(h.guard)+'</div><div class="h-meta">'+fmtTime(h.start)+' → '+fmtTime(h.end)+(h.notes?'<br>"'+escHtml(h.notes)+'"':'')+'</div>';
      } else {
        item.innerHTML = '<div class="h-title">Patrol Round — '+escHtml(h.guard)+'</div><div class="h-meta">'+fmtTime(h.time)+' · '+h.checked+'/'+h.total+' checkpoints</div>';
      }
      list.appendChild(item);
    });
  }

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  renderShift();
  renderCheckpoints();
})();