let rooms = [];
function uid(){ return 'r' + Math.random().toString(36).slice(2,8); }

function addRoom(){
  rooms.push({ id: uid(), name: 'Room ' + (rooms.length + 1), length: 12, width: 10, height: 9, doors: 1, windows: 1 });
  renderRooms();
  calculate();
}
function removeRoom(id){
  rooms = rooms.filter(r=>r.id!==id);
  renderRooms();
  calculate();
}
function updateRoom(id, field, value){
  const r = rooms.find(r=>r.id===id);
  if(r) r[field] = field==='name' ? value : Number(value);
  calculate();
}

function renderRooms(){
  const container = document.getElementById('rooms-container');
  container.innerHTML = rooms.map(r=>`
    <div class="room-item">
      <div class="room-title">
        <input style="font-weight:700; font-size:13.5px; border:none; padding:2px 0; width:60%;" value="${r.name}" oninput="updateRoom('${r.id}','name',this.value)">
        <button class="remove-room" onclick="removeRoom('${r.id}')" title="Remove">✕</button>
      </div>
      <div class="row3">
        <div class="field"><label>Length (ft)</label><input type="number" value="${r.length}" oninput="updateRoom('${r.id}','length',this.value)"></div>
        <div class="field"><label>Width (ft)</label><input type="number" value="${r.width}" oninput="updateRoom('${r.id}','width',this.value)"></div>
        <div class="field"><label>Height (ft)</label><input type="number" value="${r.height}" oninput="updateRoom('${r.id}','height',this.value)"></div>
      </div>
      <div class="row2">
        <div class="field"><label>Doors</label><input type="number" value="${r.doors}" oninput="updateRoom('${r.id}','doors',this.value)"></div>
        <div class="field"><label>Windows</label><input type="number" value="${r.windows}" oninput="updateRoom('${r.id}','windows',this.value)"></div>
      </div>
    </div>
  `).join('');
}

/* ============================================================
   CALCULATION
   Wall area = perimeter × height, minus a standard deduction
   per door (~20 sq ft) and window (~15 sq ft) — the usual
   rule-of-thumb painters use for a quick estimate.
   ============================================================ */
function roomArea(r){
  const perimeter = 2 * (r.length + r.width);
  const gross = perimeter * r.height;
  const deductions = (r.doors * 20) + (r.windows * 15);
  return Math.max(0, gross - deductions);
}

document.getElementById('primer-toggle').addEventListener('change', function(){
  document.getElementById('primer-fields').style.display = this.checked ? 'grid' : 'none';
});

function fmtMoney(n){ return '₹' + Math.round(n||0).toLocaleString('en-IN'); }

let lastCalc = null;

