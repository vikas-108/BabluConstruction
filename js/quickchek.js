(function(){
  const rampRise = document.getElementById('rampRise');
  const rampRun = document.getElementById('rampRun');
  const doorWidth = document.getElementById('doorWidth');

  function checkRamp(){
    const rise = Number(rampRise.value)||0;
    const run = Number(rampRun.value)||0;
    const box = document.getElementById('rampResult');
    if(run <= 0){ box.className='result-box fail'; box.innerHTML='<span class="k">Slope</span><span class="v">—</span>'; return; }
    const ratio = run/rise;
    const slopePct = (rise/run*100);
    const pass = ratio >= 12; // 1:12 or gentler
    box.className = 'result-box ' + (pass ? 'pass' : 'fail');
    box.innerHTML = '<span class="k">'+(pass?'Meets 1:12 max':'Steeper than 1:12')+'</span><span class="v">1:'+ratio.toFixed(1)+' ('+slopePct.toFixed(1)+'%)</span>';
  }

  function checkDoor(){
    const w = Number(doorWidth.value)||0;
    const box = document.getElementById('doorResult');
    const pass = w >= 32;
    box.className = 'result-box ' + (pass ? 'pass' : 'fail');
    box.innerHTML = '<span class="k">'+(pass?'Meets minimum':'Below minimum')+'</span><span class="v">'+w+'" ('+(pass?'+':'')+(w-32).toFixed(1)+'")</span>';
  }

  [rampRise, rampRun].forEach(el=> el.addEventListener('input', checkRamp));
  doorWidth.addEventListener('input', checkDoor);

  const refData = [
    ['Ramp max slope', '1:12 (8.3%)'],
    ['Ramp min width (clear)', '36"'],
    ['Ramp landing (min length)', '60"'],
    ['Ramp landing (every rise of)', '30"'],
    ['Door clear width (min)', '32"'],
    ['Handrail height', '34"–38"'],
    ['Corridor clear width (min)', '36"'],
    ['Clear floor space (min)', "30\" × 48\""]
  ];
  const refTable = document.getElementById('refTable');
  refData.forEach(function(r){
    const row = document.createElement('div');
    row.className = 'ref-row';
    row.innerHTML = '<span>'+r[0]+'</span><span>'+r[1]+'</span>';
    refTable.appendChild(row);
  });

  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  checkRamp(); checkDoor();
})();