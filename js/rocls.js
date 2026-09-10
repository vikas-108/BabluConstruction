(function(){
  let rooms = [
    { name:'Bedroom 1', l:12, w:14 },
    { name:'Bedroom 2', l:10, w:12 },
    { name:'Living', l:15, w:20 },
    { name:'Kitchen', l:10, w:12 },
    { name:'Bathroom', l:6, w:8 }
  ];

  const roomsList = document.getElementById('roomsList');
  const totalAreaEl = document.getElementById('totalArea');
  const totalPerimeterEl = document.getElementById('totalPerimeter');

  function money(n){ return '₹' + (Number(n)||0).toLocaleString(); }
  function fmt(n, d){ return (Math.round(n * Math.pow(10,d)) / Math.pow(10,d)).toLocaleString(); }

  function renderRooms(){
    roomsList.innerHTML = '';
    rooms.forEach((r, i)=>{
      const area = (Number(r.l)||0) * (Number(r.w)||0);
      const row = document.createElement('div');
      row.className = 'room-row';
      row.innerHTML =
        '<input type="text" value="'+escAttr(r.name)+'" placeholder="Room name">' +
        '<input type="number" value="'+r.l+'" min="0" step="0.5">' +
        '<span class="x-sym">×</span>' +
        '<input type="number" value="'+r.w+'" min="0" step="0.5">' +
        '<span class="room-area">'+fmt(area,1)+' sqft</span>' +
        '<div class="row-x">✕</div>';
      const [nameEl, lEl, , wEl, areaEl, xEl] = row.children;
      nameEl.addEventListener('input', e=>{ r.name = e.target.value; });
      lEl.addEventListener('input', e=>{ r.l = Number(e.target.value)||0; recalcAll(); });
      wEl.addEventListener('input', e=>{ r.w = Number(e.target.value)||0; recalcAll(); });
      xEl.addEventListener('click', ()=>{ rooms.splice(i,1); renderRooms(); recalcAll(); });
      roomsList.appendChild(row);
    });
  }
  document.getElementById('addRoomBtn').addEventListener('click', ()=>{
    rooms.push({ name:'Room '+(rooms.length+1), l:10, w:10 });
    renderRooms();
    recalcAll();
  });

  function escAttr(s){ return String(s||'').replace(/"/g,'&quot;'); }

  function getTotals(){
    let area = 0, perimeter = 0;
    rooms.forEach(r=>{
      const l = Number(r.l)||0, w = Number(r.w)||0;
      area += l*w;
      perimeter += 2*(l+w);
    });
    return { area, perimeter };
  }

  // ---- Tiles ----
  const tileSize = document.getElementById('tileSize');
  const tileCustomRow = document.getElementById('tileCustomRow');
  const tileCustomL = document.getElementById('tileCustomL');
  const tileCustomW = document.getElementById('tileCustomW');
  const tileWastage = document.getElementById('tileWastage');
  tileSize.addEventListener('change', ()=>{
    tileCustomRow.style.display = tileSize.value === 'custom' ? 'flex' : 'none';
    recalcAll();
  });
  [tileCustomL, tileCustomW, tileWastage].forEach(el=> el.addEventListener('input', recalcAll));

  function calcTiles(totalArea){
    const tileArea = tileSize.value === 'custom'
      ? (Number(tileCustomL.value)||1) * (Number(tileCustomW.value)||1)
      : Number(tileSize.value);
    const wastage = Number(tileWastage.value) || 0;
    const effectiveArea = totalArea * (1 + wastage/100);
    const tiles = tileArea > 0 ? Math.ceil(effectiveArea / tileArea) : 0;
    document.getElementById('tilesResult').textContent = tiles.toLocaleString();
    document.getElementById('tilesNote').textContent =
      fmt(effectiveArea,1) + ' sqft with wastage ÷ ' + fmt(tileArea,1) + ' sqft/tile';
  }

  // ---- Skirting ----
  const skirtBoardLen = document.getElementById('skirtBoardLen');
  const skirtWastage = document.getElementById('skirtWastage');
  [skirtBoardLen, skirtWastage].forEach(el=> el.addEventListener('input', recalcAll));

  function calcSkirting(totalPerimeter){
    const boardLen = Number(skirtBoardLen.value) || 8;
    const wastage = Number(skirtWastage.value) || 0;
    const effectivePerimeter = totalPerimeter * (1 + wastage/100);
    const boards = boardLen > 0 ? Math.ceil(effectivePerimeter / boardLen) : 0;
    document.getElementById('skirtResult').textContent = boards.toLocaleString();
    document.getElementById('skirtNote').textContent =
      fmt(effectivePerimeter,1) + ' ft with wastage ÷ ' + boardLen + ' ft/board';
  }

  // ---- Paint ----
  const paintHeight = document.getElementById('paintHeight');
  const paintCoats = document.getElementById('paintCoats');
  const paintOpenings = document.getElementById('paintOpenings');
  const paintCoverage = document.getElementById('paintCoverage');
  [paintHeight, paintCoats, paintOpenings, paintCoverage].forEach(el=> el.addEventListener('input', recalcAll));

  function calcPaint(totalPerimeter){
    const height = Number(paintHeight.value) || 9;
    const coats = Number(paintCoats.value) || 1;
    const openings = Number(paintOpenings.value) || 0;
    const coverage = Number(paintCoverage.value) || 140;

    const grossWallArea = totalPerimeter * height;
    const netWallArea = grossWallArea * (1 - openings/100);
    const totalPaintArea = netWallArea * coats;
    const liters = coverage > 0 ? totalPaintArea / coverage : 0;

    document.getElementById('paintResult').textContent = fmt(Math.ceil(liters*10)/10, 1) + ' L';
    document.getElementById('paintNote').textContent =
      fmt(netWallArea,0) + ' sqft wall × ' + coats + ' coat(s) ÷ ' + coverage + ' sqft/L';
  }

  function recalcAll(){
    const { area, perimeter } = getTotals();
    totalAreaEl.textContent = fmt(area,1) + ' sqft';
    totalPerimeterEl.textContent = fmt(perimeter,1) + ' ft';
    calcTiles(area);
    calcSkirting(perimeter);
    calcPaint(perimeter);
  }

  function buildEstimateText(){
    const { area, perimeter } = getTotals();
    const lines = [];
    lines.push('ROOM QUANTITY ESTIMATE');
    lines.push('');
    lines.push('Rooms:');
    rooms.forEach(r=>{
      const a = (Number(r.l)||0)*(Number(r.w)||0);
      lines.push('  ' + r.name + '  ' + r.l + ' × ' + r.w + '  =  ' + fmt(a,1) + ' sqft');
    });
    lines.push('');
    lines.push('Total floor area: ' + fmt(area,1) + ' sqft');
    lines.push('Total perimeter: ' + fmt(perimeter,1) + ' ft');
    lines.push('');
    lines.push('Tiles needed: ' + document.getElementById('tilesResult').textContent);
    lines.push('Skirting boards needed: ' + document.getElementById('skirtResult').textContent);
    lines.push('Paint needed: ' + document.getElementById('paintResult').textContent);
    return lines.join('\n');
  }

  document.getElementById('copyBtn').addEventListener('click', ()=>{
    const text = buildEstimateText();
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(()=>{
        document.getElementById('copyBtn').textContent = 'Copied!';
        setTimeout(()=>{ document.getElementById('copyBtn').textContent = 'Copy Estimate'; }, 2000);
      });
    }
  });

  // ---- Share drawer (no third-party links — native SMS only) ----
  const shareBackdrop = document.getElementById('shareBackdrop');
  const shareDrawer = document.getElementById('shareDrawer');
  const sharePhone = document.getElementById('sharePhone');
  const shareNote = document.getElementById('shareNote');

  document.getElementById('shareBtn').addEventListener('click', ()=>{
    shareNote.textContent = '';
    sharePhone.value = '';
    shareBackdrop.classList.add('show');
    shareDrawer.classList.add('show');
  });
  shareBackdrop.addEventListener('click', ()=>{
    shareBackdrop.classList.remove('show');
    shareDrawer.classList.remove('show');
  });
  document.getElementById('shareSendBtn').addEventListener('click', ()=>{
    const phone = sharePhone.value.trim();
    const text = buildEstimateText();
    if(phone){
      const digits = phone.replace(/[^\d+]/g,'');
      const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
      const sep = isIOS ? '&' : '?';
      window.location.href = 'sms:' + digits + sep + 'body=' + encodeURIComponent(text);
      shareNote.textContent = 'Opening your messages app…';
    } else if(navigator.share){
      navigator.share({ title:'Room Quantity Estimate', text: text }).catch(()=>{});
    } else if(navigator.clipboard){
      navigator.clipboard.writeText(text);
      shareNote.textContent = 'No phone entered — estimate copied instead.';
    }
  });

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());

  // ---- Help drawer (English / हिन्दी) ----
  const helpBackdrop = document.getElementById('helpBackdrop');
  const helpDrawer = document.getElementById('helpDrawer');
  const helpEN = document.getElementById('helpEN');
  const helpHI = document.getElementById('helpHI');

  document.getElementById('helpBtn').addEventListener('click', ()=>{
    helpBackdrop.classList.add('show');
    helpDrawer.classList.add('show');
  });
  helpBackdrop.addEventListener('click', ()=>{
    helpBackdrop.classList.remove('show');
    helpDrawer.classList.remove('show');
  });
  document.querySelectorAll('.lang-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.lang-opt').forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
      const isHI = btn.getAttribute('data-lang') === 'hi';
      helpEN.style.display = isHI ? 'none' : 'block';
      helpHI.style.display = isHI ? 'block' : 'none';
    });
  });

  renderRooms();
  recalcAll();
})();