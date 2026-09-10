(function(){
  const angleSlider = document.getElementById('angleSlider');
  const angleVal = document.getElementById('angleVal');
  const miterVal = document.getElementById('miterVal');
  const bevelVal = document.getElementById('bevelVal');
  const miterNote = document.getElementById('miterNote');
  const wallA = document.getElementById('wallA');
  const wallB = document.getElementById('wallB');
  const miterLine = document.getElementById('miterLine');
  let cornerType = 'inside';

  const PRESETS = [90, 120, 135, 108, 145];
  const presetRow = document.getElementById('presetRow');
  PRESETS.forEach(p=>{
    const btn = document.createElement('div');
    btn.className = 'preset-btn';
    btn.textContent = p + '°';
    btn.addEventListener('click', ()=>{ angleSlider.value = p; update(); });
    presetRow.appendChild(btn);
  });

  document.querySelectorAll('.corner-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.corner-tab').forEach(t=> t.classList.remove('active'));
      tab.classList.add('active');
      cornerType = tab.dataset.type;
      update();
    });
  });

  function drawDiagram(cornerDeg){
    const cx = 90, cy = 100, len = 70;
    const halfRad = (cornerDeg/2) * Math.PI/180;
    // two walls meeting, symmetric around vertical axis, opening = cornerDeg
    const ax = cx - len*Math.sin(halfRad), ay = cy - len*Math.cos(halfRad);
    const bx = cx + len*Math.sin(halfRad), by = cy - len*Math.cos(halfRad);
    wallA.setAttribute('d', 'M'+cx+','+cy+' L'+ax+','+ay);
    wallB.setAttribute('d', 'M'+cx+','+cy+' L'+bx+','+by);
    miterLine.setAttribute('d', 'M'+cx+','+cy+' L'+cx+',10');
  }

  function update(){
    const corner = Number(angleSlider.value);
    angleVal.textContent = corner;
    const miter = corner/2;
    miterVal.textContent = miter.toFixed(1) + '°';
    bevelVal.textContent = '0°';
    miterNote.textContent = miter.toFixed(1) + '°';
    drawDiagram(corner);
  }
  angleSlider.addEventListener('input', update);

  const refTable = document.getElementById('refTable');
  [90,108,120,135,140,145,150].forEach(c=>{
    const row = document.createElement('div');
    row.className = 'ref-row';
    row.innerHTML = '<span>'+c+'° corner</span><span>'+(c/2).toFixed(1)+'° miter each side</span>';
    refTable.appendChild(row);
  });

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  update();
})();