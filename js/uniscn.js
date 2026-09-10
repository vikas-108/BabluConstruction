function switchTab(tab){
  document.getElementById('tab-btn-code').classList.toggle('active', tab==='code');
  document.getElementById('tab-btn-ocr').classList.toggle('active', tab==='ocr');
  document.getElementById('tab-code').classList.toggle('hidden', tab!=='code');
  document.getElementById('tab-ocr').classList.toggle('hidden', tab!=='ocr');
  // stop the camera when leaving the code-scanner tab, so it isn't left running in the background
  if(tab !== 'code' && cameraActive) stopCamera();
}

/* ============================================================
   CODE SCANNER (QR + barcodes) — via ZXing
   ============================================================ */
let codeReader = null;
let cameraActive = false;
let scanHistory = [];
let lastScanValue = null, lastScanTime = 0;

function showCameraError(msg){
  const el = document.getElementById('camera-err');
  el.textContent = msg;
  el.classList.add('show');
}
function clearCameraError(){
  document.getElementById('camera-err').classList.remove('show');
}
function startScanningFromHero(){
  if(!cameraActive) toggleCamera();
}

async function toggleCamera(){
  if(cameraActive){ stopCamera(); return; }
  clearCameraError();

  if(typeof ZXing === 'undefined'){
    showCameraError("The scanning library didn't load — check your internet connection and reload the page.");
    return;
  }
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    showCameraError("This browser doesn't support camera access, or the page isn't loaded over HTTPS (camera access requires a secure connection).");
    return;
  }

  const btn = document.getElementById('camera-toggle-btn');
  btn.disabled = true;
  btn.textContent = 'Starting camera…';

  try{
    if(!codeReader) codeReader = new ZXing.BrowserMultiFormatReader();
    const devices = await ZXing.BrowserCodeReader.listVideoInputDevices();
    const select = document.getElementById('camera-select');
    if(devices.length > 1){
      select.innerHTML = devices.map((d,i)=>`<option value="${d.deviceId}">${d.label || 'Camera ' + (i+1)}</option>`).join('');
      // prefer a "back"/"rear" camera by default on phones with multiple cameras
      const backCam = devices.find(d=>/back|rear|environment/i.test(d.label));
      if(backCam) select.value = backCam.deviceId;
      select.classList.remove('hidden');
    } else {
      select.classList.add('hidden');
    }
    const deviceId = select.classList.contains('hidden') ? undefined : select.value;

    document.getElementById('scan-idle-msg').classList.add('hidden');
    document.getElementById('scan-frame').style.display = 'block';
    document.getElementById('scanner-hero').classList.add('hidden');

    codeReader.decodeFromVideoDevice(deviceId, 'scan-video', (result, err)=>{
      if(result) handleScanResult(result);
      // NotFoundException fires continuously while no code is in view — that's expected, not an error
    });

    cameraActive = true;
    btn.textContent = 'Stop Camera';
  }catch(err){
    let msg = "Couldn't access the camera.";
    if(err && err.name === 'NotAllowedError') msg = "Camera access was denied — allow camera permission in your browser settings and try again.";
    else if(err && err.name === 'NotFoundError') msg = "No camera was found on this device.";
    showCameraError(msg);
    document.getElementById('scan-idle-msg').classList.remove('hidden');
    document.getElementById('scanner-hero').classList.remove('hidden');
  }finally{
    btn.disabled = false;
    if(!cameraActive) btn.textContent = 'Start Camera';
  }
}

function stopCamera(){
  if(codeReader) codeReader.reset();
  cameraActive = false;
  document.getElementById('camera-toggle-btn').textContent = 'Start Camera';
  document.getElementById('scan-frame').style.display = 'none';
  document.getElementById('scan-idle-msg').classList.remove('hidden');
  document.getElementById('scanner-hero').classList.remove('hidden');
}

function handleScanResult(result){
  const value = result.getText();
  const now = Date.now();
  if(value === lastScanValue && (now - lastScanTime) < 2500) return; // debounce repeat reads of the same code
  lastScanValue = value;
  lastScanTime = now;

  let formatName = 'CODE';
  try{ formatName = ZXing.BarcodeFormat[result.getBarcodeFormat()] || formatName; }catch(e){}

  const entry = { value, format: formatName, time: new Date() };
  scanHistory.unshift(entry);
  if(scanHistory.length > 20) scanHistory.pop();

  renderScanResult(entry);
  renderScanHistory();
  if(navigator.vibrate) navigator.vibrate(80);
}

