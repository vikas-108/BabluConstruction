(function(){
  const state = { mode:'level', betaOffset:0, gammaOffset:0, rawBeta:0, rawGamma:0, smBeta:0, smGamma:0, ready:false };
  const camState = { active:false, stream:null };
  const ALPHA = 0.18; // smoothing factor

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
      state.betaOffset = 0; state.gammaOffset = 0;
      updateStageVisibility();
      refBox.classList.toggle('show', state.mode === 'slope');
      render();
    });
  });

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

  function correctedBeta(){
    let b = state.smBeta - state.betaOffset;
    if(state.mode === 'plumb') b = b - 90;
    return b;
  }
  function correctedGamma(){
    return state.smGamma - state.gammaOffset;
  }

  function classify(mag){
    if(mag <= 0.5) return 'good';
    if(mag <= 2) return 'close';
    return 'off';
  }

  function render(){
    if(!state.ready){
      statusStrip.className = 'status';
      statusStrip.textContent = 'WAITING FOR SENSORS…';
      return;
    }

    if(state.mode === 'slope'){
      const angle = correctedBeta();
      const mag = Math.abs(angle);
      const cls = classify(mag);
      statusStrip.className = 'status ' + (mag<=0.5?'good':mag<=2?'close':'off');
      statusStrip.textContent = mag<=0.5 ? 'FLAT / ZERO GRADE' : (angle>0? 'RISING':'FALLING') + ' — ' + mag.toFixed(1) + '°';

      const clamped = Math.max(-45, Math.min(45, angle));
      slopeGroup.setAttribute('transform', 'rotate(' + (-clamped) + ' 20 130)');

      const rad = angle * Math.PI/180;
      const gradePct = Math.tan(rad)*100;
      const ratio = Math.abs(Math.tan(rad)) > 0.0001 ? (1/Math.abs(Math.tan(rad))) : Infinity;

      readoutRow.innerHTML =
        '<div class="card"><div class="label">Angle</div><div class="val big">'+angle.toFixed(1)+'°</div></div>'+
        '<div class="card"><div class="label">Grade</div><div class="val big">'+gradePct.toFixed(1)+'%</div></div>'+
        '<div class="card"><div class="label">Ratio</div><div class="val">1 : '+(isFinite(ratio)? ratio.toFixed(1):'∞')+'</div></div>';

      updateCameraOverlay(correctedGamma(), cls, angle.toFixed(1) + '°  ·  ' + gradePct.toFixed(1) + '%');
      return;
    }

    // level & plumb share the circular bubble
    const bx = correctedGamma();
    const by = correctedBeta();
    const mag = Math.sqrt(bx*bx + by*by);
    const cls = classify(mag);
    statusStrip.className = 'status ' + cls;
    statusStrip.textContent = cls==='good' ? (state.mode==='plumb'?'PLUMB':'LEVEL') : (cls==='close' ? 'ALMOST — ' + mag.toFixed(1) + '°' : 'OFF BY ' + mag.toFixed(1) + '°');

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
  }

  function handleOrientation(e){
    if(e.beta === null || e.gamma === null) return;
    state.rawBeta = e.beta;
    state.rawGamma = e.gamma;
    state.smBeta += (state.rawBeta - state.smBeta) * ALPHA;
    state.smGamma += (state.rawGamma - state.smGamma) * ALPHA;
    state.ready = true;
    render();
  }

  function startListening(){
    window.addEventListener('deviceorientation', handleOrientation, true);
  }

  const permBox = document.getElementById('permBox');
  const permBtn = document.getElementById('permBtn');

  function needsIOSPermission(){
    return typeof DeviceOrientationEvent !== 'undefined' &&
           typeof DeviceOrientationEvent.requestPermission === 'function';
  }

  if(needsIOSPermission()){
    permBox.classList.add('show');
    permBtn.addEventListener('click', ()=>{
      DeviceOrientationEvent.requestPermission().then(res=>{
        if(res === 'granted'){
          permBox.classList.remove('show');
          startListening();
        } else {
          permBox.innerHTML = 'Sensor access was denied. You can re-enable it in your browser\'s site settings.';
        }
      }).catch(()=>{ permBox.innerHTML = 'Could not request sensor access on this browser.'; });
    });
  } else if(window.DeviceOrientationEvent){
    startListening();
  } else {
    statusStrip.textContent = 'NO ORIENTATION SENSOR FOUND';
  }

  document.getElementById('calibrateBtn').addEventListener('click', ()=>{
    state.betaOffset = state.smBeta - (state.mode==='plumb' ? 90 : 0);
    state.gammaOffset = state.smGamma;
    render();
  });
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    state.betaOffset = 0; state.gammaOffset = 0; render();
  });

  render();
})();