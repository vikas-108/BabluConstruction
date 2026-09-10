/* ============================================================
   STATE
   ============================================================ */
let state = {
  logo: null,
  blocks: [
    { id: uid(), type:'text', html:'<p>Start typing your letter here. Use the toolbar above to add more paragraphs, an image, or a table of data.</p>' }
  ]
};

function uid(){ return 'b' + Math.random().toString(36).slice(2,9); }

/* ============================================================
   LOGO
   ============================================================ */
function triggerLogoUpload(){ document.getElementById('logo-input').click(); }
document.getElementById('logo-input').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    state.logo = ev.target.result;
    renderLogo();
    scheduleRescale();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});
function renderLogo(){
  const box = document.getElementById('logo-box');
  if(state.logo){
    box.innerHTML = `<img src="${state.logo}" alt="Company logo">`;
  } else {
    box.innerHTML = 'Click to<br>add logo';
  }
  // stays clickable either way, so tapping again lets you change/replace the logo
  box.onclick = triggerLogoUpload;
  box.style.cursor = 'pointer';
}

/* ============================================================
   BLOCKS
   ============================================================ */
function addTextBlock(){
  state.blocks.push({ id:uid(), type:'text', html:'<p>New paragraph…</p>' });
  renderBlocks();
}
function triggerImageUpload(){ document.getElementById('image-input').click(); }
document.getElementById('image-input').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    state.blocks.push({ id:uid(), type:'image', src:ev.target.result, size:'medium' });
    renderBlocks();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});
function addTableBlock(){
  state.blocks.push({ id:uid(), type:'table', rows: [
    ['Item', 'Description', 'Amount'],
    ['', '', ''],
    ['', '', '']
  ]});
  renderBlocks();
}
function findBlock(id){ return state.blocks.find(b=>b.id===id); }
function findBlockIndex(id){ return state.blocks.findIndex(b=>b.id===id); }
function removeBlock(id){
  state.blocks = state.blocks.filter(b=>b.id!==id);
  renderBlocks();
}
function moveBlock(id, dir){
  const i = findBlockIndex(id);
  const j = i + dir;
  if(j < 0 || j >= state.blocks.length) return;
  [state.blocks[i], state.blocks[j]] = [state.blocks[j], state.blocks[i]];
  renderBlocks();
}

