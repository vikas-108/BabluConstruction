(function(){
  // Metric (mm²) — approximate resistance in ohm/km at ~20-30°C for copper/aluminum
  const METRIC_SIZES = [
    { size:1.5, rCu:12.1, rAl:19.9 }, { size:2.5, rCu:7.41, rAl:12.2 }, { size:4, rCu:4.61, rAl:7.41 },
    { size:6, rCu:3.08, rAl:4.95 }, { size:10, rCu:1.83, rAl:2.95 }, { size:16, rCu:1.15, rAl:1.85 },
    { size:25, rCu:0.727, rAl:1.17 }, { size:35, rCu:0.524, rAl:0.843 }, { size:50, rCu:0.387, rAl:0.622 },
    { size:70, rCu:0.268, rAl:0.432 }, { size:95, rCu:0.193, rAl:0.31 }, { size:120, rCu:0.153, rAl:0.247 },
    { size:150, rCu:0.124, rAl:0.2 }, { size:185, rCu:0.0991, rAl:0.16 }, { size:240, rCu:0.0754, rAl:0.122 }
  ];
  // AWG — resistance in ohm/1000ft for copper/aluminum (standard tables)
  const AWG_SIZES = [
    { size:'14', rCu:2.525, rAl:4.14 }, { size:'12', rCu:1.588, rAl:2.6 }, { size:'10', rCu:0.999, rAl:1.63 },
    { size:'8', rCu:0.628, rAl:1.03 }, { size:'6', rCu:0.395, rAl:0.646 }, { size:'4', rCu:0.249, rAl:0.407 },
    { size:'3', rCu:0.197, rAl:0.323 }, { size:'2', rCu:0.157, rAl:0.256 }, { size:'1', rCu:0.124, rAl:0.203 },
    { size:'1/0', rCu:0.0983, rAl:0.161 }, { size:'2/0', rCu:0.078, rAl:0.128 }, { size:'3/0', rCu:0.0618, rAl:0.101 },
    { size:'4/0', rCu:0.049, rAl:0.0805 }, { size:'250 kcmil', rCu:0.0415, rAl:0.068 }, { size:'350 kcmil', rCu:0.0296, rAl:0.049 },
    { size:'500 kcmil', rCu:0.0206, rAl:0.0347 }
  ];

  let unit = 'metric';
  const loadA = document.getElementById('loadA');
  const voltage = document.getElementById('voltage');
  const lengthM = document.getElementById('lengthM');
  const phase = document.getElementById('phase');
  const material = document.getElementById('material');
  const wireSize = document.getElementById('wireSize');

  function currentTable(){ return unit === 'metric' ? METRIC_SIZES : AWG_SIZES; }

  function populateSizes(){
    const table = currentTable();
    wireSize.innerHTML = table.map(function(s){ return '<option value="'+s.size+'">'+s.size+(unit==='metric'?' mm²':' AWG')+'</option>'; }).join('');
    wireSize.selectedIndex = Math.min(4, table.length-1);
  }

  document.querySelectorAll('.mode-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.mode-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      unit = tab.dataset.unit;
      populateSizes();
      recalc();
    });
  });

  function recalc(){
    const table = currentTable();
    const entry = table.find(function(s){ return String(s.size) === wireSize.value; });
    if(!entry) return;

    const I = Number(loadA.value) || 0;
    const V = Number(voltage.value) || 1;
    const L = Number(lengthM.value) || 0;
    const ph = Number(phase.value);
    const rPerUnit = material.value === 'cu' ? entry.rCu : entry.rAl;

    let vd;
    if(unit === 'metric'){
      // R in ohm/km -> ohm/m
      const rPerM = rPerUnit/1000;
      const factor = ph === 3 ? Math.sqrt(3) : 2; // 3-phase: sqrt3 * I * R * L ; 1-phase: 2 * I * R * L (out and back)
      vd = factor * I * rPerM * L;
    } else {
      // R in ohm/1000ft -> convert length in meters to feet
      const Lft = L * 3.28084;
      const rPerFt = rPerUnit/1000;
      const factor = ph === 3 ? Math.sqrt(3) : 2;
      vd = factor * I * rPerFt * Lft;
    }

    const vdPct = (vd/V)*100;
    const atLoad = V - vd;

    document.getElementById('vdVolts').textContent = vd.toFixed(2) + ' V';
    document.getElementById('voltAtLoad').textContent = atLoad.toFixed(1) + ' V';

    const resultBox = document.getElementById('resultBox');
    const vdVal = document.getElementById('vdVal');
    vdVal.textContent = vdPct.toFixed(2) + '%';
    resultBox.className = 'result-box ' + (vdPct <= 3 ? 'ok' : vdPct <= 5 ? 'warn' : 'bad');

    // Recommend minimum size for <=3% drop
    let recommended = null;
    for(let i=0;i<table.length;i++){
      const e = table[i];
      const r = material.value === 'cu' ? e.rCu : e.rAl;
      let testVd;
      if(unit === 'metric'){
        const factor = ph === 3 ? Math.sqrt(3) : 2;
        testVd = factor * I * (r/1000) * L;
      } else {
        const Lft = L * 3.28084;
        const factor = ph === 3 ? Math.sqrt(3) : 2;
        testVd = factor * I * (r/1000) * Lft;
      }
      if((testVd/V)*100 <= 3){ recommended = e.size; break; }
    }
    const recommendBox = document.getElementById('recommendBox');
    if(recommended){
      recommendBox.innerHTML = 'For ≤3% drop at this length &amp; load, minimum size is <b>' + recommended + (unit==='metric'?' mm²':' AWG') + '</b>';
    } else {
      recommendBox.textContent = 'No size in this table keeps drop under 3% at this length — consider shortening the run or increasing voltage.';
    }
  }

  [loadA, voltage, lengthM, phase, material, wireSize].forEach(function(el){ el.addEventListener('input', recalc); });
  populateSizes();
  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  recalc();
})();