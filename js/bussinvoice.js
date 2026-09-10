let items = [];
let status = 'unpaid';
let logoDataUrl = null;
function uid(){ return 'i' + Math.random().toString(36).slice(2,8); }
function fmtMoney(n){ return '₹' + Math.round(n||0).toLocaleString('en-IN'); }
function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ============================================================
   AUTO-GENERATED INVOICE NUMBER
   ============================================================ */
function generateInvoiceNumber(){
  const counter = Number(localStorage.getItem('invoice_number_counter') || '0') + 1;
  localStorage.setItem('invoice_number_counter', String(counter));
  const year = new Date().getFullYear();
  return `INV-${year}-${String(counter).padStart(4,'0')}`;
}
function regenerateInvoiceNumber(){
  document.getElementById('invoice-number').value = generateInvoiceNumber();
}

/* ============================================================
   LOGO UPLOAD (optional)
   ============================================================ */
function triggerLogoUpload(){ document.getElementById('logo-input').click(); }
document.getElementById('logo-input').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    logoDataUrl = ev.target.result;
    const box = document.getElementById('logo-box');
    box.innerHTML = `<img src="${logoDataUrl}" alt="Business logo">`;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

/* ============================================================
   FORMAT & THEME — 10 layouts × 8 color palettes for the printed
   invoice sheet. Purely visual — never touches the invoice data.
   ============================================================ */
const INVOICE_FORMATS = ['classic','centered','split','minimal','formal','band','twocol','boxed','statement','ledger'];
const INVOICE_THEMES = ['rust','navy','charcoal','forest','burgundy','slate','amber','mono'];
function setFormat(name){
  const sheet = document.getElementById('invoice-sheet');
  INVOICE_FORMATS.forEach(f=>sheet.classList.remove('format-'+f));
  sheet.classList.add('format-'+name);
}
function setTheme(name){
  const sheet = document.getElementById('invoice-sheet');
  INVOICE_THEMES.forEach(t=>sheet.classList.remove('theme-'+t));
  sheet.classList.add('theme-'+name);
}


function addItem(){
  items.push({ id: uid(), desc:'', qty:1, rate:0 });
  renderItems();
}
function removeItem(id){
  items = items.filter(i=>i.id!==id);
  renderItems();
  calculate();
}
function updateItem(id, field, value){
  const it = items.find(i=>i.id===id);
  if(!it) return;
  it[field] = field==='desc' ? value : Number(value);
  calculate();
  // update just this row's amount cell without a full re-render, so focus isn't lost mid-typing
  document.getElementById('amt-'+id).textContent = fmtMoney(it.qty * it.rate);
}
function renderItems(){
  document.getElementById('items-body').innerHTML = items.map(it=>`
    <tr>
      <td><input value="${it.desc}" placeholder="e.g. Interior wall painting" oninput="updateItem('${it.id}','desc',this.value)"></td>
      <td><input type="number" value="${it.qty}" oninput="updateItem('${it.id}','qty',this.value)"></td>
      <td><input type="number" value="${it.rate}" oninput="updateItem('${it.id}','rate',this.value)"></td>
      <td class="amt-cell" id="amt-${it.id}">${fmtMoney(it.qty*it.rate)}</td>
      <td><button class="remove-item" onclick="removeItem('${it.id}')">✕</button></td>
    </tr>
  `).join('');
  calculate();
}

function setStatus(s){
  status = s;
  ['unpaid','partial','paid'].forEach(k=>{
    document.getElementById('status-'+k).classList.toggle('active-'+k, k===s);
  });
}

function calculate(){
  const subtotal = items.reduce((sum,it)=>sum + (it.qty*it.rate), 0);
  const taxPct = Number(document.getElementById('tax-pct').value) || 0;
  const tax = subtotal * (taxPct/100);
  const total = subtotal + tax;
  document.getElementById('t-subtotal').textContent = fmtMoney(subtotal);
  document.getElementById('t-tax').textContent = fmtMoney(tax);
  document.getElementById('t-total').textContent = fmtMoney(total);
  return { subtotal, tax, total, taxPct };
}

function resetInvoice(){
  if(!confirm('Clear this invoice and start over?')) return;
  document.getElementById('biz-name').value='';
  document.getElementById('biz-contact').value='';
  document.getElementById('biz-address').value='';
  document.getElementById('client-name').value='';
  document.getElementById('client-address').value='';
  document.getElementById('invoice-number').value = generateInvoiceNumber();
  document.getElementById('invoice-date').value = new Date().toISOString().slice(0,10);
  document.getElementById('due-date').value='';
  document.getElementById('tax-pct').value='0';
  document.getElementById('notes').value='';
  setStatus('unpaid');
  logoDataUrl = null;
  document.getElementById('logo-box').innerHTML = 'Add logo<br><span style="font-size:9.5px;">(optional)</span>';
  document.getElementById('format-select').value = 'classic';
  document.getElementById('theme-select').value = 'rust';
  setFormat('classic');
  setTheme('rust');
  items = [];
  addItem();
}

