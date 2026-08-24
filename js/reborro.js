(function(){
  // ---------- Backend connection ----------
  // Backend runs on a different port than this static file, so this must be
  // an absolute URL, not a relative '/api' path. Update this if the backend's
  // port/host ever changes (e.g. when you deploy, switch to your real domain).
  //const API_BASE = 'http://localhost:5000/api';
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
 
  // The server sends Mongo's _id and full ISO datetimes; the rest of this file
  // was written around a plain .id and 'YYYY-MM-DD' date strings — normalize
  // once on the way in so nothing else below has to change.
  function normalizeRental(r){
    r.id = r._id || r.id;
    if (r.start) r.start = String(r.start).slice(0, 10);
    if (r.end) r.end = String(r.end).slice(0, 10);
    if (r.returnedAt) r.returnedAt = String(r.returnedAt).slice(0, 10);
    return r;
  }
 
  const EQUIPMENT = [
    { id:'jcb', name:'JCB', icon:'🚜' },
    { id:'mixer', name:'Mixer', icon:'🌀' },
    { id:'scaffolding', name:'Scaffolding', icon:'🪜' },
    { id:'generator', name:'Generator', icon:'🔌' },
    { id:'crane', name:'Crane', icon:'🏗️' },
    { id:'drill', name:'Drill', icon:'🔩' },
    { id:'other', name:'Other', icon:'➕' }
  ];
  const EQ_MAP = Object.fromEntries(EQUIPMENT.map(e=>[e.id,e]));
  const SHARE_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>';
 
  const mainView = document.getElementById('mainView');
  const histView = document.getElementById('histView');
  const ctaBar = document.getElementById('ctaBar');
  const backBtn = document.getElementById('backBtn');
  const exitBtn = document.getElementById('exitBtn');
  const alertsBox = document.getElementById('alertsBox');
  const rentalsList = document.getElementById('rentalsList');
  const emptyState = document.getElementById('emptyState');
 
  function setBackVisible(show){ backBtn.style.display = show ? 'flex' : 'none'; }
 
  // ---- raw show/hide (no history manipulation) ----
  function showMainScreenRaw(){ histView.style.display = 'none'; mainView.style.display = 'block'; ctaBar.style.display = 'flex'; }
  function showHistoryScreenRaw(){ mainView.style.display = 'none'; ctaBar.style.display = 'none'; renderHistory(); histView.style.display = 'block'; }
  function hideAddDrawerRaw(){ drawerBackdrop.classList.remove('show'); addDrawer.classList.remove('show'); }
  function showAddDrawerRaw(){ resetForm(); drawerBackdrop.classList.add('show'); addDrawer.classList.add('show'); }
  function hideShareDrawerRaw(){ shareBackdrop.classList.remove('show'); shareDrawer.classList.remove('show'); }
  function showShareDrawerRaw(rentalId){
    currentShareRentalId = rentalId || null;
    const item = currentShareRentalId ? loadAll().find(x=> String(x.id) === String(currentShareRentalId)) : null;
    shareDrawerTitle.textContent = 'Share ' + (item ? displayName(item) : 'rental');
    shareNote.textContent = ''; sharePhone.value = '';
    renderSharedList();
    shareBackdrop.classList.add('show');
    shareDrawer.classList.add('show');
  }
 
  // ---- one function renders whatever the current history.state says should be visible ----
  function applyState(state){
    hideAddDrawerRaw();
    hideShareDrawerRaw();
    if(!state){ showMainScreenRaw(); setBackVisible(false); return; }
    if(state.view === 'history'){ showHistoryScreenRaw(); setBackVisible(true); return; }
    if(state.view === 'addDrawer'){
      state.under === 'history' ? showHistoryScreenRaw() : showMainScreenRaw();
      showAddDrawerRaw(); setBackVisible(true); return;
    }
    if(state.view === 'shareDrawer'){
      state.under === 'history' ? showHistoryScreenRaw() : showMainScreenRaw();
      showShareDrawerRaw(state.rentalId); setBackVisible(true); return;
    }
  }
 
  // ---- navigation: opening a screen/drawer pushes a state; closing it just goes back ----
  function currentUnder(){ return histView.style.display === 'block' ? 'history' : 'main'; }
  function openHistoryScreen(){ history.pushState({ view:'history' }, '', '#history'); applyState(history.state); }
  function openAddDrawer(){ history.pushState({ view:'addDrawer', under:currentUnder() }, '', '#add'); applyState(history.state); }
  function openShareDrawer(rentalId){ history.pushState({ view:'shareDrawer', under:currentUnder(), rentalId }, '', '#share'); applyState(history.state); }
  function closeAddDrawer(){ (history.state && history.state.view==='addDrawer') ? window.history.back() : hideAddDrawerRaw(); }
  function closeShareDrawer(){ (history.state && history.state.view==='shareDrawer') ? window.history.back() : hideShareDrawerRaw(); }
 
  // Real browser history: the ✕ close buttons, backdrop taps, and the header's
  // back button all just call window.history.back() — a single popstate handler
  // (below, after all views are defined) restores whatever should be showing,
  // so the device's own back gesture never exits the page unexpectedly.
  backBtn.addEventListener('click', ()=> window.history.back());
 
  // Header ✕ — leaves the tool entirely (browser back, same call, no scoping to
  // the app's internal drawer/history state).
  exitBtn.addEventListener('click', ()=> window.history.back());
 
  function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
  function daysBetween(a,b){
    const A = new Date(a+'T00:00:00'), B = new Date(b+'T00:00:00');
    return Math.round((B-A) / 86400000);
  }
  function formatDate(iso){
    const d = new Date(iso+'T00:00:00');
    return d.toLocaleDateString(undefined, { month:'short', day:'numeric' });
  }
  function money(n){ return '₹' + (Number(n)||0).toLocaleString(); }
 
  function loadAll(){ return cachedRentals; }
  function saveAll(list){ cachedRentals = list; } // local mirror only — real writes go through the API calls below
 
  let cachedRentals = [];
 
  // Single source of truth: fetch everything once, keep it in cachedRentals,
  // and let the existing render()/renderHistory() keep filtering it locally
  // exactly as they did against localStorage.
  /*async function refreshRentals(){
    try {
      const data = await apiFetch('/rentals');
      cachedRentals = data.map(normalizeRental);
    } catch (err) {
      alert('Could not load rentals: ' + err.message);
    }
    render();
    if (histView.style.display === 'block') renderHistory();
  }*/
 
  function urgency(r){
    const days = daysBetween(todayISO(), r.end); // end - today
    if(days < 0) return { key:'overdue', label:'Overdue ' + Math.abs(days) + 'd', text: 'is overdue by ' + Math.abs(days) + ' day' + (Math.abs(days)===1?'':'s') };
    if(days === 0) return { key:'today', label:'Ends today', text: 'expires today' };
    if(days === 1) return { key:'tomorrow', label:'Ends tomorrow', text: 'expires tomorrow' };
    return { key:'ok', label: days + 'd left', text: null };
  }
 
  function displayName(r){ return r.equipment === 'other' ? (r.customName || 'Equipment') : EQ_MAP[r.equipment].name; }
  function displayIcon(r){ return EQ_MAP[r.equipment] ? EQ_MAP[r.equipment].icon : '🔧'; }
 
  // Billing: if hours are entered, bill hourly (daily price ÷ working hrs/day × hours actually used).
  // With no hours, bill the full daily price for every day the equipment is actually out:
  // returned early → billed only up to the return date; kept past the planned end (still
  // out, or returned late) → extra overdue days are billed at the same daily rate too.
  function hourlyRate(r){
    const whpd = Number(r.workingHoursPerDay) || 8;
    return (Number(r.dailyPrice)||0) / whpd;
  }
  function calcPlannedDays(r){ return daysBetween(r.start, r.end) + 1; }
  function billEndDate(r){
    if(r.returned && r.returnedAt) return r.returnedAt; // actual return date — early or late
    const today = todayISO();
    return today > r.end ? today : r.end; // still out past the planned end → keep accruing
  }
  function calcUsedDays(r){ return daysBetween(r.start, billEndDate(r)) + 1; }
  function isEarlyReturn(r){ return !!(r.returned && r.returnedAt && r.returnedAt < r.end); }
  function isLateReturn(r){ return !!(r.returned && r.returnedAt && r.returnedAt > r.end); }
  function isActiveOverdue(r){ return !r.returned && todayISO() > r.end; }
  function overdueExtraDays(r){ return Math.max(0, calcUsedDays(r) - calcPlannedDays(r)); }
  function calcSubtotal(r){
    if(Number(r.hours) > 0){
      return Math.round(hourlyRate(r) * Number(r.hours));
    }
    return calcUsedDays(r) * (Number(r.dailyPrice)||0);
  }
  function calcPayable(r){ return calcSubtotal(r) - (Number(r.deposit)||0); }
 
  function payableBlockHtml(r){
    const payable = calcPayable(r);
    const isRefund = payable < 0;
    return (
      '<div class="payable-box'+(isRefund?' refund':'')+'">' +
        '<span class="k">'+(isRefund ? 'Refund Due' : 'Total Payable')+'</span>' +
        '<span class="v">'+money(Math.abs(payable))+'</span>' +
      '</div>'
    );
  }
 
  function render(){
    const all = loadAll();
    const active = all.filter(r=> !r.returned);
 
    // ---- alerts ----
    const alerts = active
      .map(r=> ({ r, u: urgency(r) }))
      .filter(x=> x.u.text)
      .sort((a,b)=>{
        const order = { overdue:0, today:1, tomorrow:2 };
        return order[a.u.key]-order[b.u.key];
      });
    alertsBox.innerHTML = alerts.map(x=>
      '<div class="alert-row '+x.u.key+'"><span class="ic">⚠</span><span>'+displayName(x.r)+' rental '+x.u.text+'</span></div>'
    ).join('');
 
    // ---- rental cards ----
    if(!active.length){
      rentalsList.innerHTML = '';
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      rentalsList.innerHTML = active.map(r=>{
        const u = urgency(r);
        const totalDays = daysBetween(r.start, r.end) + 1;
        const subtotal = calcSubtotal(r);
        const extraDays = Number(r.hours) === 0 ? overdueExtraDays(r) : 0;
        return (
          '<div class="rental-card urg-'+u.key+(r.isShared ? ' shared-rental-card' : '')+'" data-id="'+r.id+'">'+
            '<div class="rc-top">' +
              '<div class="rc-icon">'+displayIcon(r)+'</div>' +
              '<div style="flex:1;min-width:0;">' +
                '<div class="rc-name">'+escHtml(displayName(r))+'</div>' +
                        (r.isShared
                        ? '<div class="shared-badge">Shared</div>'
                        : '') +
                '<div class="rc-dates">'+formatDate(r.start)+' → '+formatDate(r.end)+' · '+totalDays+'d</div>' +
              '</div>' +
             '<div class="rc-top-right">' +
  (
    r.isShared
      ? ''
      : '<button class="icon-btn rc-share-btn" aria-label="Share this rental">' +
          SHARE_ICON_SVG +
        '</button>'
  ) +
  '<div class="rc-pill '+u.key+'">'+u.label+'</div>' +
'</div>' +
            '</div>' +
            (extraDays > 0 ? '<div class="late-return-note">⏱ Still out — '+extraDays+' day'+(extraDays===1?'':'s')+' overdue and still accruing at '+money(r.dailyPrice)+'/day.</div>' : '') +
            '<div class="rc-grid">' +
              '<div class="rc-stat"><div class="k">Daily price</div><div class="v">'+money(r.dailyPrice)+'</div></div>' +
              '<div class="rc-stat"><div class="k">Subtotal'+(Number(r.hours)>0 ? ' (hourly)':'')+'</div><div class="v">'+money(subtotal)+'</div></div>' +
              '<div class="rc-stat"><div class="k">Deposit</div><div class="v">'+money(r.deposit)+'</div></div>' +
              '<div class="rc-stat"><div class="k">Hours</div><div class="v">'+(r.hours || '—')+'</div></div>' +
            '</div>' +
            (r.damage ? '<div class="rc-damage">⚠ Damage noted: '+escHtml(r.damage)+'</div>' : '') +
            payableBlockHtml(r) +
           (
  r.isShared
    ? ''
    : '<div class="rc-actions">' +
        '<button class="btn-yellow rc-return">Mark Returned</button>' +
        '<button class="btn-danger rc-delete">Delete</button>' +
      '</div>'
)  +
          '</div>'
        );
      }).join('');
 
     rentalsList.querySelectorAll('.rental-card').forEach(card => {

  const id = card.getAttribute('data-id');

  const shareBtn = card.querySelector('.rc-share-btn');
  const returnBtn = card.querySelector('.rc-return');
  const deleteBtn = card.querySelector('.rc-delete');


  // =====================================
  // OWNER: SHARE
  // SHARED USER: BUTTON DOES NOT EXIST
  // =====================================
  if (shareBtn) {

    shareBtn.addEventListener('click', () => {
      openShareDrawer(id);
    });

  }


  // =====================================
  // OWNER: MARK RETURNED
  // SHARED USER: BUTTON DOES NOT EXIST
  // =====================================
  if (returnBtn) {

    returnBtn.addEventListener('click', async () => {

      try {

        await apiFetch(
          '/rentals/' + id + '/return',
          {
            method: 'PATCH',
            body: JSON.stringify({
              returnedAt: todayISO()
            })
          }
        );

        await refreshRentals();

      } catch (err) {

        alert(
          'Could not mark as returned: ' +
          err.message
        );

      }

    });

  }


  // =====================================
  // OWNER: DELETE
  // SHARED USER: BUTTON DOES NOT EXIST
  // =====================================
  if (deleteBtn) {

    deleteBtn.addEventListener('click', async () => {

      if (
        !confirm(
          'Delete this rental record? This cannot be undone.'
        )
      ) {
        return;
      }

      try {

        await apiFetch(
          '/rentals/' + id,
          {
            method: 'DELETE'
          }
        );

        await refreshRentals();

      } catch (err) {

        alert(
          'Could not delete this rental: ' +
          err.message
        );

      }

    });

  }

});
    }
  }
 
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
 
  // ---------- Add Rental drawer ----------
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const addDrawer = document.getElementById('addDrawer');
  const eqGrid = document.getElementById('eqGrid');
  const customNameInput = document.getElementById('customNameInput');
  const startInput = document.getElementById('startInput');
  const endInput = document.getElementById('endInput');
  const priceInput = document.getElementById('priceInput');
  const hoursInput = document.getElementById('hoursInput');
  const workingHoursRow = document.getElementById('workingHoursRow');
  const workingHoursInput = document.getElementById('workingHoursInput');
  const calcPreview = document.getElementById('calcPreview');
  const depositInput = document.getElementById('depositInput');
  const damageInput = document.getElementById('damageInput');
 
  let selectedEquipment = null;
 
  eqGrid.innerHTML = EQUIPMENT.map(e=>
    '<div class="eq-opt" data-id="'+e.id+'"><span class="ic">'+e.icon+'</span>'+e.name+'</div>'
  ).join('');
  eqGrid.querySelectorAll('.eq-opt').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      selectedEquipment = opt.getAttribute('data-id');
      eqGrid.querySelectorAll('.eq-opt').forEach(o=> o.classList.remove('sel'));
      opt.classList.add('sel');
      customNameInput.style.display = selectedEquipment === 'other' ? 'block' : 'none';
    });
  });
 
  // ---- live cost preview: hours entered → hourly billing, else full daily price per day ----
  function updateCalcPreview(){
    const hours = Number(hoursInput.value) || 0;
    const usingHours = hours > 0;
    workingHoursRow.style.display = usingHours ? 'flex' : 'none';
 
    if(!priceInput.value && !usingHours){ calcPreview.style.display = 'none'; return; }
 
    const price = Number(priceInput.value) || 0;
    const whpd = Number(workingHoursInput.value) || 8;
    const deposit = Number(depositInput.value) || 0;
 
    let subtotal = null, breakdownRow = '';
 
    if(usingHours){
      const rate = whpd ? (price / whpd) : 0;
      subtotal = Math.round(rate * hours);
      breakdownRow =
        '<div class="row"><span class="k">Hourly rate</span><span class="v">'+money(rate.toFixed(2))+'/hr</span></div>' +
        '<div class="row"><span class="k">Subtotal ('+hours+' hrs)</span><span class="v">'+money(subtotal)+'</span></div>';
    } else if(startInput.value && endInput.value && endInput.value >= startInput.value){
      const totalDays = daysBetween(startInput.value, endInput.value) + 1;
      subtotal = totalDays * price;
      breakdownRow =
        '<div class="row"><span class="k">Billed daily</span><span class="v">'+money(price)+'/day</span></div>' +
        '<div class="row"><span class="k">Subtotal ('+totalDays+' days)</span><span class="v">'+money(subtotal)+'</span></div>';
    }
 
    if(subtotal === null){ calcPreview.style.display = 'none'; return; }
 
    const payable = subtotal - deposit;
    calcPreview.style.display = 'block';
    calcPreview.innerHTML = breakdownRow +
      (deposit ? '<div class="row"><span class="k">Deposit</span><span class="v">−'+money(deposit)+'</span></div>' : '') +
      '<div class="row total"><span class="k">'+(payable<0?'Refund due':'Total payable')+'</span><span class="v">'+money(Math.abs(payable))+'</span></div>';
  }
  [priceInput, hoursInput, workingHoursInput, startInput, endInput, depositInput].forEach(inp=>
    inp.addEventListener('input', updateCalcPreview)
  );
 
  function resetForm(){
    selectedEquipment = null;
    eqGrid.querySelectorAll('.eq-opt').forEach(o=> o.classList.remove('sel'));
    customNameInput.value = ''; customNameInput.style.display = 'none';
    startInput.value = todayISO(); endInput.value = '';
    priceInput.value = ''; hoursInput.value = ''; workingHoursInput.value = '';
    depositInput.value = ''; damageInput.value = '';
    workingHoursRow.style.display = 'none';
    calcPreview.style.display = 'none';
  }
  resetForm();
 
  document.getElementById('addBtn').addEventListener('click', openAddDrawer);
  drawerBackdrop.addEventListener('click', closeAddDrawer);
  document.getElementById('addDrawerCloseBtn').addEventListener('click', closeAddDrawer);
 
  document.getElementById('saveRentalBtn').addEventListener('click', async ()=>{
    if(!selectedEquipment){ alert('Pick which equipment this is.'); return; }
    if(!startInput.value || !endInput.value){ alert('Set both a rental start and end date.'); return; }
    if(endInput.value < startInput.value){ alert('Rental end can\'t be before the start date.'); return; }
    if(selectedEquipment === 'other' && !customNameInput.value.trim()){ alert('Enter a name for this equipment.'); return; }
 
    const payload = {
      equipment: selectedEquipment,
      customName: customNameInput.value.trim(),
      start: startInput.value,
      end: endInput.value,
      dailyPrice: Number(priceInput.value) || 0,
      hours: Number(hoursInput.value) || 0,
      workingHoursPerDay: Number(workingHoursInput.value) || 8,
      deposit: Number(depositInput.value) || 0,
      damage: damageInput.value.trim()
    };
 
    try {
      await apiFetch('/rentals', { method:'POST', body: JSON.stringify(payload) });
      closeAddDrawer();
      await refreshRentals();
    } catch (err) {
      alert('Could not save this rental: ' + err.message);
    }
  });
 
  // ---------- Share drawer (no third-party links — native SMS only, always scoped to one rental) ----------
  const shareBackdrop = document.getElementById('shareBackdrop');
  const shareDrawer = document.getElementById('shareDrawer');
  const shareDrawerTitle = document.getElementById('shareDrawerTitle');
  const sharePhone = document.getElementById('sharePhone');
  const shareNote = document.getElementById('shareNote');
  const sharedListWrap = document.getElementById('sharedListWrap');
  const sharedList = document.getElementById('sharedList');
 
  let currentShareRentalId = null;
 
  function rentalToText(r){
    const totalDays = calcPlannedDays(r);
    const usedDays = calcUsedDays(r);
    const subtotal = calcSubtotal(r);
    const payable = calcPayable(r);
    const u = urgency(r);
    const lines = [];
    lines.push('RENTAL: ' + displayName(r));
    lines.push(formatDate(r.start) + ' → ' + formatDate(r.end) + ' (' + totalDays + ' days)');
    lines.push('Daily price: ' + money(r.dailyPrice));
    if(Number(r.hours) > 0){
      lines.push('Hours used: ' + r.hours + ' (at ' + money(hourlyRate(r).toFixed(2)) + '/hr, ' + (r.workingHoursPerDay||8) + ' working hrs/day)');
      lines.push('Subtotal (hourly): ' + money(subtotal));
    } else {
      if(isEarlyReturn(r)) lines.push('Returned early — billed for ' + usedDays + ' of ' + totalDays + ' planned days');
      if(isLateReturn(r)) lines.push('Returned late — billed for ' + (usedDays-totalDays) + ' extra day(s) beyond the planned period');
      if(isActiveOverdue(r)) lines.push('Still out — ' + (usedDays-totalDays) + ' day(s) overdue and still accruing');
      lines.push('Subtotal: ' + money(subtotal));
    }
    lines.push('Deposit: ' + money(r.deposit));
    lines.push((payable < 0 ? 'Refund due: ' : 'Total payable: ') + money(Math.abs(payable)));
    if(u.text) lines.push('⚠ ' + displayName(r) + ' rental ' + u.text);
    if(r.damage) lines.push('Damage: ' + r.damage);
    return lines.join('\n');
  }
 
  // "shared with" entries live on the rental itself (rental.sharedWith), persisted server-side
  async function addSharedNumber(num){
    if(!currentShareRentalId) return;
    try {
      const updated = await apiFetch('/rentals/' + currentShareRentalId + '/share', {
        method:'POST',
        body: JSON.stringify({ phone: num })
      });
      normalizeRental(updated);
      const idx = cachedRentals.findIndex(x=> String(x.id) === String(currentShareRentalId));
      if(idx > -1) cachedRentals[idx] = updated; else cachedRentals.push(updated);
    } catch (err) {
      shareNote.textContent = 'Could not save this number: ' + err.message;
    }
    renderSharedList();
  }
