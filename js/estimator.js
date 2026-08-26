(function(){
  const STORAGE_KEY = 'estimateGenerator_v1';
  const BIZ_KEY = 'estimateGeneratorBiz_v1';

  const DEFAULT_CATEGORIES = ['Civil work', 'Electrical', 'Plumbing', 'Painting', 'Transport'];

  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function formatDay(iso){
    if(!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  }
  function money(n){ return '₹' + Math.round(Number(n)||0).toLocaleString('en-IN'); }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function uid(p){ return (p||'e') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }

  let estimates = [];
  function loadEstimates(){
    try{ const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)); if(Array.isArray(raw)) estimates = raw; }catch(e){}
    estimates.forEach(e=>{ if(!Array.isArray(e.shared)) e.shared = []; });
  }
  function saveEstimates(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(estimates)); }
  loadEstimates();

  let biz = { name:'', phone:'', address:'' };
  function loadBiz(){ try{ const raw = JSON.parse(localStorage.getItem(BIZ_KEY)); if(raw && typeof raw === 'object') biz = Object.assign(biz, raw); }catch(e){} }
  function saveBiz(){ localStorage.setItem(BIZ_KEY, JSON.stringify(biz)); }
  loadBiz();

  let searchTerm = '';
  let editingId = null;
  let categories = [];

  const listView = document.getElementById('listView');
  const editorView = document.getElementById('editorView');
  const estList = document.getElementById('estList');
  const fabAdd = document.getElementById('fabAdd');

  document.getElementById('searchInput').addEventListener('input', (e)=>{
    searchTerm = e.target.value.trim().toLowerCase();
    renderList();
  });

  function calcTotals(cats, waste, profit){
    const subtotal = cats.reduce((s,c)=> s + (Number(c.amount)||0), 0);
    const wasteAmt = subtotal * ((Number(waste)||0)/100);
    const profitAmt = subtotal * ((Number(profit)||0)/100);
    return { subtotal, wasteAmt, profitAmt, total: subtotal + wasteAmt + profitAmt };
  }

  function renderList(){
    const filtered = estimates.filter(e => !searchTerm || e.project.toLowerCase().includes(searchTerm));
    estList.innerHTML = '';
    if(filtered.length === 0){
      estList.innerHTML = '<div class="empty-note">'+(estimates.length ? 'No estimates match your search.' : 'No estimates yet — tap + to create your first one.')+'</div>';
      return;
    }
    filtered.slice().sort((a,b)=> (b.date||'').localeCompare(a.date||'')).forEach(e=>{
      const t = calcTotals(e.categories, e.waste, e.profit);
      const card = document.createElement('div');
      card.className = 'est-card';
      card.innerHTML =
        '<div class="ec-top">' +
          '<div>' +
            '<div class="ec-name">'+escHtml(e.project || 'Untitled project')+'</div>' +
            '<div class="ec-meta">'+(e.client? escHtml(e.client)+' · ':'')+formatDay(e.date)+'</div>' +
          '</div>' +
          '<div style="display:flex; align-items:flex-start; gap:8px;">' +
            '<div class="ec-total">'+money(t.total)+'</div>' +
            '<button class="share-btn" data-act="share" title="Share">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-3.8M8.6 13.5l6.8 3.8"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="ec-actions">' +
          '<button data-act="edit">Edit</button>' +
          '<button data-act="dup">Duplicate</button>' +
          '<button data-act="print">Print</button>' +
          '<button data-act="del" class="danger">Delete</button>' +
        '</div>';
      card.querySelector('[data-act="edit"]').addEventListener('click', ()=> openEditor(e.id));
      card.querySelector('[data-act="dup"]').addEventListener('click', ()=> duplicateEstimate(e.id));
      card.querySelector('[data-act="print"]').addEventListener('click', ()=>{ openEditor(e.id); setTimeout(triggerPrint, 150); });
      card.querySelector('[data-act="del"]').addEventListener('click', ()=> deleteEstimate(e.id));
      card.querySelector('[data-act="share"]').addEventListener('click', ()=> openShareModal(e.id));
      estList.appendChild(card);
    });
  }

  function duplicateEstimate(id){
    const e = estimates.find(x=> x.id === id);
    if(!e) return;
    const copy = JSON.parse(JSON.stringify(e));
    copy.id = uid();
    copy.date = todayISO();
    estimates.push(copy);
    saveEstimates(); renderList();
  }

  function deleteEstimate(id){
    if(!confirm('Delete this estimate? This cannot be undone.')) return;
    estimates = estimates.filter(x=> x.id !== id);
    saveEstimates(); renderList();
  }

  // ---------- editor ----------
  const catRows = document.getElementById('catRows');
  function renderCategories(){
    catRows.innerHTML = '';
    categories.forEach(c=>{
      const row = document.createElement('div');
      row.className = 'cat-row';
      row.innerHTML =
        '<input type="text" class="cat-name" value="'+escHtml(c.name)+'" placeholder="Category name">' +
        '<div class="amt-wrap"><span>₹</span><input type="number" class="cat-amt" value="'+escHtml(c.amount)+'" placeholder="0"></div>' +
        '<button class="cat-del">✕</button>';
      row.querySelector('.cat-name').addEventListener('input', (ev)=>{ c.name = ev.target.value; });
      row.querySelector('.cat-amt').addEventListener('input', (ev)=>{ c.amount = ev.target.value; renderTotals(); });
      row.querySelector('.cat-del').addEventListener('click', ()=>{
        categories = categories.filter(x=> x.id !== c.id);
        renderCategories(); renderTotals();
      });
      catRows.appendChild(row);
    });
  }
  document.getElementById('addCatBtn').addEventListener('click', ()=>{
    categories.push({ id: uid('c'), name:'', amount:'' });
    renderCategories();
  });

  const fWaste = document.getElementById('fWaste');
  const fProfit = document.getElementById('fProfit');
  function renderTotals(){
    const t = calcTotals(categories, fWaste.value, fProfit.value);
    document.getElementById('sumSubtotal').textContent = money(t.subtotal);
    document.getElementById('sumWaste').textContent = money(t.wasteAmt);
    document.getElementById('sumProfit').textContent = money(t.profitAmt);
    document.getElementById('sumGrand').textContent = money(t.total);
  }
  fWaste.addEventListener('input', renderTotals);
  fProfit.addEventListener('input', renderTotals);

  function openEditor(id){
    editingId = id || null;
    const e = id ? estimates.find(x=> x.id === id) : null;

    document.getElementById('fProject').value = e ? e.project : '';
    document.getElementById('fClient').value = e ? (e.client||'') : '';
    document.getElementById('fDate').value = e ? e.date : todayISO();
    fWaste.value = e ? e.waste : 5;
    fProfit.value = e ? e.profit : 10;

    categories = e ? JSON.parse(JSON.stringify(e.categories)) : DEFAULT_CATEGORIES.map(name=> ({ id: uid('c'), name, amount:'' }));
    renderCategories();
    renderTotals();

    document.getElementById('deleteEstBtn').style.display = e ? 'block' : 'none';

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

  document.getElementById('saveEstBtn').addEventListener('click', ()=>{
    const project = document.getElementById('fProject').value.trim();
    if(!project){ document.getElementById('fProject').focus(); return; }

    const existing = editingId ? estimates.find(x=> x.id === editingId) : null;
    const payload = {
      id: editingId || uid(),
      project,
      client: document.getElementById('fClient').value.trim(),
      date: document.getElementById('fDate').value || todayISO(),
      categories: categories.filter(c=> c.name.trim() !== ''),
      waste: Number(fWaste.value) || 0,
      profit: Number(fProfit.value) || 0,
      shared: existing && Array.isArray(existing.shared) ? existing.shared : []
    };

    if(editingId){
      estimates = estimates.map(e=> e.id === editingId ? payload : e);
    } else {
      estimates.push(payload);
      editingId = payload.id;
    }
    saveEstimates();
    closeEditor();
  });

  document.getElementById('deleteEstBtn').addEventListener('click', ()=>{
    if(!editingId) return;
    if(!confirm('Delete this estimate? This cannot be undone.')) return;
    estimates = estimates.filter(x=> x.id !== editingId);
    saveEstimates();
    closeEditor();
  });

  // ---------- print: plain ledger-style layout, right-aligned like a receipt ----------
  function padLine(label, amountStr, width){
    const dots = width - label.length - amountStr.length;
    return escHtml(label) + '&nbsp;'.repeat(Math.max(dots,1)) + escHtml(amountStr);
  }

  function triggerPrint(){
    const project = document.getElementById('fProject').value.trim() || 'Untitled project';
    const client = document.getElementById('fClient').value.trim();
    const date = document.getElementById('fDate').value;
    const t = calcTotals(categories, fWaste.value, fProfit.value);
    const validCats = categories.filter(c=> c.name.trim() !== '');
    const LINE_WIDTH = 34;

    let body = '';
    validCats.forEach(c=>{
      body += padLine(c.name, money(c.amount||0), LINE_WIDTH) + '\n';
    });
    body += '-'.repeat(LINE_WIDTH) + '\n';
    body += padLine('Subtotal', money(t.subtotal), LINE_WIDTH) + '\n';
    body += padLine('Waste (' + (Number(fWaste.value)||0) + '%)', money(t.wasteAmt), LINE_WIDTH) + '\n';
    body += padLine('Profit (' + (Number(fProfit.value)||0) + '%)', money(t.profitAmt), LINE_WIDTH) + '\n';
    body += '-'.repeat(LINE_WIDTH) + '\n';
    body += padLine('TOTAL', money(t.total), LINE_WIDTH);

    const html =
      '<div style="max-width:480px;margin:0 auto;font-family:\'Courier New\',monospace;font-size:14px;color:#111;">' +
        '<div style="text-align:center;margin-bottom:18px;">' +
          (biz.name ? '<div style="font-weight:bold;font-size:16px;">'+escHtml(biz.name)+'</div>' : '') +
          (biz.address ? '<div style="font-size:11.5px;color:#555;">'+escHtml(biz.address)+'</div>' : '') +
          (biz.phone ? '<div style="font-size:11.5px;color:#555;">Ph: '+escHtml(biz.phone)+'</div>' : '') +
        '</div>' +
        '<div style="text-align:center;font-weight:bold;letter-spacing:1.5px;font-size:15px;border-top:2px solid #111;border-bottom:2px solid #111;padding:8px 0;margin-bottom:10px;">PROJECT ESTIMATE</div>' +
        '<div style="font-size:12.5px;margin-bottom:14px;">' +
          '<div><strong>Project:</strong> '+escHtml(project)+'</div>' +
          (client ? '<div><strong>Client:</strong> '+escHtml(client)+'</div>' : '') +
          '<div><strong>Date:</strong> '+formatDay(date)+'</div>' +
        '</div>' +
        '<pre style="white-space:pre-wrap;line-height:1.9;font-size:13.5px;">'+body+'</pre>' +
        '<div style="margin-top:34px;font-size:11.5px;color:#555;text-align:center;">This is a preliminary estimate. Final billing may vary based on site conditions and material rates.</div>' +
      '</div>';

    document.getElementById('printArea').innerHTML = html;
    window.print();
  }
  document.getElementById('printBtn').addEventListener('click', triggerPrint);

  // ---------- single-category estimate ----------
  const catEstBackdrop = document.getElementById('catEstBackdrop');
  const catEstDrawer = document.getElementById('catEstDrawer');
  const catEstSelect = document.getElementById('catEstSelect');

  function renderCatEstTotals(){
    const c = categories.find(x=> x.id === catEstSelect.value);
    const amount = c ? (Number(c.amount)||0) : 0;
    const waste = Number(fWaste.value)||0;
    const profit = Number(fProfit.value)||0;
    const wasteAmt = amount * (waste/100);
    const profitAmt = amount * (profit/100);
    document.getElementById('catWasteLabel').textContent = waste;
    document.getElementById('catProfitLabel').textContent = profit;
    document.getElementById('catSumSubtotal').textContent = money(amount);
    document.getElementById('catSumWaste').textContent = money(wasteAmt);
    document.getElementById('catSumProfit').textContent = money(profitAmt);
    document.getElementById('catSumGrand').textContent = money(amount + wasteAmt + profitAmt);
  }

  document.getElementById('singleCatBtn').addEventListener('click', ()=>{
    const named = categories.filter(c=> c.name.trim() !== '');
    if(named.length === 0){ alert('Add at least one category with a name first.'); return; }
    catEstSelect.innerHTML = named.map(c=> '<option value="'+c.id+'">'+escHtml(c.name)+'</option>').join('');
    renderCatEstTotals();
    catEstBackdrop.classList.add('show'); catEstDrawer.classList.add('show');
  });
  catEstSelect.addEventListener('change', renderCatEstTotals);
  catEstBackdrop.addEventListener('click', ()=>{ catEstBackdrop.classList.remove('show'); catEstDrawer.classList.remove('show'); });

  function triggerCategoryPrint(){
    const c = categories.find(x=> x.id === catEstSelect.value);
    if(!c) return;
    const project = document.getElementById('fProject').value.trim() || 'Untitled project';
    const client = document.getElementById('fClient').value.trim();
    const date = document.getElementById('fDate').value;
    const waste = Number(fWaste.value)||0;
    const profit = Number(fProfit.value)||0;
    const amount = Number(c.amount)||0;
    const wasteAmt = amount * (waste/100);
    const profitAmt = amount * (profit/100);
    const total = amount + wasteAmt + profitAmt;
    const LINE_WIDTH = 34;

    let body = '';
    body += padLine(c.name, money(amount), LINE_WIDTH) + '\n';
    body += '-'.repeat(LINE_WIDTH) + '\n';
    body += padLine('Subtotal', money(amount), LINE_WIDTH) + '\n';
    body += padLine('Waste (' + waste + '%)', money(wasteAmt), LINE_WIDTH) + '\n';
    body += padLine('Profit (' + profit + '%)', money(profitAmt), LINE_WIDTH) + '\n';
    body += '-'.repeat(LINE_WIDTH) + '\n';
    body += padLine('TOTAL', money(total), LINE_WIDTH);

    const html =
      '<div style="max-width:480px;margin:0 auto;font-family:\'Courier New\',monospace;font-size:14px;color:#111;">' +
        '<div style="text-align:center;margin-bottom:18px;">' +
          (biz.name ? '<div style="font-weight:bold;font-size:16px;">'+escHtml(biz.name)+'</div>' : '') +
          (biz.address ? '<div style="font-size:11.5px;color:#555;">'+escHtml(biz.address)+'</div>' : '') +
          (biz.phone ? '<div style="font-size:11.5px;color:#555;">Ph: '+escHtml(biz.phone)+'</div>' : '') +
        '</div>' +
        '<div style="text-align:center;font-weight:bold;letter-spacing:1.2px;font-size:15px;border-top:2px solid #111;border-bottom:2px solid #111;padding:8px 0;margin-bottom:10px;">CATEGORY ESTIMATE — '+escHtml(c.name.toUpperCase())+'</div>' +
        '<div style="font-size:12.5px;margin-bottom:14px;">' +
          '<div><strong>Project:</strong> '+escHtml(project)+'</div>' +
          (client ? '<div><strong>Client:</strong> '+escHtml(client)+'</div>' : '') +
          '<div><strong>Date:</strong> '+formatDay(date)+'</div>' +
        '</div>' +
        '<pre style="white-space:pre-wrap;line-height:1.9;font-size:13.5px;">'+body+'</pre>' +
        '<div style="margin-top:34px;font-size:11.5px;color:#555;text-align:center;">This is a preliminary estimate for '+escHtml(c.name)+' only. Final billing may vary based on site conditions and material rates.</div>' +
      '</div>';

    document.getElementById('printArea').innerHTML = html;
    window.print();
  }
  document.getElementById('catEstPrintBtn').addEventListener('click', triggerCategoryPrint);

  // ---------- share ----------
  const shareBackdrop = document.getElementById('shareBackdrop');
  const shareDrawer = document.getElementById('shareDrawer');
  const sharedList = document.getElementById('sharedList');
  let shareEstId = null;

  function renderSharedList(){
    const e = estimates.find(x=> x.id === shareEstId);
    const shares = (e && Array.isArray(e.shared)) ? e.shared : [];
    sharedList.innerHTML = shares.length ? shares.map((s,i)=>
      '<div class="shared-row"><span class="num">'+escHtml(s.phone)+'</span><span class="del" data-i="'+i+'"> ✕</span></div>'
    ).join('') : '<div class="shared-empty">Not shared with anyone yet</div>';
    sharedList.querySelectorAll('.del').forEach(el=>{
      el.addEventListener('click', ()=>{
        const est = estimates.find(x=> x.id === shareEstId);
        if(!est) return;
        est.shared.splice(Number(el.dataset.i), 1);
        saveEstimates(); renderSharedList(); renderList();
      });
    });
  }

  function openShareModal(id){
    shareEstId = id;
    document.getElementById('sharePhone').value = '';
    renderSharedList();
    shareBackdrop.classList.add('show'); shareDrawer.classList.add('show');
  }
  shareBackdrop.addEventListener('click', ()=>{ shareBackdrop.classList.remove('show'); shareDrawer.classList.remove('show'); });

  document.getElementById('shareSendBtn').addEventListener('click', ()=>{
    const phoneRaw = document.getElementById('sharePhone').value.trim();
    const digits = phoneRaw.replace(/\D/g,'');
    if(digits.length < 8){ document.getElementById('sharePhone').focus(); return; }

    const e = estimates.find(x=> x.id === shareEstId);
    if(!e) return;
    const t = calcTotals(e.categories, e.waste, e.profit);
    const msg = 'Estimate for '+ (e.project||'your project') +'\nTotal: '+ money(t.total) +
      (biz.name ? '\n— '+biz.name : '');
    const waNumber = digits.length === 10 ? '91'+digits : digits; // default to India country code for 10-digit numbers
   // window.open('https://wa.me/'+waNumber+'?text='+encodeURIComponent(msg), '_blank');

    e.shared = Array.isArray(e.shared) ? e.shared : [];
    e.shared.push({ phone: phoneRaw, date: todayISO() });
    saveEstimates();
    document.getElementById('sharePhone').value = '';
    renderSharedList();
    renderList();
  });

  document.getElementById('homeBtn').addEventListener('click', ()=>{
    window.history.back(); // change to your home screen's filename/URL
  });

  // ---------- business settings drawer ----------
  const settingsBackdrop = document.getElementById('settingsBackdrop');
  const settingsDrawer = document.getElementById('settingsDrawer');
  document.getElementById('settingsBtn').addEventListener('click', ()=>{
    document.getElementById('bizName').value = biz.name;
    document.getElementById('bizPhone').value = biz.phone;
    document.getElementById('bizAddress').value = biz.address;
    settingsBackdrop.classList.add('show'); settingsDrawer.classList.add('show');
  });
  settingsBackdrop.addEventListener('click', ()=>{ settingsBackdrop.classList.remove('show'); settingsDrawer.classList.remove('show'); });
  document.getElementById('saveBizBtn').addEventListener('click', ()=>{
    biz = {
      name: document.getElementById('bizName').value.trim(),
      phone: document.getElementById('bizPhone').value.trim(),
      address: document.getElementById('bizAddress').value.trim()
    };
    saveBiz();
    settingsBackdrop.classList.remove('show'); settingsDrawer.classList.remove('show');
  });

  document.getElementById('fDate').value = todayISO();
  renderList();
})();