(function(){
  const ring = document.getElementById('ring');
  const deltaVal = document.getElementById('deltaVal');
  const statusPill = document.getElementById('statusPill');
  const supportMsg = document.getElementById('supportMsg');
  const startBtn = document.getElementById('startBtn');
  const baselineBtn = document.getElementById('baselineBtn');

  let sensor = null;
  let running = false;
  let baseline = null;
  let readings = [];
  const CIRC = 597; // 2*pi*95

  function magnitude(x,y,z){ return Math.sqrt(x*x+y*y+z*z); }

  function updateUI(mag){
    if(baseline === null) baseline = mag;
    const deltaPct = ((mag - baseline) / baseline) * 100;
    const clamped = Math.max(0, Math.min(100, deltaPct));
    ring.setAttribute('stroke-dasharray', (clamped/100*CIRC) + ' ' + CIRC);
    deltaVal.textContent = deltaPct.toFixed(0) + '%';

    if(deltaPct > 25){
      statusPill.className = 'status-pill hit';
      statusPill.textContent = '⚠ Metal likely nearby';
      ring.setAttribute('stroke', '#ff5347');
    } else {
      statusPill.className = 'status-pill';
      statusPill.textContent = 'Sweep slowly across the wall';
      ring.setAttribute('stroke', '#f2c230');
    }
  }

  function tryMagnetometer(){
    if(typeof Magnetometer === 'undefined'){
      showUnsupported("This browser doesn't support the Magnetometer sensor API. Try Chrome on Android.");
      return;
    }
    try{
      sensor = new Magnetometer({ frequency: 30 });
      sensor.addEventListener('reading', ()=>{
        const mag = magnitude(sensor.x||0, sensor.y||0, sensor.z||0);
        readings.push(mag);
        if(readings.length > 5) readings.shift();
        const avg = readings.reduce((a,b)=>a+b,0)/readings.length;
        updateUI(avg);
      });
      sensor.addEventListener('error', (e)=>{
        if(e.error && e.error.name === 'NotAllowedError'){
          showUnsupported('Sensor permission was denied. You can allow it in your browser\'s site settings.');
        } else {
          showUnsupported('Could not read the magnetometer on this device.');
        }
      });
      sensor.start();
      running = true;
      startBtn.textContent = 'Stop';
      statusPill.textContent = 'Reading…';
    }catch(err){
      showUnsupported('Magnetometer access needs HTTPS and a supported browser (Chrome on Android).');
    }
  }

  function showUnsupported(msg){
    supportMsg.textContent = msg;
    supportMsg.classList.add('show');
    statusPill.textContent = 'Not available on this device';
    startBtn.disabled = true;
    startBtn.style.opacity = '.5';
  }

  startBtn.addEventListener('click', ()=>{
    if(running){
      if(sensor) sensor.stop();
      running = false;
      startBtn.textContent = 'Start';
      statusPill.textContent = 'Stopped';
      return;
    }
    tryMagnetometer();
  });

  baselineBtn.addEventListener('click', ()=>{
    baseline = readings.length ? readings[readings.length-1] : null;
  });

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
})();