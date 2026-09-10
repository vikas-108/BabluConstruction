(function(){
  let mode = 'ratio';
  let lastEdited = 'drawing';

  const ratioN = document.getElementById('ratioN');
  const archFrac = document.getElementById('archFrac');
  const drawingVal = document.getElementById('drawingVal');
  const drawingUnit = document.getElementById('drawingUnit');
  const realVal = document.getElementById('realVal');
  const realUnit = document.getElementById('realUnit');

  const RATIO_PRESETS = [10,20,50,100,200,500,1000,2000];
  const ARCH_PRESETS = [
    { label:'1/16"', frac:1/16 }, { label:'1/8"', frac:1/8 }, { label:'3/16"', frac:3/16 }, { label:'1/4"', frac:1/4 },
    { label:'3/8"', frac:3/8 }, { label:'1/2"', frac:1/2 }, { label:'3/4"', frac:3/4 }, { label:'1"', frac:1 }
  ];

  const ratioPresets = document.getElementById('ratioPresets');
  RATIO_PRESETS.forEach(function(n){
    const btn = document.createElement('div');
    btn.className = 'preset-btn';
    btn.textContent = '1:'+n;
    btn.addEventListener('click', function(){ ratioN.value = n; update(); });
    ratioPresets.appendChild(btn);
  });
  const archPresets = document.getElementById('archPresets');
  ARCH_PRESETS.forEach(function(p){
    const btn = document.createElement('div');
    btn.className = 'preset-btn';
    btn.textContent = p.label;
    btn.addEventListener('click', function(){ archFrac.value = fracToString(p.frac); update(); });
    archPresets.appendChild(btn);
  });

  function fracToString(dec){
    const map = {0.0625:'1/16',0.125:'1/8',0.1875:'3/16',0.25:'1/4',0.375:'3/8',0.5:'1/2',0.75:'3/4',1:'1'};
    return map[dec] || String(dec);
  }
  function parseFraction(str){
    str = String(str).trim();
    if(str.indexOf('/') > -1){
      const parts = str.split('/');
      return (Number(parts[0])||0) / (Number(parts[1])||1);
    }
    return Number(str) || 0;
  }

  document.querySelectorAll('.mode-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.mode-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      mode = tab.dataset.mode;
      document.getElementById('ratioPanel').style.display = mode==='ratio' ? 'block' : 'none';
      document.getElementById('archPanel').style.display = mode==='arch' ? 'block' : 'none';
      update();
    });
  });

  // scaleFactor = how many real-world mm per 1 drawing mm
  function getScaleFactor(){
    if(mode === 'ratio'){
      return Number(ratioN.value) || 1;
    } else {
      const inchesPerFoot = parseFraction(archFrac.value) || 0.25;
      return 12 / inchesPerFoot;
    }
  }

  function toMM(val, unit){
    if(unit === 'mm') return val;
    if(unit === 'cm') return val*10;
    if(unit === 'in') return val*25.4;
    if(unit === 'm') return val*1000;
    if(unit === 'ft') return val*304.8;
    return val;
  }
  function fromMM(mm, unit){
    if(unit === 'mm') return mm;
    if(unit === 'cm') return mm/10;
    if(unit === 'in') return mm/25.4;
    if(unit === 'm') return mm/1000;
    if(unit === 'ft') return mm/304.8;
    return mm;
  }
  function mmToFtIn(mm){
    const totalIn = mm/25.4;
    const ft = Math.floor(totalIn/12);
    const inch = totalIn - ft*12;
    return ft + "'-" + inch.toFixed(1) + '"';
  }

  function round(n){ return Math.round(n*1000)/1000; }

  function update(){
    const scale = getScaleFactor();

    if(lastEdited === 'drawing'){
      const drawMM = toMM(Number(drawingVal.value)||0, drawingUnit.value);
      const realMM = drawMM * scale;
      if(realUnit.value !== 'ftin'){
        realVal.value = round(fromMM(realMM, realUnit.value));
      }
      document.getElementById('resultLabel').textContent = 'Real world size';
      document.getElementById('resultVal').textContent = realUnit.value==='ftin' ? mmToFtIn(realMM) : (round(fromMM(realMM, realUnit.value)) + ' ' + realUnit.value);
    } else {
      let realMM;
      if(realUnit.value === 'ftin'){
        realMM = toMM(Number(realVal.value)||0, 'ft');
      } else {
        realMM = toMM(Number(realVal.value)||0, realUnit.value);
      }
      const drawMM = realMM / scale;
      drawingVal.value = round(fromMM(drawMM, drawingUnit.value));
      document.getElementById('resultLabel').textContent = 'On the drawing';
      document.getElementById('resultVal').textContent = round(fromMM(drawMM, drawingUnit.value)) + ' ' + drawingUnit.value;
    }
  }

  [ratioN, archFrac, drawingUnit, realUnit].forEach(function(el){ el.addEventListener('input', update); });
  drawingVal.addEventListener('input', function(){ lastEdited = 'drawing'; update(); });
  realVal.addEventListener('input', function(){ lastEdited = 'real'; update(); });

  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  update();
})();