function renderBlocks(){
  const container = document.getElementById('blocks-container');
  container.innerHTML = state.blocks.map(b=>{
    const toolbar = `<div class="block-toolbar no-export">
      <button onclick="moveBlock('${b.id}',-1)" title="Move up">↑</button>
      <button onclick="moveBlock('${b.id}',1)" title="Move down">↓</button>
      <button onclick="removeBlock('${b.id}')" title="Delete">✕</button>
    </div>`;

    if(b.type === 'text'){
      return `<div class="block" data-id="${b.id}">${toolbar}
        <div class="text-block" contenteditable="true" data-placeholder="Type here…"
             oninput="onTextBlockInput('${b.id}', this)">${b.html}</div>
      </div>`;
    }
    if(b.type === 'image'){
      const sizeMap = { small:'30%', medium:'55%', large:'80%', full:'100%' };
      const w = sizeMap[b.size] || '55%';
      return `<div class="block image-block" data-id="${b.id}">${toolbar}
        <img src="${b.src}" style="width:${w};">
        <div class="image-size-row no-export">
          ${['small','medium','large','full'].map(s=>`<button class="${b.size===s?'active':''}" onclick="setImageSize('${b.id}','${s}')">${s}</button>`).join('')}
        </div>
      </div>`;
    }
    if(b.type === 'table'){
      const rowsHtml = b.rows.map((row, r)=>
        `<tr>${row.map((cell,c)=>`<td contenteditable="true" oninput="onTableCellInput('${b.id}',${r},${c},this)">${escapeHtml(cell)}</td>`).join('')}</tr>`
      ).join('');
      return `<div class="block" data-id="${b.id}">${toolbar}
        <table class="lh-table">${rowsHtml}</table>
        <div class="table-controls no-export">
          <button onclick="tableAddRow('${b.id}')">+ Row</button>
          <button onclick="tableRemoveRow('${b.id}')">− Row</button>
          <button onclick="tableAddCol('${b.id}')">+ Column</button>
          <button onclick="tableRemoveCol('${b.id}')">− Column</button>
        </div>
      </div>`;
    }
    return '';
  }).join('');
  scheduleRescale();
}
function escapeHtml(s){
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function onTextBlockInput(id, el){
  const b = findBlock(id);
  if(b) b.html = el.innerHTML;
  scheduleRescale();
}
function setImageSize(id, size){
  const b = findBlock(id);
  if(b) b.size = size;
  renderBlocks();
}
function onTableCellInput(id, r, c, el){
  const b = findBlock(id);
  if(b) b.rows[r][c] = el.innerText;
}
function tableAddRow(id){
  const b = findBlock(id);
  b.rows.push(new Array(b.rows[0].length).fill(''));
  renderBlocks();
}
function tableRemoveRow(id){
  const b = findBlock(id);
  if(b.rows.length > 1) b.rows.pop();
  renderBlocks();
}
function tableAddCol(id){
  const b = findBlock(id);
  b.rows.forEach(row=>row.push(''));
  renderBlocks();
}
function tableRemoveCol(id){
  const b = findBlock(id);
  if(b.rows[0].length > 1) b.rows.forEach(row=>row.pop());
  renderBlocks();
}

/* ============================================================
   FORMAT — 10 selectable letterhead layouts (CSS-only; content unaffected)
   ============================================================ */
const FORMATS = ['classic','centered','split','minimal','formal','band','twocol','navy','charcoal','legal'];
function setFormat(name){
  const page = document.getElementById('page');
  FORMATS.forEach(f=>page.classList.remove('format-'+f));
  page.classList.add('format-'+name);
  scheduleRescale();
}

/* ============================================================
   THEME — 8 selectable color palettes, independent of format.
   Recolors whichever format is active via CSS variables.
   ============================================================ */
const THEMES = ['rust','navy','charcoal','forest','burgundy','slate','amber','mono'];
const THEME_BG_DEFAULTS = {
  rust:'#FFFDF8', navy:'#FBFCFE', charcoal:'#FFFDF9', forest:'#FBFDFC',
  burgundy:'#FEFAFA', slate:'#FBFCFD', amber:'#FFFCF6', mono:'#FFFFFF'
};
function setTheme(name){
  const page = document.getElementById('page');
  THEMES.forEach(t=>page.classList.remove('theme-'+t));
  page.classList.add('theme-'+name);
  // a manually-picked background color persists across format changes, but
  // switching themes resets to that theme's own default background
  page.style.removeProperty('--lh-page-bg');
  document.getElementById('bg-color-input').value = THEME_BG_DEFAULTS[name] || '#FFFDF8';
  scheduleRescale();
}

/* ============================================================
   BACKGROUND COLOR — independent of theme/format, lets you pick
   any custom page background color.
   ============================================================ */
function setPageBg(color){
  document.getElementById('page').style.setProperty('--lh-page-bg', color);
  scheduleRescale();
}

/* ============================================================
   RESET
   ============================================================ */
function resetLetterhead(){
  if(!confirm('Clear the logo, header text, all content blocks, and the chosen format/theme?')) return;
  state = { logo:null, blocks:[ { id:uid(), type:'text', html:'<p>Start typing your letter here.</p>' } ] };
  document.getElementById('hf-company').innerHTML = '';
  document.getElementById('hf-tagline').innerHTML = '';
  document.getElementById('hf-contact').innerHTML = '';
  document.getElementById('lh-footer-text').innerHTML = '';
  document.getElementById('format-select').value = 'classic';
  document.getElementById('theme-select').value = 'rust';
  setFormat('classic');
  setTheme('rust');
  renderLogo();
  renderBlocks();
}

/* ============================================================
   RESPONSIVE SCALING — shrinks the A4 page to fit narrow screens
   without changing its actual layout or print dimensions
   ============================================================ */
let rescaleTimer = null;
function scheduleRescale(){
  clearTimeout(rescaleTimer);
  rescaleTimer = setTimeout(rescalePage, 60);
}
function rescalePage(){
  const page = document.getElementById('page');
  const stage = document.getElementById('page-stage');
  page.style.transform = 'scale(1)';
  const naturalWidth = page.offsetWidth;
  const naturalHeight = page.offsetHeight;
  const available = stage.parentElement.clientWidth - 16;
  const scale = Math.min(1, available / naturalWidth);
  page.style.transform = `scale(${scale})`;
  stage.style.width = (naturalWidth * scale) + 'px';
  stage.style.height = (naturalHeight * scale) + 'px';
}
window.addEventListener('resize', scheduleRescale);
new MutationObserver(scheduleRescale).observe(document.getElementById('page'), { childList:true, subtree:true, characterData:true });

/* ============================================================
   DOWNLOAD PDF
   ============================================================ */
async function downloadPdf(){
  const btn = document.getElementById('download-btn');
  const page = document.getElementById('page');
  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Preparing PDF…';

  const hiddenEls = document.querySelectorAll('.no-export');
  hiddenEls.forEach(el=>el.classList.add('exporting-hide'));
  const prevTransform = page.style.transform;
  page.style.transform = 'none';

  try{
    const canvas = await html2canvas(page, { scale:2, backgroundColor:'#ffffff', useCORS:true });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    while(heightLeft > 0){
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const companyName = document.getElementById('hf-company').innerText.trim();
    const filename = (companyName ? companyName.replace(/[^a-z0-9]+/gi,'-').toLowerCase() : 'letterhead') + '.pdf';
    pdf.save(filename);
  }catch(err){
    alert("Couldn't generate the PDF — please try again.");
  }finally{
    hiddenEls.forEach(el=>el.classList.remove('exporting-hide'));
    page.style.transform = prevTransform;
    btn.disabled = false;
    btn.textContent = originalLabel;
    scheduleRescale();
  }
}

/* ============================================================
   INIT
   ============================================================ */
renderLogo();
renderBlocks();
window.addEventListener('load', scheduleRescale);