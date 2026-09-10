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
   document
    .getElementById("logo-box")
    ?.addEventListener("click", triggerLogoUpload);

document
    .getElementById("logo-box")
    ?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            triggerLogoUpload();
        }
    });
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

function renderBlocks() {

    const container =
        document.getElementById("blocks-container");

    if (!container) {
        return;
    }


    container.innerHTML = state.blocks
        .map(function (block) {

            /* ==================================================
               BLOCK TOOLBAR
               ================================================== */

            const toolbar = `
                <div class="block-toolbar no-export">

                    <button
                        type="button"
                        class="move-up-btn"
                        title="Move up"
                        aria-label="Move block up"
                    >
                        ↑
                    </button>

                    <button
                        type="button"
                        class="move-down-btn"
                        title="Move down"
                        aria-label="Move block down"
                    >
                        ↓
                    </button>

                    <button
                        type="button"
                        class="remove-block-btn"
                        title="Delete"
                        aria-label="Delete block"
                    >
                        ✕
                    </button>

                </div>
            `;


            /* ==================================================
               TEXT BLOCK
               ================================================== */

            if (block.type === "text") {

                return `
                    <div
                        class="block"
                        data-id="${escapeHtml(block.id)}"
                    >

                        ${toolbar}

                        <div
                            class="text-block"
                            contenteditable="true"
                            data-placeholder="Type here…"
                        >${block.html || ""}</div>

                    </div>
                `;

            }


            /* ==================================================
               IMAGE BLOCK
               ================================================== */

            if (block.type === "image") {

                const sizeMap = {
                    small: "30%",
                    medium: "55%",
                    large: "80%",
                    full: "100%"
                };


                const width =
                    sizeMap[block.size] || "55%";


                const sizes =
                    [
                        "small",
                        "medium",
                        "large",
                        "full"
                    ];


                const sizeButtons =
                    sizes
                        .map(function (size) {

                            return `
                                <button
                                    type="button"
                                    class="${block.size === size ? "active" : ""}"
                                    data-image-size="${size}"
                                >
                                    ${size}
                                </button>
                            `;

                        })
                        .join("");


                return `
                    <div
                        class="block image-block"
                        data-id="${escapeHtml(block.id)}"
                    >

                        ${toolbar}

                        <img
                            src="${escapeHtml(block.src)}"
                            style="width:${width};"
                            alt="Uploaded image"
                        >

                        <div class="image-size-row no-export">
                            ${sizeButtons}
                        </div>

                    </div>
                `;

            }


            /* ==================================================
               TABLE BLOCK
               ================================================== */

            if (block.type === "table") {

                const rowsHtml =
                    block.rows
                        .map(function (row, rowIndex) {

                            const cellsHtml =
                                row
                                    .map(function (
                                        cell,
                                        columnIndex
                                    ) {

                                        return `
                                            <td
                                                contenteditable="true"
                                                data-row="${rowIndex}"
                                                data-col="${columnIndex}"
                                            >${escapeHtml(cell)}</td>
                                        `;

                                    })
                                    .join("");


                            return `
                                <tr>
                                    ${cellsHtml}
                                </tr>
                            `;

                        })
                        .join("");


                return `
                    <div
                        class="block"
                        data-id="${escapeHtml(block.id)}"
                    >

                        ${toolbar}

                        <table class="lh-table">
                            ${rowsHtml}
                        </table>

                        <div class="table-controls no-export">

                            <button
                                type="button"
                                class="table-add-row-btn"
                            >
                                + Row
                            </button>

                            <button
                                type="button"
                                class="table-remove-row-btn"
                            >
                                − Row
                            </button>

                            <button
                                type="button"
                                class="table-add-col-btn"
                            >
                                + Column
                            </button>

                            <button
                                type="button"
                                class="table-remove-col-btn"
                            >
                                − Column
                            </button>

                        </div>

                    </div>
                `;

            }


            return "";

        })
        .join("");


    /* ============================================================
       ATTACH EVENTS TO RENDERED BLOCKS
       ============================================================ */

    container
        .querySelectorAll(".block[data-id]")
        .forEach(function (blockElement) {

            const blockId =
                blockElement.dataset.id;


            /* ==================================================
               MOVE UP
               ================================================== */

            blockElement
                .querySelector(".move-up-btn")
                ?.addEventListener(
                    "click",
                    function () {

                        moveBlock(
                            blockId,
                            -1
                        );

                    }
                );


            /* ==================================================
               MOVE DOWN
               ================================================== */

            blockElement
                .querySelector(".move-down-btn")
                ?.addEventListener(
                    "click",
                    function () {

                        moveBlock(
                            blockId,
                            1
                        );

                    }
                );


            /* ==================================================
               REMOVE BLOCK
               ================================================== */

            blockElement
                .querySelector(".remove-block-btn")
                ?.addEventListener(
                    "click",
                    function () {

                        removeBlock(
                            blockId
                        );

                    }
                );


            /* ==================================================
               TEXT INPUT
               ================================================== */

            blockElement
                .querySelector(".text-block")
                ?.addEventListener(
                    "input",
                    function (event) {

                        onTextBlockInput(
                            blockId,
                            event.currentTarget
                        );

                    }
                );


            /* ==================================================
               IMAGE SIZE
               ================================================== */

            blockElement
                .querySelectorAll(
                    "[data-image-size]"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                setImageSize(
                                    blockId,
                                    button.dataset.imageSize
                                );

                            }
                        );

                    }
                );


            /* ==================================================
               TABLE CELLS
               ================================================== */

            blockElement
                .querySelectorAll(
                    "td[data-row][data-col]"
                )
                .forEach(
                    function (cell) {

                        cell.addEventListener(
                            "input",
                            function (event) {

                                onTableCellInput(
                                    blockId,
                                    Number(cell.dataset.row),
                                    Number(cell.dataset.col),
                                    event.currentTarget
                                );

                            }
                        );

                    }
                );


            /* ==================================================
               TABLE CONTROLS
               ================================================== */

            blockElement
                .querySelector(
                    ".table-add-row-btn"
                )
                ?.addEventListener(
                    "click",
                    function () {

                        tableAddRow(
                            blockId
                        );

                    }
                );


            blockElement
                .querySelector(
                    ".table-remove-row-btn"
                )
                ?.addEventListener(
                    "click",
                    function () {

                        tableRemoveRow(
                            blockId
                        );

                    }
                );


            blockElement
                .querySelector(
                    ".table-add-col-btn"
                )
                ?.addEventListener(
                    "click",
                    function () {

                        tableAddCol(
                            blockId
                        );

                    }
                );


            blockElement
                .querySelector(
                    ".table-remove-col-btn"
                )
                ?.addEventListener(
                    "click",
                    function () {

                        tableRemoveCol(
                            blockId
                        );

                    }
                );

        });


    /* ============================================================
       RESCALE
       ============================================================ */

    scheduleRescale();

}
//function escapeHtml(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
   document.getElementById("format-select")?.addEventListener("change", (event) => {
        setFormat(event.target.value);
    });
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
   document.getElementById("theme-select")?.addEventListener("change", (event) => {
        setTheme(event.target.value);
    });
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
   document.getElementById("bg-color-input")?.addEventListener("input", (event) => {
        setPageBg(event.target.value);
    });

document.getElementById("addTextBlockBtn")?.addEventListener("click", addTextBlock);

document.getElementById("triggerImageUploadBtn")?.addEventListener("click", triggerImageUpload);

document.getElementById("addTableBlockBtn")?.addEventListener("click", addTableBlock);

document.getElementById("resetLetterheadBtn")?.addEventListener("click", resetLetterhead);

document.getElementById("download-btn")?.addEventListener("click", downloadPdf);
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
