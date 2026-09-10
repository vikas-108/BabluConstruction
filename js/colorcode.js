(function(){
  const DIGIT_COLORS = [
    { name:'Black', hex:'#1a1a1a', digit:0, mult:1 },
    { name:'Brown', hex:'#8B4513', digit:1, mult:10, tol:1 },
    { name:'Red', hex:'#ff3b30', digit:2, mult:100, tol:2 },
    { name:'Orange', hex:'#ff9500', digit:3, mult:1000 },
    { name:'Yellow', hex:'#ffe600', digit:4, mult:10000 },
    { name:'Green', hex:'#34c759', digit:5, mult:100000, tol:0.5 },
    { name:'Blue', hex:'#0a84ff', digit:6, mult:1000000, tol:0.25 },
    { name:'Violet', hex:'#af52de', digit:7, mult:10000000, tol:0.1 },
    { name:'Grey', hex:'#8e8e93', digit:8, mult:100000000, tol:0.05 },
    { name:'White', hex:'#ffffff', digit:9, mult:1000000000 }
  ];
  const MULT_ONLY = [
    { name:'Gold', hex:'#d4af37', mult:0.1, tol:5 },
    { name:'Silver', hex:'#c0c0c0', mult:0.01, tol:10 }
  ];
  const ALL_MULT = DIGIT_COLORS.concat(MULT_ONLY);
  const TOL_COLORS = [
    { name:'Brown', hex:'#8B4513', tol:1 }, { name:'Red', hex:'#ff3b30', tol:2 },
    { name:'Green', hex:'#34c759', tol:0.5 }, { name:'Blue', hex:'#0a84ff', tol:0.25 },
    { name:'Violet', hex:'#af52de', tol:0.1 }, { name:'Grey', hex:'#8e8e93', tol:0.05 },
    { name:'Gold', hex:'#d4af37', tol:5 }, { name:'Silver', hex:'#c0c0c0', tol:10 },
    { name:'None', hex:'transparent', tol:20 }
  ];

  let mode = 'bands', bandCount = 4;
  let selected = { d1:'Yellow', d2:'Violet', d3:'Red', mult:'Red', tol:'Gold' };

  document.querySelectorAll('.mode-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.mode-tab').forEach(t=> t.classList.remove('active'));
      tab.classList.add('active');
      mode = tab.dataset.mode;
      document.getElementById('bandsPanel').style.display = mode==='bands' ? 'block' : 'none';
      document.getElementById('valuePanel').style.display = mode==='value' ? 'block' : 'none';
      update();
    });
  });
  document.querySelectorAll('.band-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.band-tab').forEach(t=> t.classList.remove('active'));
      tab.classList.add('active');
      bandCount = Number(tab.dataset.count);
      renderSelectors();
      update();
    });
  });

  function colorOptions(list, selectedName){
    return list.map(function(c){ return '<option value="'+c.name+'"'+(c.name===selectedName?' selected':'')+'>'+c.name+'</option>'; }).join('');
  }

  function renderSelectors(){
    const wrap = document.getElementById('bandSelectors');
    let html = '';
    html += row('d1', 'Digit 1', DIGIT_COLORS, selected.d1);
    html += row('d2', 'Digit 2', DIGIT_COLORS, selected.d2);
    if(bandCount === 5) html += row('d3', 'Digit 3', DIGIT_COLORS, selected.d3);
    html += row('mult', 'Multiplier', ALL_MULT, selected.mult);
    html += row('tol', 'Tolerance', TOL_COLORS, selected.tol);
    wrap.innerHTML = html;

    ['d1','d2','d3','mult','tol'].forEach(function(key){
      const el = document.getElementById('sel-'+key);
      if(el) el.addEventListener('change', function(){ selected[key] = el.value; update(); });
    });
  }
  function row(key, label, colors, sel){
    return '<div class="band-select-row"><label>'+label+'</label><select id="sel-'+key+'">'+colorOptions(colors, sel)+'</select></div>';
  }

  function findColor(list, name){ return list.find(function(c){ return c.name === name; }); }

  function drawResistor(){
    const body = document.getElementById('resistorBody');
    body.innerHTML = '';
    const bands = bandCount === 5
      ? [selected.d1, selected.d2, selected.d3, selected.mult, selected.tol]
      : [selected.d1, selected.d2, selected.mult, selected.tol];
    bands.forEach(function(name){
      const all = ALL_MULT.concat(TOL_COLORS);
      const c = findColor(all, name) || { hex:'#333' };
      const div = document.createElement('div');
      div.className = 'band';
      div.style.background = c.hex === 'transparent' ? 'repeating-linear-gradient(45deg,#d9c39a,#d9c39a 3px,#bfa87e 3px,#bfa87e 6px)' : c.hex;
      body.appendChild(div);
    });
  }

  function formatOhms(value){
    if(value >= 1000000) return (value/1000000).toFixed(value%1000000===0?0:2) + ' MΩ';
    if(value >= 1000) return (value/1000).toFixed(value%1000===0?0:2) + ' kΩ';
    return value.toFixed(value%1===0?0:2) + ' Ω';
  }

  function update(){
    if(mode === 'bands'){
      drawResistor();
      const d1c = findColor(DIGIT_COLORS, selected.d1), d2c = findColor(DIGIT_COLORS, selected.d2);
      const d3c = bandCount===5 ? findColor(DIGIT_COLORS, selected.d3) : null;
      const multC = findColor(ALL_MULT, selected.mult);
      const tolC = findColor(TOL_COLORS, selected.tol);

      let digits = bandCount===5 ? (d1c.digit*100 + d2c.digit*10 + (d3c?d3c.digit:0)) : (d1c.digit*10 + d2c.digit);
      const value = digits * multC.mult;

      document.getElementById('resultValue').textContent = formatOhms(value);
      document.getElementById('resultTolerance').textContent = '± ' + tolC.tol + '% tolerance';
    } else {
      const raw = Number(document.getElementById('targetValue').value) || 0;
      const unitMult = Number(document.getElementById('targetUnit').value);
      const ohms = raw * unitMult;
      document.getElementById('resultValue').textContent = formatOhms(ohms);
      document.getElementById('resultTolerance').textContent = suggestBands(ohms);
    }
  }

  function suggestBands(ohms){
    if(ohms <= 0) return 'Enter a value above 0';
    let exp = Math.floor(Math.log10(ohms));
    let mult = Math.pow(10, exp - 1);
    let digits = Math.round(ohms / mult);
    if(digits >= 100){ digits = Math.round(digits/10); mult *= 10; }
    const d1 = Math.floor(digits/10), d2 = digits%10;
    const d1Name = DIGIT_COLORS[d1].name, d2Name = DIGIT_COLORS[d2].name;
    const multColor = ALL_MULT.find(function(c){ return c.mult === mult; });
    const multName = multColor ? multColor.name : mult.toExponential(0);
    return 'Bands: ' + d1Name + ', ' + d2Name + ', ' + multName + ', Gold (±5%)';
  }

  document.getElementById('targetValue').addEventListener('input', update);
  document.getElementById('targetUnit').addEventListener('input', update);
  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });

  renderSelectors();
  update();
})();