function classifyScanValue(value){
  if(/^https?:\/\//i.test(value)) return { type:'url' };
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return { type:'email' };
  if(/^\+?\d[\d\s-]{7,14}\d$/.test(value.trim())) return { type:'phone' };
  try{
    const parsed = JSON.parse(value);
    if(parsed && typeof parsed === 'object') return { type:'json', data:parsed };
  }catch(e){ /* not JSON — fall through */ }
  return { type:'text' };
}

function renderScanResult(entry){
  const { value, format } = entry;
  const classified = classifyScanValue(value);
  const card = document.getElementById('scan-result-card');
  card.classList.remove('hidden');

  const typeBadgeMap = {
    url:   ['rt-url', 'Link'],
    email: ['rt-email', 'Email'],
    phone: ['rt-phone', 'Phone number'],
    json:  ['rt-json', 'Structured data'],
    text:  ['rt-text', format]
  };
  const [cls, label] = typeBadgeMap[classified.type];

  let bodyHtml = '';
  let actionsHtml = '';

  if(classified.type === 'json'){
    bodyHtml = `<div class="json-kv">` + Object.entries(classified.data).map(([k,v])=>
      `<div class="k">${escapeHtml(k)}</div><div class="v">${escapeHtml(String(v))}</div>`
    ).join('') + `</div>`;
  } else {
    bodyHtml = `<div class="result-value">${escapeHtml(value)}</div>`;
  }

  if(classified.type === 'url'){
    actionsHtml = `<a class="btn btn-sage" href="${encodeURI(value)}" target="_blank" rel="noopener">Open link ↗</a>`;
  } else if(classified.type === 'email'){
    actionsHtml = `<a class="btn btn-sage" href="mailto:${value}">Send email</a>`;
  } else if(classified.type === 'phone'){
    actionsHtml = `<a class="btn btn-sage" href="tel:${value.replace(/\s|-/g,'')}">Call</a>`;
  }
  actionsHtml += `<button class="btn btn-ghost" onclick="copyToClipboard(${JSON.stringify(value)})">Copy</button>`;

  card.innerHTML = `
    <span class="result-type ${cls}">${label}</span>
    ${bodyHtml}
    <div class="result-actions">${actionsHtml}</div>
  `;
}

function renderScanHistory(){
  const el = document.getElementById('scan-history');
  if(!scanHistory.length){ el.innerHTML = `<div class="empty-state">No scans yet — point the camera at a QR code or barcode.</div>`; return; }
  el.innerHTML = scanHistory.map(h=>`
    <div class="history-item">
      <div>
        <div class="hv">${escapeHtml(h.value)}</div>
        <div class="ht">${h.format} · ${h.time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
      </div>
      <button class="btn btn-ghost" style="padding:6px 10px; font-size:12px;" onclick="copyToClipboard(${JSON.stringify(h.value)})">Copy</button>
    </div>
  `).join('');
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function copyToClipboard(text){
  navigator.clipboard.writeText(text).catch(()=>{});
}

/* ============================================================
   DOCUMENT OCR — via Tesseract.js
   ============================================================ */
function triggerOcrCamera(){ document.getElementById('ocr-camera-input').click(); }
function triggerOcrUpload(){ document.getElementById('ocr-upload-input').click(); }

function handleOcrFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    document.getElementById('ocr-preview-img').src = ev.target.result;
    document.getElementById('ocr-preview-wrap').classList.remove('hidden');
    document.getElementById('ocr-extract-btn').classList.remove('hidden');
    document.getElementById('ocr-result-wrap').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}
document.getElementById('ocr-camera-input').addEventListener('change', e=>{ handleOcrFile(e.target.files[0]); e.target.value=''; });
document.getElementById('ocr-upload-input').addEventListener('change', e=>{ handleOcrFile(e.target.files[0]); e.target.value=''; });

async function runOcr(){
  if(typeof Tesseract === 'undefined'){
    alert("The text-recognition library didn't load — check your internet connection and reload the page.");
    return;
  }
  const img = document.getElementById('ocr-preview-img');
  const extractBtn = document.getElementById('ocr-extract-btn');
  const progressWrap = document.getElementById('ocr-progress');
  const progressFill = document.getElementById('ocr-progress-fill');
  const progressLabel = document.getElementById('ocr-progress-label');

  extractBtn.disabled = true;
  progressWrap.classList.remove('hidden');
  progressFill.style.width = '0%';
  progressLabel.textContent = 'Loading text recognizer…';

  try{
    const result = await Tesseract.recognize(img.src, 'eng', {
      logger: m=>{
        if(m.status === 'recognizing text'){
          progressLabel.textContent = 'Reading document… ' + Math.round(m.progress*100) + '%';
          progressFill.style.width = Math.round(m.progress*100) + '%';
        } else {
          progressLabel.textContent = m.status.charAt(0).toUpperCase() + m.status.slice(1) + '…';
        }
      }
    });
    const text = result.data.text.trim();
    document.getElementById('ocr-text-output').value = text || '(No text was recognized in this image.)';
    renderOcrDetectedChips(text);
    document.getElementById('ocr-result-wrap').classList.remove('hidden');
  }catch(err){
    alert("Couldn't read the document — try a clearer, well-lit photo.");
  }finally{
    extractBtn.disabled = false;
    progressWrap.classList.add('hidden');
  }
}

function renderOcrDetectedChips(text){
  const chips = [];
  const emails = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g) || [];
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  const phones = text.match(/\+?\d[\d\s-]{8,14}\d/g) || [];
  const dates = text.match(/\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b/g) || [];

  emails.forEach(v=>chips.push(`<span class="chip">✉ <a href="mailto:${v}">${escapeHtml(v)}</a></span>`));
  urls.forEach(v=>chips.push(`<span class="chip">🔗 <a href="${encodeURI(v)}" target="_blank" rel="noopener">${escapeHtml(v)}</a></span>`));
  phones.forEach(v=>chips.push(`<span class="chip">☎ <a href="tel:${v.replace(/\s|-/g,'')}">${escapeHtml(v)}</a></span>`));
  dates.forEach(v=>chips.push(`<span class="chip">📅 ${escapeHtml(v)}</span>`));

  const container = document.getElementById('ocr-detected-chips');
  container.innerHTML = chips.length ? chips.join('') : `<span class="chip" style="background:transparent;">No emails, links, phone numbers, or dates detected.</span>`;
}
function copyOcrText(){
  const text = document.getElementById('ocr-text-output').value;
  navigator.clipboard.writeText(text).catch(()=>{});
}