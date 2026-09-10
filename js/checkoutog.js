(function(){
  const STORAGE_KEY = 'toolCheckoutLog_v1';
  const mainView = document.getElementById('mainView');
  const histView = document.getElementById('histView');
  const toolsList = document.getElementById('toolsList');
  const emptyState = document.getElementById('emptyState');

  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function loadAll(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }catch(e){ return []; } }
  function saveAll(list){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }catch(e){} }
  function fmtDate(iso){ return iso ? new Date(iso+'T00:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'}) : '—'; }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  function render(){
    const all = loadAll();
    const active = all.filter(t=> !t.returnedAt);
    toolsList.innerHTML = '';
    emptyState.style.display = active.length ? 'none' : 'block';

    active.forEach(t=>{
      const overdue = t.dueDate && t.dueDate < todayISO();
      const card = document.createElement('div');
      card.className = 'card' + (overdue ? ' overdue' : '');
      card.innerHTML =
        '<div class="t-top">' +
          '<div class="t-name">'+escHtml(t.item)+'</div>' +
          '<div class="t-pill '+(overdue?'overdue':'out')+'">'+(overdue?'Overdue':'Checked Out')+'</div>' +
        '</div>' +
        '<div class="t-grid">' +
          '<div class="t-stat"><div class="k">Taken by</div><div class="v">'+escHtml(t.person||'—')+'</div></div>' +
          '<div class="t-stat"><div class="k">Taken out</div><div class="v">'+fmtDate(t.outDate)+'</div></div>' +
          '<div class="t-stat"><div class="k">Due back</div><div class="v">'+fmtDate(t.dueDate)+'</div></div>' +
          '<div class="t-stat"><div class="k">Notes</div><div class="v">'+escHtml(t.note||'—')+'</div></div>' +
        '</div>' +
        '<div class="t-actions"><button class="btn-return">Mark Returned</button></div>';
      card.querySelector('.btn-return').addEventListener('click', ()=>{
        const list = loadAll();
        const item = list.find(x=> x.id === t.id);
        if(item){ item.returnedAt = todayISO(); saveAll(list); render(); }
      });
      toolsList.appendChild(card);
    });
  }

  function resetForm(){
    document.getElementById('tItem').value = '';
    document.getElementById('tPerson').value = '';
    document.getElementById('tOutDate').value = todayISO();
    document.getElementById('tDueDate').value = '';
    document.getElementById('tNote').value = '';
  }

  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const addDrawer = document.getElementById('addDrawer');
  document.getElementById('addBtn').addEventListener('click', ()=>{
    resetForm();
    drawerBackdrop.classList.add('show'); addDrawer.classList.add('show');
  });
  drawerBackdrop.addEventListener('click', ()=>{
    drawerBackdrop.classList.remove('show'); addDrawer.classList.remove('show');
  });
  document.getElementById('saveToolBtn').addEventListener('click', ()=>{
    const item = document.getElementById('tItem').value.trim();
    if(!item){ alert('Enter which item is being checked out.'); return; }
    const list = loadAll();
    list.push({
      id: Date.now(),
      item,
      person: document.getElementById('tPerson').value.trim(),
      outDate: document.getElementById('tOutDate').value || todayISO(),
      dueDate: document.getElementById('tDueDate').value,
      note: document.getElementById('tNote').value.trim(),
      returnedAt: null
    });
    saveAll(list);
    drawerBackdrop.classList.remove('show'); addDrawer.classList.remove('show');
    render();
  });

  function renderHistory(){
    const all = loadAll().filter(t=> t.returnedAt).sort((a,b)=> b.returnedAt.localeCompare(a.returnedAt));
    document.getElementById('histList').innerHTML = all.map(t=>
      '<div class="card"><div class="t-top"><div class="t-name">'+escHtml(t.item)+'</div></div>' +
      '<div class="t-grid">' +
        '<div class="t-stat"><div class="k">Taken by</div><div class="v">'+escHtml(t.person||'—')+'</div></div>' +
        '<div class="t-stat"><div class="k">Returned</div><div class="v">'+fmtDate(t.returnedAt)+'</div></div>' +
      '</div></div>'
    ).join('') || '<div class="empty-state">No returned items logged yet.</div>';
  }
  document.getElementById('openHistBtn').addEventListener('click', ()=>{
    mainView.style.display = 'none'; document.querySelector('.cta-bar').style.display = 'none';
    renderHistory(); histView.style.display = 'block';
  });
  document.getElementById('closeHistBtn').addEventListener('click', ()=>{
    histView.style.display = 'none'; mainView.style.display = 'block'; document.querySelector('.cta-bar').style.display = 'flex';
  });

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  render();
})();