function calculate(){
  const coats = Number(document.getElementById('coats').value) || 1;
  const coverageRate = Number(document.getElementById('coverage-rate').value) || 350;
  const paintPrice = Number(document.getElementById('paint-price').value) || 0;
  const primerOn = document.getElementById('primer-toggle').checked;
  const primerCoverage = Number(document.getElementById('primer-coverage').value) || 300;
  const primerPrice = Number(document.getElementById('primer-price').value) || 0;
  const productivity = Number(document.getElementById('productivity').value) || 120;
  const crewSize = Number(document.getElementById('crew-size').value) || 1;
  const hourlyRate = Number(document.getElementById('hourly-rate').value) || 0;
  const markupPct = Number(document.getElementById('markup-pct').value) || 0;
  const taxPct = Number(document.getElementById('tax-pct').value) || 0;

  const totalArea = rooms.reduce((sum, r)=>sum + roomArea(r), 0);
  const paintGallons = Math.ceil((totalArea * coats) / coverageRate) || 0;
  const primerGallons = primerOn ? (Math.ceil(totalArea / primerCoverage) || 0) : 0;

  const laborHoursTotal = (totalArea * coats) / productivity; // total painter-hours needed
  const days = crewSize > 0 ? (laborHoursTotal / crewSize) / 8 : 0;

  const paintCost = paintGallons * paintPrice;
  const primerCost = primerGallons * primerPrice;
  const laborCost = laborHoursTotal * hourlyRate;
  const subtotal = paintCost + primerCost + laborCost;
  const markup = subtotal * (markupPct / 100);
  const preTax = subtotal + markup;
  const tax = preTax * (taxPct / 100);
  const grandTotal = preTax + tax;

  document.getElementById('r-area').textContent = Math.round(totalArea).toLocaleString('en-IN') + ' sq ft';
  document.getElementById('r-paint-gal').textContent = paintGallons + ' gal';
  document.getElementById('r-primer-row').classList.toggle('hidden', !primerOn);
  document.getElementById('r-primer-gal').textContent = primerGallons + ' gal';
  document.getElementById('r-labor-hours').textContent = laborHoursTotal.toFixed(1) + ' hrs';
  document.getElementById('r-days').textContent = days.toFixed(1) + ' days';
  document.getElementById('r-paint-cost').textContent = fmtMoney(paintCost);
  document.getElementById('r-primer-cost-row').classList.toggle('hidden', !primerOn);
  document.getElementById('r-primer-cost').textContent = fmtMoney(primerCost);
  document.getElementById('r-labor-cost').textContent = fmtMoney(laborCost);
  document.getElementById('r-markup').textContent = fmtMoney(markup);
  document.getElementById('r-tax').textContent = fmtMoney(tax);
  document.getElementById('r-grand-total').textContent = fmtMoney(grandTotal);

  lastCalc = { totalArea, paintGallons, primerGallons, primerOn, laborHoursTotal, days, paintCost, primerCost, laborCost, markup, tax, grandTotal, coats };
}

/* ============================================================
   DOWNLOAD QUOTE (PDF)
   ============================================================ */
async function downloadQuote(){
  if(!lastCalc || rooms.length === 0){ alert('Add at least one room before downloading a quote.'); return; }

  const client = document.getElementById('client-name').value.trim() || 'Client';
  const notes = document.getElementById('job-notes').value.trim();

  document.getElementById('qs-company').textContent = 'Painting Services Quote';
  document.getElementById('qs-client').textContent = `Prepared for ${client}` + (notes ? ' — ' + notes : '');

  const rows = [
    ['Total paintable area', Math.round(lastCalc.totalArea).toLocaleString('en-IN') + ' sq ft'],
    ['Coats', String(lastCalc.coats)],
    ['Paint required', lastCalc.paintGallons + ' gallons'],
  ];
  if(lastCalc.primerOn) rows.push(['Primer required', lastCalc.primerGallons + ' gallons']);
  rows.push(['Estimated labor', lastCalc.laborHoursTotal.toFixed(1) + ' hours (~' + lastCalc.days.toFixed(1) + ' days)']);
  rows.push(['Paint cost', fmtMoney(lastCalc.paintCost)]);
  if(lastCalc.primerOn) rows.push(['Primer cost', fmtMoney(lastCalc.primerCost)]);
  rows.push(['Labor cost', fmtMoney(lastCalc.laborCost)]);
  rows.push(['Markup', fmtMoney(lastCalc.markup)]);
  rows.push(['Tax', fmtMoney(lastCalc.tax)]);

  const tableHtml = rows.map(([l,v])=>`<tr><td>${l}</td><td style="text-align:right;">${v}</td></tr>`).join('')
    + `<tr class="qs-total-row"><td>Total quote</td><td style="text-align:right;">${fmtMoney(lastCalc.grandTotal)}</td></tr>`;
  document.getElementById('qs-table').innerHTML = tableHtml;

  const sheet = document.getElementById('quote-sheet');
  const prevLeft = sheet.style.left;
  sheet.style.left = '0px'; // move on-screen temporarily so html2canvas can render it

  try{
    const canvas = await html2canvas(sheet, { scale:2, backgroundColor:'#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','mm','a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = canvas.height * pdfWidth / canvas.width;
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
    pdf.save((client.replace(/[^a-z0-9]+/gi,'-').toLowerCase() || 'paint-quote') + '-quote.pdf');
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

/* ============================================================
   INIT
   ============================================================ */
addRoom();