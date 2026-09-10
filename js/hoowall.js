(function(){
  const permBox = document.getElementById('permBox');
  const permBtn = document.getElementById('permBtn');
  let audioCtx, analyser, stream, dataArray;
  let armed = null; // 'A' or 'B' — waiting to catch the next knock
  let lastLevel = 0;

  const canvasA = document.getElementById('canvasA');
  const canvasB = document.getElementById('canvasB');
  [canvasA, canvasB].forEach(c=>{ c.width = c.clientWidth * 2; c.height = c.clientHeight * 2; });

  async function ensureAudio(){
    if(audioCtx) return true;
    try{
      stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Uint8Array(analyser.fftSize);
      source.connect(analyser);
      permBox.classList.remove('show');
      monitorForKnock();
      return true;
    }catch(err){
      permBox.classList.add('show');
      permBox.innerHTML = 'Microphone access denied — check site permissions.';
      return false;
    }
  }

  function currentLevel(){
    analyser.getByteTimeDomainData(dataArray);
    let sum = 0;
    for(let i=0;i<dataArray.length;i++){ const v=(dataArray[i]-128)/128; sum += v*v; }
    return Math.sqrt(sum/dataArray.length);
  }

  function monitorForKnock(){
    requestAnimationFrame(monitorForKnock);
    if(!armed) return;
    const level = currentLevel();
    if(level > 0.15 && level > lastLevel*1.8){
      captureKnock(armed);
      armed = null;
    }
    lastLevel = level;
  }

  function captureKnock(slot){
    const canvas = slot === 'A' ? canvasA : canvasB;
    const btn = slot === 'A' ? document.getElementById('btnA') : document.getElementById('btnB');
    btn.classList.remove('recording');
    btn.textContent = slot === 'A' ? 'Record Knock A' : 'Record Knock B';

    const samples = [];
    let frames = 0;
    function capture(){
      analyser.getByteTimeDomainData(dataArray);
      samples.push(Uint8Array.from(dataArray));
      frames++;
      if(frames < 6){ requestAnimationFrame(capture); }
      else { drawWaveform(canvas, samples); }
    }
    capture();
  }

  function drawWaveform(canvas, samplesFrames){
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#14171a'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = '#f2c230'; ctx.lineWidth = 2; ctx.beginPath();
    const allSamples = [].concat(...samplesFrames.map(f=> Array.from(f)));
    const step = allSamples.length / w;
    for(let x=0; x<w; x++){
      const v = allSamples[Math.floor(x*step)] || 128;
      const y = (v/255)*h;
      if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }

  function armSlot(slot){
    ensureAudio().then(ok=>{
      if(!ok) return;
      armed = slot;
      const btn = slot === 'A' ? document.getElementById('btnA') : document.getElementById('btnB');
      btn.classList.add('recording');
      btn.textContent = 'Listening… knock now';
      lastLevel = 0;
    });
  }

  document.getElementById('btnA').addEventListener('click', ()=> armSlot('A'));
  document.getElementById('btnB').addEventListener('click', ()=> armSlot('B'));

  document.getElementById('exitBtn').addEventListener('click', ()=>{
    if(stream) stream.getTracks().forEach(t=> t.stop());
    window.history.back();
  });
})();