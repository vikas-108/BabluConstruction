(function(){
  const luxVal = document.getElementById('luxVal');
  const readoutLabel = document.querySelector('.readout-label');
  const barFill = document.getElementById('barFill');
  const meterCard = document.getElementById('meterCard');
  const unsupportedBox = document.getElementById('unsupportedBox');

  function showUnsupported(msg){
    meterCard.style.display = 'none';
    unsupportedBox.classList.add('show');
    if(msg) unsupportedBox.textContent = msg;
  }

  function updateReading(lux){
    luxVal.textContent = Math.round(lux).toLocaleString();
    readoutLabel.textContent = 'live reading';
    const pct = Math.min(100, (Math.log10(lux+1)/Math.log10(30000))*100);
    barFill.style.width = pct + '%';
  }

  async function start(){
    if(typeof AmbientLightSensor === 'undefined'){
      showUnsupported();
      return;
    }
    try{
      if(navigator.permissions){
        try{
          const status = await navigator.permissions.query({ name:'ambient-light-sensor' });
          if(status.state === 'denied'){ showUnsupported('Ambient light sensor permission was denied.'); return; }
        }catch(e){ /* permission name not recognized — proceed and let the sensor itself fail if unsupported */ }
      }
      const sensor = new AmbientLightSensor({ frequency:5 });
      sensor.addEventListener('reading', ()=> updateReading(sensor.illuminance));
      sensor.addEventListener('error', (e)=>{
        showUnsupported(e.error && e.error.name === 'NotAllowedError'
          ? 'Sensor access was blocked — check site permissions.'
          : "This device reports an ambient light sensor, but reading it failed.");
      });
      sensor.start();
    }catch(err){
      showUnsupported();
    }
  }

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  start();
})();