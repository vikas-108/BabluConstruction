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
    if(typeof QRCode === 'undefined') return;
    const jsonPayload = JSON.stringify({
      type: 'business_card',
      company: payload.company,
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      email: payload.email
    });
    // eslint-disable-next-line no-new
    new QRCode(codeBox, { text: jsonPayload, width: 90, height: 90, correctLevel: QRCode.CorrectLevel.M });
  } else {
    if(typeof JsBarcode === 'undefined') return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    codeBox.appendChild(svg);
    const value = (payload.phone || '0000000000').replace(/\D/g,'') || '0000000000';
    try{
      JsBarcode(svg, value, { format:'CODE128', width:1.4, height:32, displayValue:false, margin:0 });
    }catch(e){ /* invalid value for barcode encoding — leave the box empty rather than throwing */ }
  }
}

/* ============================================================
   RESET / DOWNLOAD
   ============================================================ */
function resetCard(){
  if(!confirm('Clear all card details, images, format, and theme?')) return;
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
  render();
}

async function downloadCard(){
  const el = document.getElementById('biz-card');
  try{
    const canvas = await html2canvas(el, { scale: 4, backgroundColor: null });
    const link = document.createElement('a');
    const company = document.getElementById('f-company').value.trim() || 'business-card';
    link.download = company.replace(/[^a-z0-9]+/gi,'-').toLowerCase() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }catch(err){
    alert("Couldn't export the card — please try again.");
  }
}

function goBack(){
  if(window.history.length > 1){ history.back(); }
  else { window.close(); }
}

/* init */
render();