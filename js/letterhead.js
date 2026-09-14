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
document.getElementById('logo-box').addEventListener('click', () => document.getElementById('logo-input').click());
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
  box.innerHTML = state.logo ? `<img src="${state.logo}" alt="Company logo">` : 'Click to<br>add logo';
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
function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderBlocks(){
  const container = document.getElementById('blocks-container');
  container.innerHTML = state.blocks.map(b=>{
    const toolbar = `<div class="block-toolbar no-export">
      <button data-action="move-up" title="Move up">↑</button>
      <button data-action="move-down" title="Move down">↓</button>
      <button data-action="delete" title="Delete">✕</button>
    </div>`;

    if(b.type === 'text'){
      return `<div class="block" data-id="${b.id}">${toolbar}
        <input type="color" class="text-color-input no-export" value="#232323" data-role="text-color"
               title="Text color — select some text first to color just that part, or leave nothing selected to color the whole paragraph">
        <div class="text-block" contenteditable="true" data-placeholder="Type here…" data-role="text-content">${b.html}</div>
      </div>`;
    }
    if(b.type === 'image'){
      const sizeMap = { small:'30%', medium:'55%', large:'80%', full:'100%' };
      const w = sizeMap[b.size] || '55%';
      return `<div class="block image-block" data-id="${b.id}">${toolbar}
        <img src="${b.src}" style="width:${w};">
        <div class="image-size-row no-export">
          ${['small','medium','large','full'].map(s=>`<button class="${b.size===s?'active':''}" data-action="set-image-size" data-size="${s}">${s}</button>`).join('')}
        </div>
      </div>`;
    }
    if(b.type === 'table'){
      const rowsHtml = b.rows.map((row, r)=>
        `<tr>${row.map((cell,c)=>`<td contenteditable="true" data-role="table-cell" data-row="${r}" data-col="${c}">${escapeHtml(cell)}</td>`).join('')}</tr>`
      ).join('');
      return `<div class="block" data-id="${b.id}">${toolbar}
        <table class="lh-table">${rowsHtml}</table>
        <div class="table-controls no-export">
          <button data-action="table-add-row">+ Row</button>
          <button data-action="table-remove-row">− Row</button>
          <button data-action="table-add-col">+ Column</button>
          <button data-action="table-remove-col">− Column</button>
        </div>
      </div>`;
    }
    return '';
  }).join('');
  scheduleRescale();
}

/* --- delegated event handling for dynamically-rendered blocks --- */
const blocksContainer = document.getElementById('blocks-container');

blocksContainer.addEventListener('click', e=>{
  const btn = e.target.closest('button[data-action]');
  if(!btn) return;
  const blockEl = e.target.closest('.block');
  const id = blockEl && blockEl.dataset.id;
  const action = btn.dataset.action;
  if(action === 'move-up') moveBlock(id, -1);
  else if(action === 'move-down') moveBlock(id, 1);
  else if(action === 'delete') removeBlock(id);
  else if(action === 'set-image-size') setImageSize(id, btn.dataset.size);
  else if(action === 'table-add-row') tableAddRow(id);
  else if(action === 'table-remove-row') tableRemoveRow(id);
  else if(action === 'table-add-col') tableAddCol(id);
  else if(action === 'table-remove-col') tableRemoveCol(id);
});

blocksContainer.addEventListener('input', e=>{
  const el = e.target;
  const blockEl = el.closest('.block');
  if(!blockEl) return;
  const id = blockEl.dataset.id;
  if(el.dataset.role === 'text-content'){
    const b = findBlock(id);
    if(b) b.html = el.innerHTML;
    scheduleRescale();
  } else if(el.dataset.role === 'table-cell'){
    const b = findBlock(id);
    if(b) b.rows[Number(el.dataset.row)][Number(el.dataset.col)] = el.innerText;
  }
});

/* text color: save selection on mousedown (before the native color
   picker steals focus), then apply on input */
let savedRange = null;
let savedRangeBlockId = null;

blocksContainer.addEventListener('mousedown', e=>{
  if(e.target.dataset.role !== 'text-color') return;
  const blockEl = e.target.closest('.block');
  const id = blockEl && blockEl.dataset.id;
  const textEl = blockEl.querySelector('[data-role="text-content"]');
  const sel = window.getSelection();
  if(sel.rangeCount > 0){
    const range = sel.getRangeAt(0);
    if(textEl && textEl.contains(range.commonAncestorContainer)){
      savedRange = range.cloneRange();
      savedRangeBlockId = id;
    }
  }
});
blocksContainer.addEventListener('input', e=>{
  if(e.target.dataset.role !== 'text-color') return;
  const blockEl = e.target.closest('.block');
  const id = blockEl.dataset.id;
  const textEl = blockEl.querySelector('[data-role="text-content"]');
  applyTextColor(id, textEl, e.target.value);
});

