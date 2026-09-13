let logoDataUrl = null;
let bgDataUrl = null;
let codeType = 'qr';
let qrInstance = null;
let currentFormat = 'classic';

/* ============================================================
   FORMAT & THEME — 10 layouts × 9 color palettes for the card.
   Purely visual — never touches the card data.
   ============================================================ */
const CARD_FORMATS = ['classic','centered','split','minimal','band','compact','stacked','corner','twotone','outline'];
const CARD_THEMES = ['indigo','rust','navy','charcoal','forest','burgundy','slate','amber','mono'];
const LIGHT_CARD_FORMATS = ['minimal','outline']; // these ignore the background photo/gradient for readability

function setCardFormat(name){
  currentFormat = name;
  const el = document.getElementById('biz-card');
  CARD_FORMATS.forEach(f=>el.classList.remove('format-'+f));
  el.classList.add('format-'+name);
  render();
}
function setCardTheme(name){
  const el = document.getElementById('biz-card');
  CARD_THEMES.forEach(t=>el.classList.remove('theme-'+t));
  el.classList.add('theme-'+name);
  render();
}

/* ============================================================
   CARD SIZE — 7 standard presets, independent of format/theme
   ============================================================ */
const CARD_SIZES = {
  standard:   { w:336, h:192 }, // US standard business card, 3.5 x 2 in
  eu:         { w:321, h:208 }, // EU / ISO 7810, 85 x 55 mm
  japan:      { w:344, h:208 }, // Japan standard, 91 x 55 mm
  square:     { w:240, h:240 }, // Square, 2.5 x 2.5 in
  mini:       { w:288, h:144 }, // Mini, 3 x 1.5 in
  creditcard: { w:324, h:204 }, // Credit-card size, 3.37 x 2.125 in
  slim:       { w:384, h:192 }  // Slim, 4 x 2 in
};
function setCardSize(key){
  const size = CARD_SIZES[key] || CARD_SIZES.standard;
  const el = document.getElementById('card-flip-wrap');
  el.style.width = size.w + 'px';
  el.style.height = size.h + 'px';
}
function resetCardSize(){
  document.getElementById('size-select').value = 'standard';
  setCardSize('standard');
}

/* ============================================================
   IMAGE UPLOADS
   ============================================================ */
function triggerUpload(kind){
  document.getElementById(kind === 'logo' ? 'logo-input' : 'bg-input').click();
}
document.getElementById('logo-input').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    logoDataUrl = ev.target.result;
    document.getElementById('logo-box').innerHTML = `<img src="${logoDataUrl}" alt="Logo">`;
    render();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});
document.getElementById('bg-input').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    bgDataUrl = ev.target.result;
    document.getElementById('bg-box').innerHTML = `<img src="${bgDataUrl}" alt="Background">`;
    render();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

/* ============================================================
   CODE TYPE
   ============================================================ */
function setCodeType(type){
  codeType = type;
  document.getElementById('code-qr-btn').classList.toggle('active', type==='qr');
  document.getElementById('code-barcode-btn').classList.toggle('active', type==='barcode');
  render();
}

/* ============================================================
   RENDER
   ============================================================ */
function render(){
  const company = document.getElementById('f-company').value.trim() || 'Your Company';
  const name = document.getElementById('f-name').value.trim() || 'Your Name';
  const address = document.getElementById('f-address').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const email = document.getElementById('f-email').value.trim();

  document.getElementById('bc-company').textContent = company;
  document.getElementById('bc-person').textContent = name;
  document.getElementById('bc-phone').textContent = phone;
  document.getElementById('bc-address').textContent = address;

  const logoWrap = document.getElementById('bc-logo-wrap');
  logoWrap.innerHTML = logoDataUrl ? `<img src="${logoDataUrl}" alt="Logo">` : '';

  const cardEl = document.getElementById('biz-card');
  if(LIGHT_CARD_FORMATS.includes(currentFormat)){
    cardEl.style.background = ''; // the format-* CSS rule supplies a plain light background instead
  } else {
    cardEl.style.background = bgDataUrl
      ? `center/cover no-repeat url(${bgDataUrl})`
      : 'linear-gradient(135deg, var(--bc-accent), var(--bc-accent-dark))';
  }

  renderCode({ company, name, address, phone, email });
}

function renderCode(payload){
  const codeBox = document.getElementById('bc-code');
  codeBox.innerHTML = '';
  codeBox.classList.toggle('barcode-mode', codeType === 'barcode');

  if(codeType === 'qr'){
    renderQrInto(codeBox, payload, 90);
  } else {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    codeBox.appendChild(svg);
    renderBarcodeInto(svg, payload);
  }

  renderBackCodes(payload);
}

