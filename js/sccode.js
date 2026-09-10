(function(){
  const STORAGE_KEY = 'barcodeScanHistory_v1';

  const video = document.getElementById('video');
  const canvas = document.getElementById('overlay');
  const viewfinder = document.getElementById('viewfinder');
  const vfLoader = document.getElementById('vfLoader');
  const vfLoaderText = document.getElementById('vfLoaderText');
  const unsupportedBox = document.getElementById('unsupportedBox');
  const scanLine = document.getElementById('scanLine');

  const lastScanCard = document.getElementById('lastScanCard');
  const detailFormat = document.getElementById('detailFormat');
  const detailValue = document.getElementById('detailValue');
  const detailTime = document.getElementById('detailTime');

  let lastValue = null, lastTime = 0, detector = null, rafId = null, scanning = true;

  function loadHistory(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }catch(e){ return []; } }
  function saveHistory(list){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }catch(e){} }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  function iconForFormat(format){
    if(format === 'qr_code') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5v14M7 5v14M10 5v14M14 5v14M17 5v14M21 5v14"/></svg>';
  }

  function showResult(value, format){
    detailFormat.textContent = (format || 'code').replace(/_/g,' ').toUpperCase();
    detailValue.textContent = value;
    detailTime.textContent = new Date().toLocaleString();
    lastScanCard.classList.add('show');
    lastScanCard.classList.remove('scan-flash');
    void lastScanCard.offsetWidth;
    lastScanCard.classList.add('scan-flash');
    if(navigator.vibrate) navigator.vibrate(60);
  }

  function addToHistory(value, format){
    const list = loadHistory();
    list.unshift({ id:Date.now(), value:value, format:format||'manual', time:new Date().toISOString() });
    saveHistory(list.slice(0, 200));
    renderHistory();
  }

  function renderHistory(){
    const list = loadHistory();
    const historyList = document.getElementById('historyList');
    const emptyState = document.getElementById('emptyState');
    const histCount = document.getElementById('histCount');
    const clearAllBtn = document.getElementById('clearAllBtn');

    histCount.textContent = list.length + (list.length===1 ? ' scan' : ' scans');
    emptyState.style.display = list.length ? 'none' : 'block';
    clearAllBtn.style.display = list.length ? 'inline' : 'none';
    historyList.innerHTML = '';

    list.forEach(function(item){
      const row = document.createElement('div');
      row.className = 'hist-item';
      row.innerHTML =
        '<div class="hist-icon">'+iconForFormat(item.format)+'</div>' +
        '<div class="hist-info">' +
          '<div class="hist-value">'+escHtml(item.value)+'</div>' +
          '<div class="hist-meta">'+(item.format||'manual').replace(/_/g,' ')+' · '+new Date(item.time).toLocaleString()+'</div>' +
        '</div>' +
        '<div class="hist-del">✕</div>';
      row.querySelector('.hist-del').addEventListener('click', function(){
        saveHistory(loadHistory().filter(function(x){ return x.id !== item.id; }));
        renderHistory();
      });
      historyList.appendChild(row);
    });
  }

  document.getElementById('clearAllBtn').addEventListener('click', function(){
    if(!confirm('Clear all scan history? This cannot be undone.')) return;
    saveHistory([]);
    renderHistory();
  });

  async function startCamera(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:{ ideal:'environment' } } });
      video.srcObject = stream;
      await new Promise(function(res){ video.onloadedmetadata = res; });
      vfLoader.style.display = 'none';
    }catch(err){
      vfLoaderText.textContent = 'Camera access denied — check site permissions.';
      return;
    }

    if('BarcodeDetector' in window){
      try{
        const formats = await BarcodeDetector.getSupportedFormats();
        detector = new BarcodeDetector({ formats: formats });
        detectLoop();
      }catch(err){
        showUnsupported();
      }
    } else {
      showUnsupported();
    }
  }

  function showUnsupported(){
    unsupportedBox.classList.add('show');
    scanLine.style.display = 'none';
  }

  async function detectLoop(){
    if(scanning && detector && video.readyState >= 2){
      try{
        const codes = await detector.detect(video);
        if(codes && codes.length){
          const code = codes[0];
          const now = Date.now();
          if(code.rawValue !== lastValue || now - lastTime > 2500){
            lastValue = code.rawValue;
            lastTime = now;
            showResult(code.rawValue, code.format);
            addToHistory(code.rawValue, code.format);
          }
        }
      }catch(err){ /* transient decode errors are normal, ignore */ }
    }
    rafId = requestAnimationFrame(detectLoop);
  }

  document.getElementById('scanAgainBtn').addEventListener('click', function(){
    lastValue = null;
    lastScanCard.classList.remove('show');
  });
  document.getElementById('copyBtn').addEventListener('click', function(){
    const text = detailValue.textContent;
    if(navigator.clipboard) navigator.clipboard.writeText(text);
  });

  document.getElementById('manualBtn').addEventListener('click', function(){
    const input = document.getElementById('manualInput');
    const val = input.value.trim();
    if(!val) return;
    showResult(val, 'manual');
    addToHistory(val, 'manual');
    input.value = '';
  });
  document.getElementById('manualInput').addEventListener('keydown', function(e){
    if(e.key === 'Enter') document.getElementById('manualBtn').click();
  });

  document.getElementById('exitBtn').addEventListener('click', function(){
    scanning = false;
    if(rafId) cancelAnimationFrame(rafId);
    if(video.srcObject) video.srcObject.getTracks().forEach(function(t){ t.stop(); });
    window.history.back();
  });

  renderHistory();
  startCamera();
})();