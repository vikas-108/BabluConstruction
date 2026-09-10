(function(){
  let calc = 'motor', motorPhase = 1, transPhase = 1;

  document.querySelectorAll('.calc-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.calc-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      calc = tab.dataset.calc;
      document.getElementById('motorPanel').style.display = calc==='motor' ? 'block' : 'none';
      document.getElementById('transformerPanel').style.display = calc==='transformer' ? 'block' : 'none';
    });
  });

  document.querySelectorAll('[data-phase]').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('[data-phase]').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      motorPhase = Number(tab.dataset.phase);
      recalcMotor();
    });
  });
  document.querySelectorAll('[data-tphase]').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('[data-tphase]').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      transPhase = Number(tab.dataset.tphase);
      recalcTransformer();
    });
  });

  function recalcMotor(){
    const hp = Number(document.getElementById('motorHP').value) || 0;
    const v = Number(document.getElementById('motorV').value) || 1;
    const eff = (Number(document.getElementById('motorEff').value) || 88) / 100;
    const pf = Number(document.getElementById('motorPF').value) || 0.85;
    const watts = hp * 746;
    let current;
    if(motorPhase === 3){
      current = watts / (Math.sqrt(3) * v * eff * pf);
    } else {
      current = watts / (v * eff * pf);
    }
    document.getElementById('motorResult').textContent = current.toFixed(2) + ' A';
  }

  const STANDARD_KVA = [3,5,7.5,10,15,25,37.5,50,75,100,112.5,150,167,225,300,500,750,1000];

  function recalcTransformer(){
    const I = Number(document.getElementById('loadCurrent').value) || 0;
    const V = Number(document.getElementById('loadV').value) || 1;
    let kva;
    if(transPhase === 3){
      kva = (Math.sqrt(3) * V * I) / 1000;
    } else {
      kva = (V * I) / 1000;
    }
    document.getElementById('kvaRequired').textContent = kva.toFixed(2) + ' kVA';
    const suggested = STANDARD_KVA.find(function(s){ return s >= kva; }) || STANDARD_KVA[STANDARD_KVA.length-1];
    document.getElementById('kvaSuggestion').textContent = 'Nearest standard size at or above this: ' + suggested + ' kVA';
  }

  document.querySelectorAll('#motorPanel input').forEach(function(el){ el.addEventListener('input', recalcMotor); });
  document.querySelectorAll('#transformerPanel input').forEach(function(el){ el.addEventListener('input', recalcTransformer); });
  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });

  recalcMotor();
  recalcTransformer();
})();