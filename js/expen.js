const STORAGE_KEY = 'expense_tracker_v1';
let data = loadData();

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return { expenses: [], mileage: [] };
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function uid(){ return 'x' + Math.random().toString(36).slice(2,8); }
function fmtMoney(n){ return '₹' + Math.round(n||0).toLocaleString('en-IN'); }
function fmtDate(iso){
  if(!iso) return '—';
  return new Date(iso+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
}
function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ============================================================
   TABS
   ============================================================ */
function setTab(tab){
  document.getElementById('tab-expenses-btn').classList.toggle('active', tab==='expenses');
  document.getElementById('tab-mileage-btn').classList.toggle('active', tab==='mileage');
  document.getElementById('panel-expenses').classList.toggle('hidden', tab!=='expenses');
  document.getElementById('panel-mileage').classList.toggle('hidden', tab!=='mileage');
}

/* ============================================================
   EXPENSES
   ============================================================ */
function addExpense(){
  const date = document.getElementById('exp-date').value;
  const category = document.getElementById('exp-category').value;
  const amount = Number(document.getElementById('exp-amount').value);
  const desc = document.getElementById('exp-desc').value.trim();
  if(!date || !amount){ alert('Enter at least a date and an amount.'); return; }

  data.expenses.push({ id: uid(), date, category, amount, desc });
  saveData();
  document.getElementById('exp-amount').value = '';
  document.getElementById('exp-desc').value = '';
  renderExpenses();
  renderStats();
}
function removeExpense(id){
  data.expenses = data.expenses.filter(e=>e.id!==id);
  saveData();
  renderExpenses();
  renderStats();
}
function renderExpenses(){
  const rows = [...data.expenses].sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('expenses-body').innerHTML = rows.length ? rows.map(e=>`
    <tr>
      <td data-label="Date">${fmtDate(e.date)}</td>
      <td data-label="Category"><span class="cat-badge">${escapeHtml(e.category)}</span></td>
      <td data-label="Description">${escapeHtml(e.desc)||'—'}</td>
      <td data-label="Amount" class="amt-col">${fmtMoney(e.amount)}</td>
      <td><button class="del-btn" onclick="removeExpense('${e.id}')">✕</button></td>
    </tr>
  `).join('') : `<tr><td colspan="5" class="empty-row">No expenses logged yet.</td></tr>`;
}

/* ============================================================
   MILEAGE
   ============================================================ */
function addMileage(){
  const date = document.getElementById('mi-date').value;
  const from = document.getElementById('mi-from').value.trim();
  const to = document.getElementById('mi-to').value.trim();
  const miles = Number(document.getElementById('mi-miles').value);
  const rate = Number(document.getElementById('mi-rate').value) || 0;
  if(!date || !miles){ alert('Enter at least a date and the miles driven.'); return; }

  data.mileage.push({ id: uid(), date, from, to, miles, rate });
  saveData();
  document.getElementById('mi-miles').value = '';
  document.getElementById('mi-from').value = '';
  document.getElementById('mi-to').value = '';
  renderMileage();
  renderStats();
}
function removeMileage(id){
  data.mileage = data.mileage.filter(m=>m.id!==id);
  saveData();
  renderMileage();
  renderStats();
}
function renderMileage(){
  const rows = [...data.mileage].sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('mileage-body').innerHTML = rows.length ? rows.map(m=>`
    <tr>
      <td data-label="Date">${fmtDate(m.date)}</td>
      <td data-label="Route">${escapeHtml(m.from)||'—'} → ${escapeHtml(m.to)||'—'}</td>
      <td data-label="Miles" class="amt-col">${m.miles}</td>
      <td data-label="Reimbursement" class="amt-col">${fmtMoney(m.miles*m.rate)}</td>
      <td><button class="del-btn" onclick="removeMileage('${m.id}')">✕</button></td>
    </tr>
  `).join('') : `<tr><td colspan="5" class="empty-row">No trips logged yet.</td></tr>`;
}

/* ============================================================
   STATS
   ============================================================ */
function renderStats(){
  const totalExpenses = data.expenses.reduce((s,e)=>s+Number(e.amount),0);
  const totalMiles = data.mileage.reduce((s,m)=>s+Number(m.miles),0);
  const totalMileageCost = data.mileage.reduce((s,m)=>s+(Number(m.miles)*Number(m.rate)),0);
  document.getElementById('stat-expenses').textContent = fmtMoney(totalExpenses);
  document.getElementById('stat-miles').textContent = totalMiles.toLocaleString('en-IN') + ' mi';
  document.getElementById('stat-mileage-cost').textContent = fmtMoney(totalMileageCost);
  document.getElementById('stat-grand').textContent = fmtMoney(totalExpenses + totalMileageCost);
}

/* ============================================================
   EXPORT / CLEAR
   ============================================================ */
function exportCsv(){
  if(!data.expenses.length && !data.mileage.length){ alert('Nothing to export yet.'); return; }
  let csv = 'Type,Date,Category/Route,Description,Amount\n';
  data.expenses.forEach(e=>{
    csv += `Expense,${e.date},${e.category},"${(e.desc||'').replace(/"/g,'""')}",${e.amount}\n`;
  });
  data.mileage.forEach(m=>{
    csv += `Mileage,${m.date},"${m.from} to ${m.to}",${m.miles} miles @ ${m.rate}/mi,${m.miles*m.rate}\n`;
  });
  const blob = new Blob([csv], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expenses-' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function clearAll(){
  if(!confirm('Delete every expense and mileage entry? This cannot be undone.')) return;
  data = { expenses:[], mileage:[] };
  saveData();
  renderExpenses();
  renderMileage();
  renderStats();
}

function goBack(){
  if(window.history.length > 1){ history.back(); }
  else { window.close(); }
}

/* init */
document.getElementById('exp-date').value = new Date().toISOString().slice(0,10);
document.getElementById('mi-date').value = new Date().toISOString().slice(0,10);
renderExpenses();
renderMileage();
renderStats();