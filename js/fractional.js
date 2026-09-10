(function(){
  function gcd(a,b){ return b ? gcd(b, a%b) : a; }

  function fractionToDecimal(whole, num, den){
    if(den <= 0) den = 1;
    return whole + num/den;
  }

  function decimalToFraction(decValue, precisionDen){
    const whole = Math.floor(decValue);
    let frac = decValue - whole;
    let num = Math.round(frac * precisionDen);
    let den = precisionDen;
    if(num === den){ return { whole: whole+1, num:0, den:1 }; }
    if(num === 0) return { whole, num:0, den:1 };
    const g = gcd(num, den);
    return { whole, num: num/g, den: den/g };
  }

  function fmtFraction(whole, num, den){
    if(num === 0) return String(whole);
    return (whole ? whole+' ' : '') + num + '/' + den;
  }

  let mode = 'f2d';
  let precision = 16;

  document.querySelectorAll('.mode-tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      document.querySelectorAll('.mode-tab').forEach(t=> t.classList.remove('active'));
      tab.classList.add('active');
      mode = tab.dataset.mode;
      document.getElementById('f2dPanel').style.display = mode==='f2d' ? 'block' : 'none';
      document.getElementById('d2fPanel').style.display = mode==='d2f' ? 'block' : 'none';
      update();
    });
  });

  const precRow = document.getElementById('precRow');
  [8,16,32,64].forEach(p=>{
    const btn = document.createElement('div');
    btn.className = 'prec-btn' + (p===16 ? ' active' : '');
    btn.textContent = '1/' + p;
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.prec-btn').forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
      precision = p;
      update();
    });
    precRow.appendChild(btn);
  });

  const wholeIn = document.getElementById('wholeIn');
  const numIn = document.getElementById('numIn');
  const denIn = document.getElementById('denIn');
  const decIn = document.getElementById('decIn');
  [wholeIn, numIn, denIn, decIn].forEach(inp=> inp.addEventListener('input', update));

  function update(){
    let decimalVal, fracStr;
    if(mode === 'f2d'){
      const whole = Number(wholeIn.value)||0, num = Number(numIn.value)||0, den = Number(denIn.value)||1;
      decimalVal = fractionToDecimal(whole, num, den);
      const g = gcd(num||1, den);
      fracStr = fmtFraction(whole, num ? num/g : 0, num ? den/g : 1);
    } else {
      decimalVal = Number(decIn.value) || 0;
      const f = decimalToFraction(decimalVal, precision);
      fracStr = fmtFraction(f.whole, f.num, f.den);
    }
    document.getElementById('resDecimal').textContent = decimalVal.toFixed(4).replace(/0+$/,'').replace(/\.$/,'.0');
    document.getElementById('resFraction').textContent = fracStr + '"';
    document.getElementById('resMM').textContent = (decimalVal*25.4).toFixed(2) + ' mm';
  }

  const refGrid = document.getElementById('refGrid');
  for(let n=1; n<16; n++){
    const g = gcd(n,16);
    const num = n/g, den = 16/g;
    const dec = n/16;
    const cell = document.createElement('div');
    cell.className = 'ref-cell';
    cell.innerHTML = '<span>'+num+'/'+den+'"</span><span>'+dec.toFixed(3)+' · '+(dec*25.4).toFixed(1)+'mm</span>';
    refGrid.appendChild(cell);
  }

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  update();
})();