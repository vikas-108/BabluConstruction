 
(function(){
  const dbBig = document.getElementById('dbBig');
  const barFill = document.getElementById('barFill');
  const barPeak = document.getElementById('barPeak');
  const peakVal = document.getElementById('peakVal');
  const avgVal = document.getElementById('avgVal');
  const startBtn = document.getElementById('startBtn');

  let audioCtx = null, analyser = null, dataArray = null, source = null, stream = null;
  let running = false;
  let peakDb = -100;
  let history = [];
  let rafId = null;

  function rmsToDb(rms){
    // rough, uncalibrated mapping: full-scale RMS ~1.0 -> ~100dB ceiling
    const db = 20 * Math.log10(rms || 0.00001) + 100;
    return Math.max(20, Math.min(120, db));
  }

  async function start(){
    try{
      stream = await navigator.mediaDevices.getUserMedia({ audio:{ echoCancellation:false, noiseSuppression:false, autoGainControl:false } });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Float32Array(analyser.fftSize);
      source.connect(analyser);
      running = true;
      startBtn.textContent = 'Stop';
      loop();
    }catch(err){
      dbBig.textContent = 'No mic access';
    }
  }

  function stop(){
    running = false;
    if(rafId) cancelAnimationFrame(rafId);
    if(stream) stream.getTracks().forEach(t=> t.stop());
    if(audioCtx) audioCtx.close();
    startBtn.textContent = 'Start';
  }

  function loop(){
    if(!running) return;
    analyser.getFloatTimeDomainData(dataArray);
    let sumSq = 0;
    for(let i=0;i<dataArray.length;i++) sumSq += dataArray[i]*dataArray[i];
    const rms = Math.sqrt(sumSq/dataArray.length);
    const db = rmsToDb(rms);

    history.push(db);
    if(history.length > 30) history.shift();
    const avg = history.reduce((a,b)=>a+b,0)/history.length;
    if(db > peakDb) peakDb = db;

    const pct = (db-20)/(120-20)*100;
    barFill.style.width = pct + '%';
    barPeak.style.left = ((peakDb-20)/(120-20)*100) + '%';

    dbBig.textContent = db.toFixed(0);
    dbBig.className = 'db-big ' + (db < 55 ? 'quiet' : db < 80 ? 'moderate' : 'loud');
    peakVal.textContent = peakDb.toFixed(0) + ' dB';
    avgVal.textContent = avg.toFixed(0) + ' dB';

    rafId = requestAnimationFrame(loop);
  }

  startBtn.addEventListener('click', ()=>{ running ? stop() : start(); });
  document.getElementById('resetPeakBtn').addEventListener('click', ()=>{ peakDb = -100; });
  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
})();