/* Fills the printable #invoice-sheet from the current form state.
   Shared by both the preview modal and the PDF download. */
function populateInvoiceSheet(){
  const nums = calculate();
  const bizName = document.getElementById('biz-name').value.trim() || 'Your Business';

  const logoEl = document.getElementById('is-logo');
  if(logoDataUrl){ logoEl.src = logoDataUrl; logoEl.classList.remove('hidden'); }
  else { logoEl.classList.add('hidden'); }

  document.getElementById('is-biz-name').textContent = bizName;
  document.getElementById('is-biz-address').textContent = document.getElementById('biz-address').value.trim();
  document.getElementById('is-biz-contact').textContent = document.getElementById('biz-contact').value.trim();
  document.getElementById('is-invoice-number').textContent = document.getElementById('invoice-number').value.trim();
  document.getElementById('is-invoice-date').textContent = 'Date: ' + (document.getElementById('invoice-date').value || '—');
  document.getElementById('is-due-date').textContent = 'Due: ' + (document.getElementById('due-date').value || '—');
  document.getElementById('is-client-name').textContent = document.getElementById('client-name').value.trim() || '—';
  document.getElementById('is-client-address').textContent = document.getElementById('client-address').value.trim();

  document.getElementById('is-items').innerHTML = items.map(it=>`
    <tr><td>${escapeHtml(it.desc)||'—'}</td><td style="text-align:right;">${it.qty}</td>
    <td style="text-align:right;">${fmtMoney(it.rate)}</td><td style="text-align:right;">${fmtMoney(it.qty*it.rate)}</td></tr>
  `).join('');

  document.getElementById('is-subtotal').textContent = fmtMoney(nums.subtotal);
  document.getElementById('is-tax').textContent = fmtMoney(nums.tax) + ` (${nums.taxPct}%)`;
  document.getElementById('is-total').textContent = fmtMoney(nums.total);

  const statusColors = { paid:['#E7F6EF','#059669'], partial:['#FDF1DD','#B45309'], unpaid:['#FDE8E8','#B91C1C'] };
  const [bg,fg] = statusColors[status];
  const statusEl = document.getElementById('is-status');
  statusEl.textContent = status.toUpperCase();
  statusEl.style.background = bg;
  statusEl.style.color = fg;

  document.getElementById('is-notes').textContent = document.getElementById('notes').value.trim();
}

/* ============================================================
   PREVIEW MODAL
   ============================================================ */
function openPreview(){
  if(items.length === 0){ alert('Add at least one line item first.'); return; }
  populateInvoiceSheet();
  const sheet = document.getElementById('invoice-sheet');
  const stage = document.getElementById('preview-stage');
  sheet.classList.add('preview-mode');
  stage.appendChild(sheet);

  // scale the A4 sheet down to fit inside the modal on smaller screens
  sheet.style.transform = 'scale(1)';
  requestAnimationFrame(()=>{
    const naturalWidth = sheet.offsetWidth;
    const available = Math.min(window.innerWidth - 80, 800);
    const scale = Math.min(1, available / naturalWidth);
    sheet.style.transform = `scale(${scale})`;
    stage.style.width = (naturalWidth * scale) + 'px';
  });

  document.getElementById('preview-backdrop').classList.add('show');
}
function closePreview(){
  const sheet = document.getElementById('invoice-sheet');
  sheet.classList.remove('preview-mode');
  sheet.style.transform = '';
  document.body.appendChild(sheet); // return it to the body for the next download/preview
  document.getElementById('preview-backdrop').classList.remove('show');
}

async function downloadInvoice(){
  if(items.length === 0){ alert('Add at least one line item first.'); return; }
  populateInvoiceSheet();

  const sheet = document.getElementById('invoice-sheet');
  const prevLeft = sheet.style.left;
  sheet.style.left = '0px';
  try{
    const canvas = await html2canvas(sheet, { scale:2, backgroundColor:'#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','mm','a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = canvas.height * pdfWidth / canvas.width;
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
    const invoiceNum = document.getElementById('invoice-number').value.trim() || 'invoice';
    pdf.save(invoiceNum.replace(/[^a-z0-9]+/gi,'-').toLowerCase() + '.pdf');
  }catch(err){
    alert("Couldn't generate the PDF — please try again.");
  }finally{
    sheet.style.left = prevLeft;
  }
}

function goBack(){
  if(window.history.length > 1){ history.back(); }
  else { window.close(); }
}

/* init */
setStatus('unpaid');
setFormat('classic');
setTheme('rust');
addItem();
document.getElementById('invoice-number').value = generateInvoiceNumber();
document.getElementById('invoice-date').value = new Date().toISOString().slice(0,10);