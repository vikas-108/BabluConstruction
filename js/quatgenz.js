(function(){
  const STORAGE_KEY = 'quotationGenerator_v1';
  const BIZ_KEY = 'quotationGeneratorBiz_v1';

  const TEMPLATES = {
    'Civil Work': [
      { desc:'Excavation for foundation', unit:'cum' },
      { desc:'PCC (1:4:8) below footing', unit:'cum' },
      { desc:'RCC footing & column (M20)', unit:'cum' },
      { desc:'Brickwork in superstructure', unit:'cum' },
      { desc:'Plastering (internal + external)', unit:'sqft' },
      { desc:'Curing & labour charges', unit:'lump sum' }
    ],
    'Painting': [
      { desc:'Wall putty (2 coats)', unit:'sqft' },
      { desc:'Primer coat', unit:'sqft' },
      { desc:'Emulsion paint (2 coats)', unit:'sqft' },
      { desc:'Enamel paint — doors & windows', unit:'sqft' },
      { desc:'Texture / design painting', unit:'sqft' }
    ],
    'Plumbing': [
      { desc:'CPVC water supply piping', unit:'running ft' },
      { desc:'PVC drainage piping', unit:'running ft' },
      { desc:'Bathroom fittings installation', unit:'point' },
      { desc:'Overhead tank connection', unit:'lump sum' },
      { desc:'Tap & valve fitting', unit:'point' }
    ],
    'Electrical': [
      { desc:'Concealed wiring — light point', unit:'point' },
      { desc:'Concealed wiring — plug point', unit:'point' },
      { desc:'Fan point wiring', unit:'point' },
      { desc:'MCB distribution board', unit:'unit' },
      { desc:'Switch board & modular switches', unit:'point' }
    ],
    'Tile Work': [
      { desc:'Floor tiling', unit:'sqft' },
      { desc:'Wall tiling (kitchen/bath)', unit:'sqft' },
      { desc:'Skirting', unit:'running ft' },
      { desc:'Tile adhesive & grouting', unit:'sqft' }
    ],
    'Renovation': [
      { desc:'Demolition of existing structure', unit:'sqft' },
      { desc:'Debris removal & disposal', unit:'lump sum' },
      { desc:'Re-plastering', unit:'sqft' },
      { desc:'Re-painting', unit:'sqft' },
      { desc:'Electrical rewiring', unit:'point' },
      { desc:'Plumbing repair', unit:'lump sum' }
    ],
    'Complete House': [
      { desc:'Foundation & structure', unit:'sqft' },
      { desc:'Brickwork', unit:'sqft' },
      { desc:'Plastering', unit:'sqft' },
      { desc:'Electrical wiring (complete)', unit:'sqft' },
      { desc:'Plumbing (complete)', unit:'sqft' },
      { desc:'Flooring & tiling', unit:'sqft' },
      { desc:'Painting (complete)', unit:'sqft' },
      { desc:'Doors & windows', unit:'unit' },
      { desc:'Finishing & handover', unit:'lump sum' }
    ]
  };
  const DEFAULT_NOTES =
    '1. Rates mentioned are exclusive of GST unless stated otherwise.\n' +
    '2. 40% advance before work starts, balance on completion.\n' +
    '3. Quotation valid for 15 days from the date above.\n' +
    '4. Any change in scope of work will be charged extra.';

  function todayISO(){ return new Date().toISOString().slice(0,10); }
  function formatDay(iso){
    if(!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  }
  function money(n){ return '₹' + Math.round(Number(n)||0).toLocaleString('en-IN'); }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function uid(p){ return (p||'q') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }

  let quotes = [];
  function loadQuotes(){
    try{ const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)); if(Array.isArray(raw)) quotes = raw; }catch(e){}
    quotes.forEach(q=>{ if(!Array.isArray(q.shared)) q.shared = []; });
  }
  function saveQuotes(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes)); }
  loadQuotes();

  let biz = { name:'', phone:'', address:'', gst:'' };
  function loadBiz(){ try{ const raw = JSON.parse(localStorage.getItem(BIZ_KEY)); if(raw && typeof raw === 'object') biz = Object.assign(biz, raw); }catch(e){} }
  function saveBiz(){ localStorage.setItem(BIZ_KEY, JSON.stringify(biz)); }
  loadBiz();

  let searchTerm = '';
  let editingId = null; // null = new quotation
  let activeTemplate = null;
  let items = [];

  const listView = document.getElementById('listView');
  const editorView = document.getElementById('editorView');
  const quoteList = document.getElementById('quoteList');
  const fabAdd = document.getElementById('fabAdd');

  // ---------- list view ----------
  document.getElementById('searchInput').addEventListener('input', (e)=>{
    searchTerm = e.target.value.trim().toLowerCase();
    renderList();
  });

  function grandTotalOf(q){
    const subtotal = q.items.reduce((s,it)=> s + (Number(it.qty)||0) * (Number(it.rate)||0), 0);
    const afterDiscount = subtotal - subtotal * ((Number(q.discount)||0)/100);
    return afterDiscount + afterDiscount * ((Number(q.tax)||0)/100);
  }

  function renderList(){
    const filtered = quotes.filter(q => !searchTerm || q.client.toLowerCase().includes(searchTerm));
    quoteList.innerHTML = '';
    if(filtered.length === 0){
      quoteList.innerHTML = '<div class="empty-note">'+(quotes.length ? 'No quotations match your search.' : 'No quotations yet — tap + to create your first one.')+'</div>';
      return;
    }
    filtered.slice().sort((a,b)=> (b.date||'').localeCompare(a.date||'')).forEach(q=>{
      const card = document.createElement('div');
      card.className = 'quote-card';
      card.innerHTML =
        '<div class="qc-top">' +
          '<div>' +
            '<div class="qc-client">'+escHtml(q.client || 'Untitled client')+'</div>' +
            '<div class="qc-meta">'+escHtml(q.quoteNo||'')+' · '+formatDay(q.date)+'</div>' +
            '<div class="qc-tpl">'+escHtml(q.template || 'Custom')+'</div>' +
          '</div>' +
          '<div style="display:flex; align-items:flex-start; gap:8px;">' +
            '<div class="qc-total">'+money(grandTotalOf(q))+'</div>' +
            '<button class="share-btn" data-act="share" title="Share">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-3.8M8.6 13.5l6.8 3.8"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="qc-actions">' +
          '<button data-act="edit">Edit</button>' +
          '<button data-act="dup">Duplicate</button>' +
          '<button data-act="print">Print</button>' +
          '<button data-act="del" class="danger">Delete</button>' +
        '</div>';
      card.querySelector('[data-act="edit"]').addEventListener('click', ()=> openEditor(q.id));
      card.querySelector('[data-act="dup"]').addEventListener('click', ()=> duplicateQuote(q.id));
      card.querySelector('[data-act="print"]').addEventListener('click', ()=>{ openEditor(q.id); setTimeout(triggerPrint, 150); });
      card.querySelector('[data-act="del"]').addEventListener('click', ()=> deleteQuote(q.id));
      card.querySelector('[data-act="share"]').addEventListener('click', ()=> openShareModal(q.id));
      quoteList.appendChild(card);
    });
  }

  function duplicateQuote(id){
    const q = quotes.find(x=> x.id === id);
    if(!q) return;
    const copy = JSON.parse(JSON.stringify(q));
    copy.id = uid();
    copy.quoteNo = nextQuoteNo();
    copy.date = todayISO();
    quotes.push(copy);
    saveQuotes(); renderList();
  }

  function deleteQuote(id){
    if(!confirm('Delete this quotation? This cannot be undone.')) return;
    quotes = quotes.filter(x=> x.id !== id);
    saveQuotes(); renderList();
  }

  function nextQuoteNo(){
    const n = quotes.length + 1;
    return 'Q-' + String(n).padStart(4,'0');
  }

  // ---------- editor view ----------
  const tplGrid = document.getElementById('tplGrid');
  Object.keys(TEMPLATES).forEach(name=>{
    const chip = document.createElement('div');
    chip.className = 'tpl-chip';
    chip.textContent = name;
    chip.addEventListener('click', ()=> applyTemplate(name));
    chip.dataset.tpl = name;
    tplGrid.appendChild(chip);
  });

  function applyTemplate(name){
    activeTemplate = name;
    document.querySelectorAll('.tpl-chip').forEach(c=> c.classList.toggle('active', c.dataset.tpl === name));
    items = TEMPLATES[name].map(it=> ({ id: uid('it'), desc: it.desc, unit: it.unit, qty:'', rate:'' }));
    renderItems();
  }

  const itemRows = document.getElementById('itemRows');
  function renderItems(){
    itemRows.innerHTML = '';
    items.forEach(it=>{
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML =
        '<div class="item-desc"><input type="text" value="'+escHtml(it.desc)+'" placeholder="Item description" data-f="desc"></div>' +
        '<div class="item-unit"><input type="text" value="'+escHtml(it.unit)+'" placeholder="unit" data-f="unit"></div>' +
        '<div class="item-qty"><input type="number" value="'+escHtml(it.qty)+'" placeholder="0" data-f="qty"></div>' +
        '<div class="item-rate"><input type="number" value="'+escHtml(it.rate)+'" placeholder="0" data-f="rate"></div>' +
        '<div class="item-amt">'+money((Number(it.qty)||0)*(Number(it.rate)||0))+'</div>' +
        '<button class="item-del" data-del="1">✕</button>';
      row.querySelectorAll('input').forEach(inp=>{
        inp.addEventListener('input', ()=>{
          it[inp.dataset.f] = inp.value;
          if(inp.dataset.f === 'qty' || inp.dataset.f === 'rate'){
            row.querySelector('.item-amt').textContent = money((Number(it.qty)||0)*(Number(it.rate)||0));
          }
          renderTotals();
        });
      });
      row.querySelector('[data-del]').addEventListener('click', ()=>{
        items = items.filter(x=> x.id !== it.id);
        renderItems(); renderTotals();
      });
      itemRows.appendChild(row);
    });
  }
  document.getElementById('addItemBtn').addEventListener('click', ()=>{
    items.push({ id: uid('it'), desc:'', unit:'', qty:'', rate:'' });
    renderItems();
  });

  const fDiscount = document.getElementById('fDiscount');
  const fTax = document.getElementById('fTax');
  function renderTotals(){
    const subtotal = items.reduce((s,it)=> s + (Number(it.qty)||0)*(Number(it.rate)||0), 0);
    const afterDiscount = subtotal - subtotal * ((Number(fDiscount.value)||0)/100);
    const grand = afterDiscount + afterDiscount * ((Number(fTax.value)||0)/100);
    document.getElementById('sumSubtotal').textContent = money(subtotal);
    document.getElementById('sumGrand').textContent = money(grand);
  }
  fDiscount.addEventListener('input', renderTotals);
  fTax.addEventListener('input', renderTotals);

  function openEditor(id){
    editingId = id || null;
    const q = id ? quotes.find(x=> x.id === id) : null;

    document.getElementById('fClient').value = q ? q.client : '';
    document.getElementById('fPhone').value = q ? q.phone : '';
    document.getElementById('fAddress').value = q ? q.address : '';
    document.getElementById('fQuoteNo').value = q ? q.quoteNo : nextQuoteNo();
    document.getElementById('fDate').value = q ? q.date : todayISO();
    document.getElementById('fNotes').value = q ? q.notes : DEFAULT_NOTES;
    fDiscount.value = q ? (q.discount || 0) : 0;
    fTax.value = q ? (q.tax || 0) : 0;

    activeTemplate = q ? q.template : null;
    document.querySelectorAll('.tpl-chip').forEach(c=> c.classList.toggle('active', c.dataset.tpl === activeTemplate));
    items = q ? JSON.parse(JSON.stringify(q.items)) : [];
    renderItems();
    renderTotals();

    document.getElementById('deleteQuoteBtn').style.display = q ? 'block' : 'none';

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

  document.getElementById('saveQuoteBtn').addEventListener('click', ()=>{
    const client = document.getElementById('fClient').value.trim();
    if(!client){ document.getElementById('fClient').focus(); return; }

    const existing = editingId ? quotes.find(x=> x.id === editingId) : null;
    const payload = {
      id: editingId || uid(),
      client,
      phone: document.getElementById('fPhone').value.trim(),
      address: document.getElementById('fAddress').value.trim(),
      quoteNo: document.getElementById('fQuoteNo').value.trim() || nextQuoteNo(),
      date: document.getElementById('fDate').value || todayISO(),
      template: activeTemplate,
      items: items.filter(it=> it.desc.trim() !== ''),
      discount: Number(fDiscount.value) || 0,
      tax: Number(fTax.value) || 0,
      notes: document.getElementById('fNotes').value,
      shared: existing && Array.isArray(existing.shared) ? existing.shared : []
    };

    if(editingId){
      quotes = quotes.map(q=> q.id === editingId ? payload : q);
    } else {
      quotes.push(payload);
      editingId = payload.id;
    }
    saveQuotes();
    closeEditor();
  });

  document.getElementById('deleteQuoteBtn').addEventListener('click', ()=>{
    if(!editingId) return;
    if(!confirm('Delete this quotation? This cannot be undone.')) return;
    quotes = quotes.filter(x=> x.id !== editingId);
    saveQuotes();
    closeEditor();
  });

  // ---------- print ----------
  function triggerPrint(){
    const client = document.getElementById('fClient').value.trim() || 'Client';
    const phone = document.getElementById('fPhone').value.trim();
    const address = document.getElementById('fAddress').value.trim();
    const quoteNo = document.getElementById('fQuoteNo').value.trim();
    const date = document.getElementById('fDate').value;
    const notes = document.getElementById('fNotes').value;
    const subtotal = items.reduce((s,it)=> s + (Number(it.qty)||0)*(Number(it.rate)||0), 0);
    const discount = Number(fDiscount.value)||0;
    const tax = Number(fTax.value)||0;
    const afterDiscount = subtotal - subtotal*(discount/100);
    const grand = afterDiscount + afterDiscount*(tax/100);

    const rowsHtml = items.filter(it=>it.desc.trim()!=='').map((it,i)=>
      '<tr>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:center;">'+(i+1)+'</td>' +
        '<td style="padding:8px;border:1px solid #ccc;">'+escHtml(it.desc)+'</td>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:center;">'+escHtml(it.unit)+'</td>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:right;">'+escHtml(it.qty||'0')+'</td>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:right;">'+money(it.rate)+'</td>' +
        '<td style="padding:8px;border:1px solid #ccc;text-align:right;">'+money((Number(it.qty)||0)*(Number(it.rate)||0))+'</td>' +
      '</tr>'
    ).join('');

    const html =
      '<div style="display:flex;justify-content:space-between;border-bottom:3px solid #111;padding-bottom:14px;margin-bottom:18px;">' +
        '<div>' +
          '<div style="font-size:20px;font-weight:bold;">'+escHtml(biz.name || 'Your Business Name')+'</div>' +
          '<div style="font-size:12px;color:#555;margin-top:3px;">'+escHtml(biz.address||'')+'</div>' +
          '<div style="font-size:12px;color:#555;">'+(biz.phone? 'Ph: '+escHtml(biz.phone):'')+(biz.gst? ' &nbsp;·&nbsp; GSTIN: '+escHtml(biz.gst):'')+'</div>' +
        '</div>' +
        '<div style="text-align:right;">' +
          '<div style="font-size:18px;font-weight:bold;letter-spacing:1px;">QUOTATION</div>' +
          '<div style="font-size:12px;color:#555;margin-top:3px;">No: '+escHtml(quoteNo)+'</div>' +
          '<div style="font-size:12px;color:#555;">Date: '+formatDay(date)+'</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-bottom:16px;">' +
        '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#888;">Quotation for</div>' +
        '<div style="font-size:15px;font-weight:bold;margin-top:2px;">'+escHtml(client)+'</div>' +
        (phone? '<div style="font-size:12.5px;color:#444;">Ph: '+escHtml(phone)+'</div>' : '') +
        (address? '<div style="font-size:12.5px;color:#444;">'+escHtml(address)+'</div>' : '') +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
        '<thead><tr style="background:#f0f0f0;">' +
          '<th style="padding:8px;border:1px solid #ccc;">#</th>' +
          '<th style="padding:8px;border:1px solid #ccc;text-align:left;">Description</th>' +
          '<th style="padding:8px;border:1px solid #ccc;">Unit</th>' +
          '<th style="padding:8px;border:1px solid #ccc;">Qty</th>' +
          '<th style="padding:8px;border:1px solid #ccc;">Rate</th>' +
          '<th style="padding:8px;border:1px solid #ccc;">Amount</th>' +
        '</tr></thead>' +
        '<tbody>'+rowsHtml+'</tbody>' +
      '</table>' +
      '<div style="display:flex;justify-content:flex-end;margin-top:14px;">' +
        '<table style="font-size:13px;min-width:240px;">' +
          '<tr><td style="padding:4px 10px;color:#555;">Subtotal</td><td style="padding:4px 0;text-align:right;">'+money(subtotal)+'</td></tr>' +
          (discount? '<tr><td style="padding:4px 10px;color:#555;">Discount ('+discount+'%)</td><td style="padding:4px 0;text-align:right;">− '+money(subtotal*discount/100)+'</td></tr>' : '') +
          (tax? '<tr><td style="padding:4px 10px;color:#555;">GST / Tax ('+tax+'%)</td><td style="padding:4px 0;text-align:right;">+ '+money(afterDiscount*tax/100)+'</td></tr>' : '') +
          '<tr><td style="padding:8px 10px;font-weight:bold;border-top:2px solid #111;">Grand total</td><td style="padding:8px 0;text-align:right;font-weight:bold;border-top:2px solid #111;">'+money(grand)+'</td></tr>' +
        '</table>' +
      '</div>' +
      (notes? '<div style="margin-top:26px;font-size:11.5px;color:#555;white-space:pre-line;line-height:1.6;"><div style="font-weight:bold;color:#111;margin-bottom:4px;">Terms &amp; notes</div>'+escHtml(notes)+'</div>' : '') +
      '<div style="margin-top:40px;font-size:12.5px;color:#333;">Authorized signatory — '+escHtml(biz.name || 'Your Business Name')+'</div>';

    document.getElementById('printArea').innerHTML = html;
    window.print();
  }
  document.getElementById('printBtn').addEventListener('click', triggerPrint);

  // ---------- business settings drawer ----------
  const settingsBackdrop = document.getElementById('settingsBackdrop');
  const settingsDrawer = document.getElementById('settingsDrawer');
  document.getElementById('settingsBtn').addEventListener('click', ()=>{
    document.getElementById('bizName').value = biz.name;
    document.getElementById('bizPhone').value = biz.phone;
    document.getElementById('bizAddress').value = biz.address;
    document.getElementById('bizGst').value = biz.gst;
    settingsBackdrop.classList.add('show'); settingsDrawer.classList.add('show');
  });
  settingsBackdrop.addEventListener('click', ()=>{ settingsBackdrop.classList.remove('show'); settingsDrawer.classList.remove('show'); });
  document.getElementById('saveBizBtn').addEventListener('click', ()=>{
    biz = {
      name: document.getElementById('bizName').value.trim(),
      phone: document.getElementById('bizPhone').value.trim(),
      address: document.getElementById('bizAddress').value.trim(),
      gst: document.getElementById('bizGst').value.trim()
    };
    saveBiz();
    settingsBackdrop.classList.remove('show'); settingsDrawer.classList.remove('show');
  });

  document.getElementById('fDate').value = todayISO();
  renderList();

  // ---------- share ----------
  const shareBackdrop = document.getElementById('shareBackdrop');
  const shareDrawer = document.getElementById('shareDrawer');
  const sharedList = document.getElementById('sharedList');
  let shareQuoteId = null;

  function renderSharedList(){
    const q = quotes.find(x=> x.id === shareQuoteId);
    const shares = (q && Array.isArray(q.shared)) ? q.shared : [];
    sharedList.innerHTML = shares.length ? shares.map((s,i)=>
      '<div class="shared-row"><span class="num">'+escHtml(s.phone)+'</span><span class="del" data-i="'+i+'"> ✕</span></div>'
    ).join('') : '<div class="shared-empty">Not shared with anyone yet</div>';
    sharedList.querySelectorAll('.del').forEach(el=>{
      el.addEventListener('click', ()=>{
        const quote = quotes.find(x=> x.id === shareQuoteId);
        if(!quote) return;
        quote.shared.splice(Number(el.dataset.i), 1);
        saveQuotes(); renderSharedList(); renderList();
      });
    });
  }

  function openShareModal(id){
    shareQuoteId = id;
    document.getElementById('sharePhone').value = '';
    renderSharedList();
    shareBackdrop.classList.add('show'); shareDrawer.classList.add('show');
  }
  shareBackdrop.addEventListener('click', ()=>{ shareBackdrop.classList.remove('show'); shareDrawer.classList.remove('show'); });

  document.getElementById('shareSendBtn').addEventListener('click', ()=>{
    const phoneRaw = document.getElementById('sharePhone').value.trim();
    const digits = phoneRaw.replace(/\D/g,'');
    if(digits.length < 8){ document.getElementById('sharePhone').focus(); return; }

    const q = quotes.find(x=> x.id === shareQuoteId);
    if(!q) return;
    const msg = 'Quotation '+(q.quoteNo||'')+' for '+(q.client||'you')+'\nTotal: '+money(grandTotalOf(q)) +
      (biz.name ? '\n— '+biz.name : '');
    const waNumber = digits.length === 10 ? '91'+digits : digits; // default to India country code for 10-digit numbers
    window.open('https://wa.me/'+waNumber+'?text='+encodeURIComponent(msg), '_blank');

    q.shared = Array.isArray(q.shared) ? q.shared : [];
    q.shared.push({ phone: phoneRaw, date: todayISO() });
    saveQuotes();
    document.getElementById('sharePhone').value = '';
    renderSharedList();
    renderList();
  });

  document.getElementById('homeBtn').addEventListener('click', ()=>{
    window.history.back(); // change to your home screen's filename/URL
  });
})();