(function(){
  const readoutBig = document.getElementById('readoutBig');
  const readoutSub = document.getElementById('readoutSub');
  const gaugeFill = document.getElementById('gaugeFill');
  const needle = document.getElementById('needle');
  const permBox = document.getElementById('permBox');
  const permBtn = document.getElementById('permBtn');

  let axis = 'beta'; // 'beta' = flat on a surface (pitch), 'gamma' = standing upright (roll)
  let raw = { beta:0, gamma:0 };
  let smoothed = { beta:0, gamma:0 };
  let ready = false;
  let zeroOffset = 0;
  let held = false;
  let heldValue = 0;
  const ALPHA = 0.15;

  document.querySelectorAll('.axis-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.axis-tab').forEach(t=> t.classList.remove('active'));
      tab.classList.add('active');
      axis = tab.dataset.axis;
      zeroOffset = 0;
      render();
    });
  });

  function currentRawAngle(){
    return axis === 'beta' ? smoothed.beta : smoothed.gamma;
  }

  function handleOrientation(e){
    if(e.beta === null || e.gamma === null) return;
    raw.beta = e.beta; raw.gamma = e.gamma;
    smoothed.beta += (raw.beta - smoothed.beta) * ALPHA;
    smoothed.gamma += (raw.gamma - smoothed.gamma) * ALPHA;
    ready = true;
    render();
  }

  function needsIOSPermission(){
    return typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';
  }
  function startListening(){
    window.addEventListener('deviceorientation', handleOrientation, true);
  }
  if(needsIOSPermission()){
    permBox.classList.add('show');
    permBtn.addEventListener('click', ()=>{
      DeviceOrientationEvent.requestPermission().then(res=>{
        if(res === 'granted'){ permBox.classList.remove('show'); startListening(); }
        else { permBox.innerHTML = "Sensor access was denied — you can re-enable it in your browser's site settings."; }
      }).catch(()=>{ permBox.innerHTML = 'Could not request sensor access on this browser.'; });
    });
  } else if(window.DeviceOrientationEvent){
    startListening();
  } else {
    readoutSub.textContent = 'No orientation sensor found on this device';
  }

  document.getElementById('zeroBtn').addEventListener('click', ()=>{
    zeroOffset = currentRawAngle();
    held = false;
    document.getElementById('holdBtn').classList.remove('active');
  });
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    zeroOffset = 0;
    held = false;
    document.getElementById('holdBtn').classList.remove('active');
  });
  document.getElementById('holdBtn').addEventListener('click', function(){
    held = !held;
    this.classList.toggle('active', held);
    if(held) heldValue = currentRawAngle() - zeroOffset;
  });

  function render(){
    if(!ready){ readoutSub.textContent = 'Reading sensor…'; return; }
    const displayAngle = held ? heldValue : (currentRawAngle() - zeroOffset);
    const mag = Math.abs(displayAngle);

    readoutBig.textContent = (displayAngle >= 0 ? '' : '−') + mag.toFixed(1) + '°';
    readoutBig.className = 'readout-big ' + (mag <= 0.3 ? 'zero' : 'normal');
    readoutSub.textContent = zeroOffset !== 0
      ? (mag <= 0.3 ? 'Matches your zero reference' : 'Relative to your zero reference')
      : (axis === 'beta' ? 'Front-back tilt from flat' : 'Left-right tilt from vertical');

    const clamped = Math.max(-90, Math.min(90, displayAngle));
    const sweep = ((clamped+90)/180) * 314;
    gaugeFill.setAttribute('stroke-dasharray', sweep + ' 400');
    const needleRad = (clamped - 90) * Math.PI/180;
    needle.setAttribute('x2', 120 + 78*Math.cos(needleRad));
    needle.setAttribute('y2', 120 + 78*Math.sin(needleRad));
  }

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
})();