function buildCardPayload(payload){
  return JSON.stringify({
    type: 'business_card',
    company: payload.company,
    name: payload.name,
    phone: payload.phone,
    address: payload.address,
    email: payload.email
  });
}
function renderQrInto(el, payload, size){
  if(typeof QRCode === 'undefined') return;
  el.innerHTML = '';
  // eslint-disable-next-line no-new
  new QRCode(el, { text: buildCardPayload(payload), width: size, height: size, correctLevel: QRCode.CorrectLevel.M });
}
function renderBarcodeInto(svgEl, payload){
  if(typeof JsBarcode === 'undefined') return;
  while(svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
  const value = (payload.phone || '0000000000').replace(/\D/g,'') || '0000000000';
  try{
    JsBarcode(svgEl, value, { format:'CODE128', width:1.4, height:32, displayValue:false, margin:0 });
  }catch(e){ /* invalid value for barcode encoding — leave the box empty rather than throwing */ }
}

/* the back face always shows BOTH codes together, regardless of the front's toggle */
function renderBackCodes(payload){
  renderQrInto(document.getElementById('bc-back-qr'), payload, 64);
  renderBarcodeInto(document.getElementById('bc-back-barcode'), payload);
}

/* ============================================================
   RESET / DOWNLOAD
   ============================================================ */
function resetCard(){
  if(!confirm('Clear all card details, images, format, theme, and size?')) return;
  ['f-company','f-name','f-address','f-phone','f-email'].forEach(id=>document.getElementById(id).value='');
  logoDataUrl = null;
  bgDataUrl = null;
  document.getElementById('logo-box').innerHTML = 'Add logo';
  document.getElementById('bg-box').innerHTML = 'Add background photo';
  document.getElementById('format-select').value = 'classic';
  document.getElementById('theme-select').value = 'indigo';
  setCodeType('qr');
  setCardFormat('classic');
  setCardTheme('indigo');
  resetCardSize();
  document.getElementById('card-flip-wrap').classList.remove('flipped');
  render();
}

async function downloadCard(){
  const wrap = document.getElementById('card-flip-wrap');
  const inner = document.getElementById('card-flip-inner');
  const front = document.getElementById('biz-card');
  const back = document.getElementById('biz-card-back');
  const isFlipped = wrap.classList.contains('flipped');
  const activeFace = isFlipped ? back : front;
  const inactiveFace = isFlipped ? front : back;

  // neutralize the 3D flip transforms and hide the other face so html2canvas
  // captures a clean, correctly-oriented 2D image of just the visible side
  const prevInnerTransform = inner.style.transform;
  const prevActiveTransform = activeFace.style.transform;
  const prevInactiveDisplay = inactiveFace.style.display;
  inner.style.transform = 'none';
  activeFace.style.transform = 'none';
  inactiveFace.style.display = 'none';

  try{
    const canvas = await html2canvas(activeFace, { scale: 4, backgroundColor: null });
    const link = document.createElement('a');
    const company = document.getElementById('f-company').value.trim() || 'business-card';
    const suffix = isFlipped ? '-back' : '';
    link.download = company.replace(/[^a-z0-9]+/gi,'-').toLowerCase() + suffix + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }catch(err){
    alert("Couldn't export the card — please try again.");
  }finally{
    inner.style.transform = prevInnerTransform;
    activeFace.style.transform = prevActiveTransform;
    inactiveFace.style.display = prevInactiveDisplay;
  }
}

function toggleCardFlip(){
  document.getElementById('card-flip-wrap').classList.toggle('flipped');
}

function goBack(){
  if(window.history.length > 1){ history.back(); }
  else { window.close(); }
}

/* init */
render();

/* ============================================================
   EVENT WIRING (no inline handlers — production-safe / CSP-friendly)
   ============================================================ */
document.getElementById('back-btn').addEventListener('click', goBack);
document.getElementById('format-select').addEventListener('change', e=>setCardFormat(e.target.value));
document.getElementById('theme-select').addEventListener('change', e=>setCardTheme(e.target.value));
document.getElementById('size-select').addEventListener('change', e=>setCardSize(e.target.value));
document.getElementById('reset-size-btn').addEventListener('click', resetCardSize);
document.getElementById('reset-btn').addEventListener('click', resetCard);
document.getElementById('download-btn').addEventListener('click', downloadCard);

['f-company','f-name','f-address','f-phone','f-email'].forEach(id=>{
  document.getElementById(id).addEventListener('input', render);
});

document.getElementById('logo-box').addEventListener('click', ()=>triggerUpload('logo'));
document.getElementById('bg-box').addEventListener('click', ()=>triggerUpload('bg'));
document.getElementById('code-qr-btn').addEventListener('click', ()=>setCodeType('qr'));
document.getElementById('code-barcode-btn').addEventListener('click', ()=>setCodeType('barcode'));
document.getElementById('card-flip-inner').addEventListener('click', toggleCardFlip);
