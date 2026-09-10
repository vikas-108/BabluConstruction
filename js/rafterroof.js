(function(){
  let pitchMode = 'rise12';

  document.querySelectorAll('.pitch-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.pitch-tab').forEach(t=> t.classList.remove('active'));
      tab.classList.add('active');
      pitchMode = tab.dataset.pitch;
      document.getElementById('rise12Panel').style.display = pitchMode==='rise12' ? 'block' : 'none';
      document.getElementById('degreesPanel').style.display = pitchMode==='degrees' ? 'block' : 'none';
      recalc();
    });
  });

  const riseIn12 = document.getElementById('riseIn12');
  const degreesIn = document.getElementById('degreesIn');
  const runFt = document.getElementById('runFt');
  const overhangIn = document.getElementById('overhangIn');

  function recalc(){
    let angleDeg;
    if(pitchMode === 'rise12'){
      const r = Number(riseIn12.value) || 0;
      angleDeg = Math.atan(r/12) * 180/Math.PI;
    } else {
      angleDeg = Number(degreesIn.value) || 0;
    }
    const angleRad = angleDeg * Math.PI/180;
    const rise12Equiv = Math.tan(angleRad) * 12;

    const run = (Number(runFt.value)||0) * 12; // to inches
    const overhang = Number(overhangIn.value) || 0;
    const totalRun = run + overhang;
    const rafterLength = totalRun / Math.cos(angleRad);
    const ridgeGain = run * Math.tan(angleRad);

    document.getElementById('angleVal').textContent = angleDeg.toFixed(1) + '°';
    document.getElementById('rise12Val').textContent = rise12Equiv.toFixed(2) + '" / 12"';
    document.getElementById('rafterLen').textContent = (rafterLength/12).toFixed(2) + ' ft (' + rafterLength.toFixed(1) + '")';
    document.getElementById('ridgeHeight').textContent = (ridgeGain/12).toFixed(2) + ' ft';
    document.getElementById('plumbCut').textContent = angleDeg.toFixed(1) + '° from vertical';

    drawRoof(angleDeg);
  }

  function drawRoof(angleDeg){
    const svg = document.getElementById('roofSvg');
    svg.innerHTML = '';
    const baseY = 100, leftX = 20, rightX = 200, peakY = Math.max(15, baseY - Math.tan(angleDeg*Math.PI/180)*90);
    const midX = (leftX+rightX)/2;
    const path = 'M'+leftX+','+baseY+' L'+midX+','+peakY+' L'+rightX+','+baseY;
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d', path); p.setAttribute('stroke','#f2c230'); p.setAttribute('stroke-width','3');
    p.setAttribute('fill','none'); p.setAttribute('stroke-linejoin','round');
    svg.appendChild(p);
    const base = document.createElementNS('http://www.w3.org/2000/svg','line');
    base.setAttribute('x1',leftX); base.setAttribute('y1',baseY); base.setAttribute('x2',rightX); base.setAttribute('y2',baseY);
    base.setAttribute('stroke','#3a4147'); base.setAttribute('stroke-width','2'); base.setAttribute('stroke-dasharray','4 3');
    svg.appendChild(base);
  }

  [riseIn12, degreesIn, runFt, overhangIn].forEach(el=> el.addEventListener('input', recalc));
  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  recalc();
})();