function applyTextColor(blockId, textEl, color){
  const sel = window.getSelection();
  if(savedRange && savedRangeBlockId === blockId && !savedRange.collapsed){
    sel.removeAllRanges();
    sel.addRange(savedRange);
  } else {
    const fullRange = document.createRange();
    fullRange.selectNodeContents(textEl);
    sel.removeAllRanges();
    sel.addRange(fullRange);
  }
  document.execCommand('styleWithCSS', false, true);
  document.execCommand('foreColor', false, color);
  const b = findBlock(blockId);
  if(b) b.html = textEl.innerHTML;
}

function setImageSize(id, size){
  const b = findBlock(id);
  if(b) b.size = size;
  renderBlocks();
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
   FORMAT & THEME
   ============================================================ */
const FORMATS = ['classic','centered','split','minimal','formal','band','twocol','navy','charcoal','legal'];
const THEMES = ['rust','navy','charcoal','forest','burgundy','slate','amber','mono'];
const THEME_BG_DEFAULTS = {
  rust:'#FFFDF8', navy:'#FBFCFE', charcoal:'#FFFDF9', forest:'#FBFDFC',
  burgundy:'#FEFAFA', slate:'#FBFCFD', amber:'#FFFCF6', mono:'#FFFFFF'
};
function setFormat(name){
  const page = document.getElementById('page');
  FORMATS.forEach(f=>page.classList.remove('format-'+f));
  page.classList.add('format-'+name);
  scheduleRescale();
}
function setTheme(name){
  const page = document.getElementById('page');
  THEMES.forEach(t=>page.classList.remove('theme-'+t));
  page.classList.add('theme-'+name);
  page.style.removeProperty('--lh-page-bg');
  document.getElementById('bg-color-input').value = THEME_BG_DEFAULTS[name] || '#FFFDF8';
  scheduleRescale();
}
function setPageBg(color){
  document.getElementById('page').style.setProperty('--lh-page-bg', color);
  scheduleRescale();
}
document.getElementById('format-select').addEventListener('change', e=>setFormat(e.target.value));
document.getElementById('theme-select').addEventListener('change', e=>setTheme(e.target.value));
document.getElementById('bg-color-input').addEventListener('input', e=>setPageBg(e.target.value));

/* ============================================================
   TOOLBAR BUTTONS
   ============================================================ */
document.getElementById('add-text-btn').addEventListener('click', addTextBlock);
document.getElementById('add-image-btn').addEventListener('click', triggerImageUpload);
document.getElementById('add-table-btn').addEventListener('click', addTableBlock);
document.getElementById('reset-btn').addEventListener('click', resetLetterhead);
document.getElementById('download-btn').addEventListener('click', downloadPdf);

function resetLetterhead(){
  if(!confirm('Clear the logo, header text, all content blocks, and the chosen format/theme?')) return;
  state = { logo:null, blocks:[ { id:uid(), type:'text', html:'<p>Start typing your letter here.</p>' } ] };
  document.getElementById('hf-company').innerHTML = '';
  document.getElementById('hf-tagline').innerHTML = '';
  document.getElementById('hf-contact').innerHTML = '';
  document.getElementById('lh-footer-text').innerHTML = '';
  document.getElementById('format-select').value = 'classic';
  document.getElementById('theme-select').value = 'rust';
  document.getElementById('repeat-header-toggle').checked = true;
  document.getElementById('page-numbers-toggle').checked = true;
  setFormat('classic');
  setTheme('rust');
  renderLogo();
  renderBlocks();
}

/* ============================================================
   RESPONSIVE SCALING
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
   DOWNLOAD PDF — with optional header repeated on every page
   and optional page numbers
   ============================================================ */
async function downloadPdf(){
  const btn = document.getElementById('download-btn');
  const page = document.getElementById('page');
  const repeatHeader = document.getElementById('repeat-header-toggle').checked;
  const showPageNumbers = document.getElementById('page-numbers-toggle').checked;
  const originalLabel = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Preparing PDF…';

  let exportRoot = null;

  try{
    /*
      Professional PDF pagination:
      - Creates real A4 page containers.
      - Keeps complete blocks together whenever they fit.
      - Never slices the full document image at an arbitrary point.
      - Repeats the letterhead header when selected.
      - Places the footer only on the final page, preserving the original logic.
      - Page numbers are added by jsPDF.
    */

    // Make a temporary export root.
    exportRoot = document.createElement('div');
    exportRoot.id = 'pdf-export-root';

    Object.assign(exportRoot.style, {
      position: 'fixed',
      left: '-100000px',
      top: '0',
      width: '210mm',
      display: 'block',
      visibility: 'visible',
      pointerEvents: 'none',
      zIndex: '-1'
    });

    document.body.appendChild(exportRoot);

    const sourceBlocks = Array.from(
      document.querySelectorAll('#blocks-container > .block')
    );

    const sourceHeader = document.getElementById('lh-header');
    const sourceFooter = document.getElementById('lh-footer-text');
    const sourceBlocksContainer = document.getElementById('blocks-container');

    if(!sourceBlocksContainer){
      throw new Error('Letterhead content container not found.');
    }

    /*
      Build one export-page shell. The shell copies the current
      format/theme/page background from the live editor.
    */
    function createExportPage(){
      const exportPage = page.cloneNode(false);
      exportPage.classList.add('pdf-export-page');

      // Remove visual editor transform/shadow behaviour.
      exportPage.style.transform = 'none';
      exportPage.style.width = '210mm';
      exportPage.style.height = '297mm';
      exportPage.style.minHeight = '297mm';
      exportPage.style.maxHeight = '297mm';
      exportPage.style.overflow = 'hidden';
      exportPage.style.boxShadow = 'none';

      // Make the page a vertical layout.
      exportPage.style.display = 'flex';
      exportPage.style.flexDirection = 'column';

      // Header/blocks/footer are inserted deliberately below.
      return exportPage;
    }

    function cleanForExport(root){
      root.querySelectorAll('.no-export').forEach(el => {
        el.classList.add('exporting-hide');
      });

      root.querySelectorAll('[contenteditable]').forEach(el => {
        el.removeAttribute('contenteditable');
      });

      root.querySelectorAll('input, textarea, select, button').forEach(el => {
        if(!el.classList.contains('exporting-hide')){
          el.classList.add('exporting-hide');
        }
      });
    }

    function cloneHeader(){
      if(!sourceHeader) return null;

      const header = sourceHeader.cloneNode(true);
      cleanForExport(header);

      // Preserve natural header height; do not allow it to stretch.
      header.style.flex = '0 0 auto';

      return header;
    }

    function cloneFooter(){
      if(!sourceFooter) return null;

      const footer = sourceFooter.cloneNode(true);
      cleanForExport(footer);

      footer.style.flex = '0 0 auto';

      return footer;
    }

    function createBlocksContainer(){
      const container = document.createElement('div');

      container.className = 'pdf-blocks-container';
      container.style.flex = '0 0 auto';
      container.style.width = '100%';

      return container;
    }

    /*
      Available height is measured from the actual A4 shell after
      header/footer are inserted. This avoids hard-coded pixel sizes.
    */
    function getRemainingHeight(exportPage, blocksContainer){
      const pageStyles = getComputedStyle(exportPage);
      const topPadding = parseFloat(pageStyles.paddingTop) || 0;
      const bottomPadding = parseFloat(pageStyles.paddingBottom) || 0;

      const currentHeight = exportPage.scrollHeight;
      const limit = exportPage.clientHeight - bottomPadding;

      // scrollHeight includes padding; use clientHeight as the hard A4 boundary.
      return Math.max(0, limit - currentHeight + blocksContainer.offsetHeight);
    }

    /*
      First pass: create pages and place blocks without splitting.
    */
    const pages = [];
    let currentPage = null;
    let currentBlocksContainer = null;

    function startPage(includeHeader){
      currentPage = createExportPage();

      if(includeHeader){
        const header = cloneHeader();
        if(header){
          currentPage.appendChild(header);
        }
      }

      currentBlocksContainer = createBlocksContainer();
      currentPage.appendChild(currentBlocksContainer);

      exportRoot.appendChild(currentPage);

      pages.push(currentPage);
    }

    startPage(true);

    for(const sourceBlock of sourceBlocks){

      const blockClone = sourceBlock.cloneNode(true);
      cleanForExport(blockClone);

      currentBlocksContainer.appendChild(blockClone);

      /*
        Force layout so the browser reports the real rendered height.
      */
      void currentBlocksContainer.offsetHeight;

      const overflows =
        currentPage.scrollHeight > currentPage.clientHeight + 1;

      if(overflows){

        // Remove the block from the current page.
        currentBlocksContainer.removeChild(blockClone);

        /*
          Start a new page. Header is repeated only when selected.
          The first page always has the header.
        */
        startPage(repeatHeader);

        currentBlocksContainer.appendChild(blockClone);

        void currentBlocksContainer.offsetHeight;

        /*
          A single block can itself be taller than a complete page.
          In that exceptional case we allow the browser to scale the
          block down just enough to fit rather than clipping it.
        */
        if(currentPage.scrollHeight > currentPage.clientHeight + 1){

          const available =
            currentPage.clientHeight -
            currentBlocksContainer.offsetTop -
            (parseFloat(getComputedStyle(currentPage).paddingBottom) || 0);

          if(available > 50 && blockClone.offsetHeight > available){

            /*
              Large/tall images are the common case here.
              Do not force a minimum 70% scale: a portrait image
              may legitimately need to be much smaller to fit the
              remaining A4 space.
            */
            const image =
              blockClone.querySelector('img');

            if(image){
              image.style.maxWidth = '100%';
              image.style.width = 'auto';
              image.style.height = 'auto';
              image.style.maxHeight = `${Math.max(50, available - 12)}px`;
              image.style.objectFit = 'contain';

              void blockClone.offsetHeight;
            }

            /*
              If the block is still too tall (for example because
              text/table spacing is also large), scale the whole
              block exactly to the available height. No arbitrary
              70% floor, so it can always fit instead of being clipped.
            */
            if(blockClone.offsetHeight > available){

              const scale =
                Math.min(1, available / blockClone.offsetHeight);

              blockClone.style.transformOrigin = 'top left';
              blockClone.style.transform = `scale(${scale})`;
              blockClone.style.width = `${100 / scale}%`;
            }
          }
        }
      }
    }

    /*
      Put footer on the final page, as in the original editor.
      If it does not fit, move the last content block onto a new page.
    */
    function fitFooterOnLastPage(){

      let lastPage = pages[pages.length - 1];
      let footer = cloneFooter();

      if(!footer) return;

      lastPage.appendChild(footer);

      void lastPage.offsetHeight;

      while(
        lastPage.scrollHeight > lastPage.clientHeight + 1 &&
        lastPage !== pages[0]
      ){

        const blockContainer =
          lastPage.querySelector('.pdf-blocks-container');

        const lastBlock =
          blockContainer &&
          blockContainer.lastElementChild;

        if(!lastBlock){
          break;
        }

        /*
          Remove footer and move last block to a new final page.
        */
        footer.remove();
        blockContainer.removeChild(lastBlock);

        const newPage =
          createExportPage();

        if(repeatHeader){
          const header = cloneHeader();
          if(header){
            newPage.appendChild(header);
          }
        }

        const newBlocks =
          createBlocksContainer();

        newBlocks.appendChild(lastBlock);

        newPage.appendChild(newBlocks);
        exportRoot.appendChild(newPage);
        pages.push(newPage);

        lastPage = newPage;
        footer = cloneFooter();

        if(footer){
          lastPage.appendChild(footer);
        }

        void lastPage.offsetHeight;
      }
    }

    fitFooterOnLastPage();

    /*
      Wait one frame so images/fonts/layout settle before capture.
    */
    await new Promise(resolve =>
      requestAnimationFrame(() => resolve())
    );

    /*
      html2canvas each complete A4 page separately.
      This is the critical difference from the old full-document slicing.
    */
    const canvases = [];

    for(const exportPage of pages){

      exportPage.querySelectorAll('.exporting-hide').forEach(el => {
        el.classList.add('exporting-hide');
      });

      const canvas =
        await html2canvas(
          exportPage,
          {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: false,
            logging: false
          }
        );

      canvases.push(canvas);
    }

    const { jsPDF } = window.jspdf;

    const pdf =
      new jsPDF(
        'p',
        'mm',
        'a4'
      );

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      pdf.internal.pageSize.getHeight();


    canvases.forEach((canvas, index) => {

      if(index > 0){
        pdf.addPage();
      }

      const imgData =
        canvas.toDataURL(
          'image/jpeg',
          0.96
        );

      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );
    });


    /*
      Page numbers are kept as live PDF text instead of being
      baked into the screenshot.
    */
    if(showPageNumbers){

      const totalPages =
        pdf.internal.getNumberOfPages();

      for(let i = 1; i <= totalPages; i++){

        pdf.setPage(i);

        pdf.setFontSize(9);

        pdf.setTextColor(
          140,
          130,
          110
        );

        pdf.text(
          `Page ${i} of ${totalPages}`,
          pdfWidth - 16,
          pdfHeight - 8,
          {
            align: 'right'
          }
        );
      }
    }


    const companyName =
      document
        .getElementById('hf-company')
        .innerText
        .trim();


    const filename =
      (
        companyName
          ? companyName
              .replace(
                /[^a-z0-9]+/gi,
                '-'
              )
              .toLowerCase()
          : 'letterhead'
      ) + '.pdf';


    pdf.save(filename);

  }catch(err){

    console.error(
      'PDF generation error:',
      err
    );

    alert(
      "Couldn't generate the PDF — please try again."
    );

  }finally{

    if(exportRoot){
      exportRoot.remove();
    }

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