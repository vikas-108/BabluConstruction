(function(){
  // ---------- state ----------
  const state = {
    mode:'level',
    raw:{ x:0, y:0, z:0 },     // smoothed gravity vector, device frame
    offsets:{ levelRoll:0, levelPitch:0, plumbLeanLR:0, plumbLeanFB:0, slopePitch:0 },
    ready:false,
    moving:false
  };
  const ALPHA = 0.15; // smoothing factor on the raw acceleration vector (not on angles — avoids wraparound glitches)
  const G = 9.80665;

  const camState = { active:false, stream:null };

  const hints = {
    level: 'Lay the phone flat on the surface (floor, sill, shelf). Keep it still — the dot centers when the surface is level.',
    plumb: 'Hold the phone flat against the wall or column, screen facing you, top pointing up. The dot centers when it\'s truly vertical.',
    slope: 'Lay the phone flat along the slope, pointed in the direction of travel (a ramp, pipe run, or drainage line).'
  };

  const tabs = document.querySelectorAll('.tab');
  const hintText = document.getElementById('hintText');
  const statusStrip = document.getElementById('statusStrip');
  const levelStage = document.getElementById('levelStage');
  const slopeStage = document.getElementById('slopeStage');
  const readoutRow = document.getElementById('readoutRow');
  const refBox = document.getElementById('refBox');
  const bubbleGroup = document.getElementById('bubbleGroup');
  const bubbleDot = document.getElementById('bubbleDot');
  const bubbleGlow = document.getElementById('bubbleGlow');
  const slopeGroup = document.getElementById('slopeGroup');
  const camStage = document.getElementById('camStage');
  const camVideo = document.getElementById('camVideo');
  const camLineGroup = document.getElementById('camLineGroup');
  const camLine = document.getElementById('camLine');
  const camDot = document.getElementById('camDot');
  const camBadge = document.getElementById('camBadge');
  const camNote = document.getElementById('camNote');
  const camToggleBtn = document.getElementById('camToggleBtn');
  const camToggleLabel = document.getElementById('camToggleLabel');

  const camHints = {
    level: 'The line marks true horizontal. Point the camera at a sill, shelf edge, or beam and see if it matches.',
    plumb: 'The line marks true vertical. Point the camera along a door frame, column, or corner and see if it matches.',
    slope: 'The line marks true horizontal. Sight along the ramp or rail — the gap between them is your slope.'
  };

  function setHint(){ hintText.innerHTML = '<div class="dot"></div><div>' + hints[state.mode] + '</div>'; }
  setHint();

  // ---------- about toggle ----------
  const aboutToggle = document.getElementById('aboutToggle');
  const aboutBox = document.getElementById('aboutBox');
  aboutToggle.addEventListener('click', ()=>{
    aboutToggle.classList.toggle('open');
    aboutBox.classList.toggle('show');
  });

  function updateStageVisibility(){
    if(camState.active){
      levelStage.style.display = 'none';
      slopeStage.style.display = 'none';
      camStage.style.display = 'flex';
      camNote.textContent = camHints[state.mode];
    } else {
      levelStage.style.display = state.mode === 'slope' ? 'none' : 'flex';
      slopeStage.style.display = state.mode === 'slope' ? 'flex' : 'none';
      camStage.style.display = 'none';
    }
  }

  tabs.forEach(t=>{
    t.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      state.mode = t.dataset.mode;
      setHint();
      updateStageVisibility();
      refBox.classList.toggle('show', state.mode === 'slope');
      render();
    });
  });

  // ---------- camera sighting ----------
  async function toggleCamera(){
    if(camState.active){
      if(camState.stream){ camState.stream.getTracks().forEach(t=>t.stop()); }
      camState.stream = null;
      camState.active = false;
      camToggleBtn.classList.remove('on');
      camToggleLabel.textContent = 'Sight it with the camera';
      updateStageVisibility();
      return;
    }
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      camToggleLabel.textContent = 'Camera not supported on this browser';
      return;
    }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:{ ideal:'environment' } }, audio:false });
      camState.stream = stream;
      camVideo.srcObject = stream;
      camState.active = true;
      camToggleBtn.classList.add('on');
      camToggleLabel.textContent = 'Close camera guide';
      updateStageVisibility();
      render();
    } catch(err){
      camToggleLabel.textContent = 'Camera access denied — check site permissions';
    }
  }
  camToggleBtn.addEventListener('click', toggleCamera);

  function updateCameraOverlay(rollDeg, cls, badgeText){
    if(!camState.active) return;
    const clamped = Math.max(-60, Math.min(60, rollDeg));
    let angleAttr = -clamped;
    if(state.mode === 'plumb') angleAttr += 90; // draw the reference line vertical instead of horizontal
    camLineGroup.setAttribute('transform', 'rotate(' + angleAttr.toFixed(1) + ' 125 125)');
    const color = cls==='good' ? 'var(--green)' : cls==='close' ? 'var(--amber)' : 'var(--red)';
    camLine.setAttribute('stroke', color);
    camDot.setAttribute('fill', color);
    camBadge.textContent = badgeText;
  }

  // ---------- physically-correct angle math ----------
  // All angles are derived directly from the smoothed gravity vector (x,y,z) using
  // atan2 of two components — the same method a real bubble level / inclinometer uses.
  // This avoids the beta/gamma Euler-angle coupling & gimbal-lock instability that
  // made "Plumb" (held near the beta≈90° singularity) jump around unpredictably.

  function levelAngles(){
    const { x, y, z } = state.raw;
    const roll  = Math.atan2(x, z) * 180 / Math.PI;  // left/right tilt when lying flat
    const pitch = Math.atan2(y, z) * 180 / Math.PI;  // front/back tilt when lying flat
    return { roll: roll - state.offsets.levelRoll, pitch: pitch - state.offsets.levelPitch };
  }
  function plumbAngles(){
    const { x, y, z } = state.raw;
    const leanLR = Math.atan2(x, y) * 180 / Math.PI; // sideways lean when held upright
    const leanFB = Math.atan2(z, y) * 180 / Math.PI; // forward/back lean when held upright
    return { leanLR: leanLR - state.offsets.plumbLeanLR, leanFB: leanFB - state.offsets.plumbLeanFB };
  }
  function slopePitch(){
    const { y, z } = state.raw;
    const pitch = Math.atan2(y, z) * 180 / Math.PI;
    return pitch - state.offsets.slopePitch;
  }
  function crossSlopeRoll(){
    // sideways tilt while measuring slope — tells you if you're holding the phone
    // twisted sideways instead of square along the direction of travel.
    const { x, z } = state.raw;
    return Math.atan2(x, z) * 180 / Math.PI;
  }

  function classify(mag){
    if(mag <= 0.5) return 'good';
    if(mag <= 2) return 'close';
    return 'off';
  }

  let lastReading = null; // cached for the "Save Reading" drawer

  function render(){
    if(!state.ready){
      statusStrip.className = 'status';
      statusStrip.textContent = 'WAITING FOR SENSORS…';
      return;
    }
    if(state.moving){
      statusStrip.className = 'status moving';
      statusStrip.textContent = 'HOLD STILL — DETECTING MOVEMENT';
      // keep showing the last stable readout underneath rather than freezing the whole UI
    }

    if(state.mode === 'slope'){
      const angle = slopePitch();
      const mag = Math.abs(angle);
      const cls = classify(mag);
      if(!state.moving){
        statusStrip.className = 'status ' + (mag<=0.5?'good':mag<=2?'close':'off');
        statusStrip.textContent = mag<=0.5 ? 'FLAT / ZERO GRADE' : (angle>0? 'RISING':'FALLING') + ' — ' + mag.toFixed(1) + '°';
      }

      const clamped = Math.max(-45, Math.min(45, angle));
      slopeGroup.setAttribute('transform', 'rotate(' + (-clamped) + ' 20 130)');

      const rad = angle * Math.PI/180;
      const gradePct = Math.tan(rad)*100;
      const ratio = Math.abs(Math.tan(rad)) > 0.0001 ? (1/Math.abs(Math.tan(rad))) : Infinity;

      readoutRow.innerHTML =
        '<div class="card"><div class="label">Angle</div><div class="val big">'+angle.toFixed(1)+'°</div></div>'+
        '<div class="card"><div class="label">Grade</div><div class="val big">'+gradePct.toFixed(1)+'%</div></div>'+
        '<div class="card"><div class="label">Ratio</div><div class="val">1 : '+(isFinite(ratio)? ratio.toFixed(1):'∞')+'</div></div>';

      updateCameraOverlay(crossSlopeRoll(), cls, angle.toFixed(1) + '°  ·  ' + gradePct.toFixed(1) + '%');
      lastReading = { mode:'slope', primary: angle.toFixed(1)+'°', detail: gradePct.toFixed(1)+'% · 1:'+(isFinite(ratio)?ratio.toFixed(1):'∞') };
      return;
    }

    // level & plumb share the circular bubble
    const a = state.mode === 'plumb' ? plumbAngles() : levelAngles();
    const bx = state.mode === 'plumb' ? a.leanLR : a.roll;
    const by = state.mode === 'plumb' ? a.leanFB : a.pitch;
    const mag = Math.sqrt(bx*bx + by*by);
    const cls = classify(mag);
    if(!state.moving){
      statusStrip.className = 'status ' + cls;
      statusStrip.textContent = cls==='good' ? (state.mode==='plumb'?'PLUMB':'LEVEL') : (cls==='close' ? 'ALMOST — ' + mag.toFixed(1) + '°' : 'OFF BY ' + mag.toFixed(1) + '°');
    }

    const maxTravel = 92; // px radius the dot can move
    const scale = 3.2;    // px per degree, then clamp
    let dx = bx*scale, dy = by*scale;
    const d = Math.sqrt(dx*dx+dy*dy);
    if(d > maxTravel){ const k = maxTravel/d; dx*=k; dy*=k; }
    bubbleGroup.setAttribute('transform', 'translate(' + dx.toFixed(1) + ',' + dy.toFixed(1) + ')');

    const color = cls==='good' ? 'var(--green)' : cls==='close' ? 'var(--amber)' : 'var(--red)';
    bubbleDot.setAttribute('fill', color);
    bubbleGlow.setAttribute('opacity', cls==='good' ? 0.35 : 0);

    const xLabel = state.mode==='plumb' ? 'Lean L / R' : 'Left / Right';
    const yLabel = state.mode==='plumb' ? 'Lean Fwd / Back' : 'Front / Back';

    readoutRow.innerHTML =
      '<div class="card"><div class="label">'+xLabel+'</div><div class="val">'+(bx>=0?'+':'')+bx.toFixed(1)+'°</div></div>'+
      '<div class="card"><div class="label">'+yLabel+'</div><div class="val">'+(by>=0?'+':'')+by.toFixed(1)+'°</div></div>'+
      '<div class="card"><div class="label">Off-Target</div><div class="val big">'+mag.toFixed(1)+'°</div></div>';

    updateCameraOverlay(bx, cls, mag.toFixed(1) + '°');
    lastReading = { mode: state.mode, primary: mag.toFixed(1)+'°', detail: xLabel+' '+bx.toFixed(1)+'° · '+yLabel+' '+by.toFixed(1)+'°' };
  }

  // ---------- sensor input ----------
  function handleMotion(e){
    const a = e.accelerationIncludingGravity;
    if(!a || (a.x===null && a.y===null && a.z===null)) return;
    const x = a.x||0, y = a.y||0, z = a.z||0;

    state.raw.x += (x - state.raw.x) * ALPHA;
    state.raw.y += (y - state.raw.y) * ALPHA;
    state.raw.z += (z - state.raw.z) * ALPHA;

    const mag = Math.sqrt(x*x + y*y + z*z);
    state.moving = Math.abs(mag - G) > 1.2; // real linear acceleration corrupts the tilt reading — warn instead of showing a false angle
    state.ready = true;
    render();
  }

  function startListening(){
    window.addEventListener('devicemotion', handleMotion, true);
  }

  const permBox = document.getElementById('permBox');
  const permBtn = document.getElementById('permBtn');

  function needsIOSPermission(){
    return typeof DeviceMotionEvent !== 'undefined' &&
           typeof DeviceMotionEvent.requestPermission === 'function';
  }

  if(needsIOSPermission()){
    permBox.classList.add('show');
    permBtn.addEventListener('click', ()=>{
      DeviceMotionEvent.requestPermission().then(res=>{
        if(res === 'granted'){
          permBox.classList.remove('show');
          startListening();
        } else {
          permBox.innerHTML = 'Sensor access was denied. You can re-enable it in your browser\'s site settings.';
        }
      }).catch(()=>{ permBox.innerHTML = 'Could not request sensor access on this browser.'; });
    });
  } else if(window.DeviceMotionEvent){
    startListening();
  } else {
    statusStrip.textContent = 'NO MOTION SENSOR FOUND';
  }

  document.getElementById('calibrateBtn').addEventListener('click', ()=>{
    const { x, y, z } = state.raw;
    if(state.mode === 'level'){
      state.offsets.levelRoll = Math.atan2(x, z) * 180/Math.PI;
      state.offsets.levelPitch = Math.atan2(y, z) * 180/Math.PI;
    } else if(state.mode === 'plumb'){
      state.offsets.plumbLeanLR = Math.atan2(x, y) * 180/Math.PI;
      state.offsets.plumbLeanFB = Math.atan2(z, y) * 180/Math.PI;
    } else {
      state.offsets.slopePitch = Math.atan2(y, z) * 180/Math.PI;
    }
    render();
  });
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    state.offsets = { levelRoll:0, levelPitch:0, plumbLeanLR:0, plumbLeanFB:0, slopePitch:0 };
    render();
  });

  // ---------- save reading log (professional site record-keeping) ----------
  const LOG_KEY = 'siteLevelLog_v1';
  let log = [];
  function loadLog(){ try{ const raw = JSON.parse(localStorage.getItem(LOG_KEY)); if(Array.isArray(raw)) log = raw; }catch(e){} }
  function saveLog(){ localStorage.setItem(LOG_KEY, JSON.stringify(log)); }
  loadLog();

  const saveBackdrop = document.getElementById('saveBackdrop');
  const saveDrawer = document.getElementById('saveDrawer');
  const pendingCard = document.getElementById('pendingCard');
  const saveLabel = document.getElementById('saveLabel');

  document.getElementById('saveReadingBtn').addEventListener('click', ()=>{
    if(!lastReading){ return; }
    pendingCard.innerHTML = '<span>'+state.mode.toUpperCase()+' · '+lastReading.detail+'</span><span style="color:var(--yellow); font-weight:700;">'+lastReading.primary+'</span>';
    saveLabel.value = '';
    saveBackdrop.classList.add('show'); saveDrawer.classList.add('show');
    setTimeout(()=> saveLabel.focus(), 200);
  });
  saveBackdrop.addEventListener('click', ()=>{ saveBackdrop.classList.remove('show'); saveDrawer.classList.remove('show'); });

  document.getElementById('confirmSaveBtn').addEventListener('click', ()=>{
    if(!lastReading) return;
    log.unshift({
      id: 'r_'+Date.now(),
      label: saveLabel.value.trim() || 'Untitled point',
      mode: state.mode,
      primary: lastReading.primary,
      detail: lastReading.detail,
      date: new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
    });
    saveLog();
    saveBackdrop.classList.remove('show'); saveDrawer.classList.remove('show');
  });

  // ---------- saved readings log drawer ----------
  const logBackdrop = document.getElementById('logBackdrop');
  const logDrawer = document.getElementById('logDrawer');
  const logList = document.getElementById('logList');

  function renderLog(){
    logList.innerHTML = log.length ? log.map(r=>
      '<div class="log-row">' +
        '<div class="log-left"><div class="lbl">'+escHtml(r.label)+'</div><div class="meta">'+r.mode.toUpperCase()+' · '+escHtml(r.detail)+' · '+r.date+'</div></div>' +
        '<div class="log-right"><span class="v">'+r.primary+'</span><span class="log-del" data-id="'+r.id+'">✕</span></div>' +
      '</div>'
    ).join('') : '<div class="log-empty">No readings saved yet.</div>';
    logList.querySelectorAll('.log-del').forEach(el=>{
      el.addEventListener('click', ()=>{
        log = log.filter(r=> r.id !== el.dataset.id);
        saveLog(); renderLog();
      });
    });
  }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  document.getElementById('logBtn').addEventListener('click', ()=>{
    renderLog();
    logBackdrop.classList.add('show'); logDrawer.classList.add('show');
  });
  logBackdrop.addEventListener('click', ()=>{ logBackdrop.classList.remove('show'); logDrawer.classList.remove('show'); });

  document.getElementById('homeBtn').addEventListener('click', ()=>{
    window.history.back(); // change to your home screen's filename/URL
  });

  render();
})();