async function refreshRentals() {

  // ==========================================
  // OWNER RENTALS
  // ==========================================
  let own = [];

  try {

    const ownRentals = await apiFetch('/rentals');

    if (Array.isArray(ownRentals)) {

      own = ownRentals.map(normalizeRental);

      own.forEach(r => {
        r.isShared = false;
      });

    }

  } catch (err) {

    console.error('Owner rentals failed:', err);

  }


  // ==========================================
  // SHARED RENTALS
  // ==========================================
  let shared = [];

  try {

    const sharedRentals = await apiFetch('/rentals/shared');

    if (Array.isArray(sharedRentals)) {

      shared = sharedRentals.map(normalizeRental);

      shared.forEach(r => {
        r.isShared = true;
      });

    }

  } catch (err) {

    // Shared endpoint failure should NOT
    // hide owner's rentals.
    console.error('Shared rentals failed:', err);

  }


  // ==========================================
  // COMBINE
  // ==========================================
  const merged = [
    ...own,
    ...shared
  ];


  // ==========================================
  // REMOVE DUPLICATES
  // ==========================================
  cachedRentals = Array.from(
    new Map(
      merged.map(r => [
        String(r.id),
        r
      ])
    ).values()
  );


  // ==========================================
  // RENDER
  // ==========================================
  render();

  if (histView.style.display === 'block') {
    renderHistory();
  }
}
  async function removeSharedNumber(num){
    if(!currentShareRentalId) return;
    try {
      const updated = await apiFetch('/rentals/' + currentShareRentalId + '/share', {
        method:'DELETE',
        body: JSON.stringify({ phone: num })
      });
      normalizeRental(updated);
      const idx = cachedRentals.findIndex(x=> String(x.id) === String(currentShareRentalId));
      if(idx > -1) cachedRentals[idx] = updated;
    } catch (err) {
      alert('Could not remove this number: ' + err.message);
    }
    renderSharedList();
  }
 
  function renderSharedList(){
    const item = currentShareRentalId ? loadAll().find(x=> String(x.id) === String(currentShareRentalId)) : null;
    const list = (item && item.sharedWith) || [];
    const icon = item ? displayIcon(item) : '📱';
    sharedListWrap.style.display = list.length ? 'block' : 'none';
    sharedList.innerHTML = list.map(num=>
      '<div class="shared-row" data-num="'+escHtml(num)+'">' +
        '<span class="ic">'+icon+'</span>' +
        '<span class="num">'+escHtml(num)+'</span>' +
        '<button class="mini-x" aria-label="Remove">✕</button>' +
      '</div>'
    ).join('');
    sharedList.querySelectorAll('.shared-row').forEach(row=>{
      row.addEventListener('click', (e)=>{
        const num = row.getAttribute('data-num');
        if(e.target.classList.contains('mini-x')){
          e.stopPropagation();
          removeSharedNumber(num);
        } else {
          sharePhone.value = num;
        }
      });
    });
  }
 
  shareBackdrop.addEventListener('click', closeShareDrawer);
  document.getElementById('shareDrawerCloseBtn').addEventListener('click', closeShareDrawer);
 
  document.getElementById('shareSendBtn').addEventListener('click', ()=>{
    const phone = sharePhone.value.trim();
    if(!phone){ shareNote.textContent = 'Enter a phone number first.'; return; }
    const item = loadAll().find(x=> String(x.id) === String(currentShareRentalId));
    const text = item ? rentalToText(item) : '';
    const digits = phone.replace(/[^\d+]/g,'');
    const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    const sep = isIOS ? '&' : '?';
    window.location.href = 'sms:' + digits + sep + 'body=' + encodeURIComponent(text);
    shareNote.textContent = 'Opening your messages app…';
    addSharedNumber(phone);
  });
 
  // ---------- History ----------
  function renderHistory(){
    const all = loadAll().filter(r=> r.returned).sort((a,b)=> (b.returnedAt||'').localeCompare(a.returnedAt||''));
    const histList = document.getElementById('histList');
    const histEmpty = document.getElementById('histEmpty');
    histEmpty.style.display = all.length ? 'none' : 'block';
    histList.innerHTML = all.map(r=>{
      const totalDays = calcPlannedDays(r);
      const usedDays = calcUsedDays(r);
      const subtotal = calcSubtotal(r);
      const early = isEarlyReturn(r) && Number(r.hours) === 0;
      const late = isLateReturn(r) && Number(r.hours) === 0;
      return (
        '<div class="rental-card" data-id="'+r.id+'">' +
          '<div class="rc-top">' +
            '<div class="rc-icon">'+displayIcon(r)+'</div>' +
            '<div style="flex:1;min-width:0;"><div class="rc-name">'+escHtml(displayName(r))+'</div>' +
            '<div class="rc-dates">'+formatDate(r.start)+' → '+formatDate(r.end)+' · '+totalDays+'d planned · returned '+formatDate(r.returnedAt)+'</div></div>' +
            '<div class="rc-top-right"><button class="icon-btn rc-share-btn" aria-label="Share this rental">'+SHARE_ICON_SVG+'</button></div>' +
          '</div>' +
          (early ? '<div class="early-return-note">↩ Returned early — billed for '+usedDays+' of '+totalDays+' planned days.</div>' : '') +
          (late ? '<div class="late-return-note">⏱ Returned late — billed for '+(usedDays-totalDays)+' extra day'+((usedDays-totalDays)===1?'':'s')+' beyond the planned period.</div>' : '') +
          '<div class="rc-grid">' +
            '<div class="rc-stat"><div class="k">Total charged'+(Number(r.hours)>0 ? ' (hourly)':'')+'</div><div class="v">'+money(subtotal)+'</div></div>' +
            '<div class="rc-stat"><div class="k">Deposit</div><div class="v">'+money(r.deposit)+'</div></div>' +
          '</div>' +
          (r.damage ? '<div class="rc-damage">⚠ Damage noted: '+escHtml(r.damage)+'</div>' : '') +
          payableBlockHtml(r) +
          '<div class="rc-actions" style="grid-template-columns:1fr;">' +
            '<button class="btn-danger hist-delete">Delete record</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    histList.querySelectorAll('.rental-card').forEach(card=>{
      const id = card.getAttribute('data-id');
      card.querySelector('.rc-share-btn').addEventListener('click', ()=> openShareDrawer(id));
    });
    histList.querySelectorAll('.hist-delete').forEach(btn=>{
      btn.addEventListener('click', async (e)=>{
        const id = e.target.closest('.rental-card').getAttribute('data-id');
        if(!confirm('Delete this returned-equipment record?')) return;
        try {
          await apiFetch('/rentals/' + id, { method:'DELETE' });
          await refreshRentals();
        } catch (err) {
          alert('Could not delete this record: ' + err.message);
        }
      });
    });
  }
 
  document.getElementById('openHistBtn').addEventListener('click', openHistoryScreen);
 // document.getElementById('closeHistBtn').addEventListener('click', ()=> window.history.back());
 
  window.addEventListener('popstate', (e)=> applyState(e.state));
 
  refreshRentals();
})();