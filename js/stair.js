(function(){
  const totalRise = document.getElementById('totalRise');
  const targetRiser = document.getElementById('targetRiser');
  const treadDepth = document.getElementById('treadDepth');

  function recalc(){
    const rise = Number(totalRise.value) || 0;
    const tRiser = Number(targetRiser.value) || 7.5;
    const tDepth = Number(treadDepth.value) || 10;

    if(rise <= 0){ return; }

    let riserCount = Math.round(rise / tRiser);
    if(riserCount < 1) riserCount = 1;
    const actualRiser = rise / riserCount;
    const treadCount = Math.max(0, riserCount - 1);
    const totalRun = treadCount * tDepth;
    const stringer = Math.sqrt(rise*rise + totalRun*totalRun);

    document.getElementById('riserCount').textContent = riserCount;
    document.getElementById('actualRiser').textContent = actualRiser.toFixed(2) + '"';
    document.getElementById('treadCount').textContent = treadCount;
    document.getElementById('totalRun').textContent = totalRun.toFixed(1) + '"';
    document.getElementById('stringerLen').textContent = (stringer/12).toFixed(2) + ' ft (' + stringer.toFixed(1) + '")';

    const warnBox = document.getElementById('warnBox');
    if(actualRiser > 7.75 || actualRiser < 4 || tDepth < 10){
      warnBox.className = 'warn-box show bad';
      warnBox.textContent = 'Outside common comfort range (riser ~4–7.75", tread ≥10") — many codes cap riser height and set a tread minimum. Check your local code before cutting.';
    } else {
      warnBox.className = 'warn-box show ok';
      warnBox.textContent = 'Riser height and tread depth fall inside typical comfort ranges — still confirm against your local building code.';
    }

    drawStairs(riserCount, actualRiser, tDepth);
  }

  function drawStairs(steps, riserH, treadD){
    const svg = document.getElementById('stairSvg');
    svg.innerHTML = '';
    const maxSteps = Math.min(steps, 8);
    const scaleY = 100 / (riserH*maxSteps || 1);
    const scaleX = 160 / (treadD*maxSteps || 1);
    const scale = Math.min(scaleY, scaleX, 14);
    let x = 20, y = 120;
    let path = 'M'+x+','+y;
    for(let i=0;i<maxSteps;i++){
      y -= riserH*scale*0.14;
      path += ' L'+x+','+y;
      x += treadD*scale*0.14;
      path += ' L'+x+','+y;
    }
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d', path);
    p.setAttribute('stroke', '#f2c230');
    p.setAttribute('stroke-width', '3');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke-linejoin','round');
    svg.appendChild(p);
  }

  [totalRise, targetRiser, treadDepth].forEach(el=> el.addEventListener('input', recalc));
  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  recalc();
})();