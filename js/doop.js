(function(){
  const torchBtn = document.getElementById('torchBtn');
  const statusLabel = document.getElementById('statusLabel');
  const msgBox = document.getElementById('msgBox');

  let stream = null, track = null, torchOn = false, supported = null;

  async function ensureStream(){
    if(stream) return true;
    try{
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:{ ideal:'environment' } } });
      track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities ? track.getCapabilities() : {};
      supported = !!(caps && caps.torch);
      if(!supported){
        msgBox.className = 'msg-box show';
        msgBox.textContent = "This browser exposed the camera, but not torch control. Your phone's native flashlight toggle (Control Center / Quick Settings) will work instead.";
      }
      return true;
    }catch(err){
      msgBox.className = 'msg-box show';
      msgBox.textContent = 'Camera access denied — check site permissions to use the flash.';
      return false;
    }
  }

  torchBtn.addEventListener('click', async ()=>{
    const ok = await ensureStream();
    if(!ok || !supported) return;
    torchOn = !torchOn;
    try{
      await track.applyConstraints({ advanced: [{ torch: torchOn }] });
      document.body.classList.toggle('torch-on', torchOn);
      torchBtn.classList.toggle('on', torchOn);
      statusLabel.textContent = torchOn ? 'On — tap to turn off' : 'Tap to turn on';
      statusLabel.classList.toggle('on', torchOn);
    }catch(err){
      msgBox.className = 'msg-box show';
      msgBox.textContent = 'Could not toggle the torch on this device.';
      torchOn = !torchOn;
    }
  });

  document.getElementById('exitBtn').addEventListener('click', ()=>{
    if(stream) stream.getTracks().forEach(t=> t.stop());
    window.history.back();
  });
})();