(function(){
  const fieldVal = document.getElementById('fieldVal');
  const barFill = document.getElementById('barFill');
  const permBox = document.getElementById('permBox');
  const permBtn = document.getElementById('permBtn');
  const unsupportedBox = document.getElementById('unsupportedBox');
  const meterCard = document.getElementById('meterCard');

  let baseline = 0;
  let sensor = null;

  function showUnsupported(){
    unsupportedBox.classList.add('show');
    meterCard.style.display = 'none';
    permBox.classList.remove('show');
  }

  function updateReading(magnitude){
    const relative = Math.max(0, magnitude - baseline);
    fieldVal.textContent = magnitude.toFixed(1);
    const pct = Math.min(100, (relative/80)*100);
    barFill.style.width = pct + '%';
    barFill.style.background = pct > 60 ? 'var(--red)' : pct > 25 ? 'var(--amber)' : 'var(--electric)';
  }

  function startSensor(){
    try{
      sensor = new Magnetometer({ frequency: 20 });
      sensor.addEventListener('reading', function(){
        const mag = Math.sqrt(sensor.x*sensor.x + sensor.y*sensor.y + sensor.z*sensor.z);
        updateReading(mag);
      });
      sensor.addEventListener('error', function(e){
        showUnsupported();
      });
      sensor.start();
    }catch(err){
      showUnsupported();
    }
  }

  async function init(){
    if(typeof Magnetometer === 'undefined'){ showUnsupported(); return; }
    if(navigator.permissions){
      try{
        const status = await navigator.permissions.query({ name:'magnetometer' });
        if(status.state === 'granted'){ startSensor(); return; }
        if(status.state === 'prompt'){ permBox.classList.add('show'); return; }
        if(status.state === 'denied'){ showUnsupported(); return; }
      }catch(e){
        permBox.classList.add('show');
        return;
      }
    } else {
      permBox.classList.add('show');
    }
  }

  permBtn.addEventListener('click', function(){
    permBox.classList.remove('show');
    startSensor();
  });

  document.getElementById('calibBtn').addEventListener('click', function(){
    const current = Number(fieldVal.textContent) || 0;
    baseline = current;
  });

  document.getElementById('exitBtn').addEventListener('click', function(){
    if(sensor) sensor.stop();
    window.history.back();
  });

  init();
})();