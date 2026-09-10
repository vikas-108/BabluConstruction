(function(){
  let loads = [
    { name:'Lighting', watts:800, qty:1 },
    { name:'AC Unit', watts:1500, qty:1 },
    { name:'Sockets', watts:100, qty:8 }
  ];

  const loadsList = document.getElementById('loadsList');
  function escAttr(s){ return String(s||'').replace(/"/g,'&quot;'); }

  function render(){
    loadsList.innerHTML = '';
    loads.forEach(function(l, i){
      const row = document.createElement('div');
      row.className = 'load-row';
      row.innerHTML =
        '<input class="l-name" type="text" value="'+escAttr(l.name)+'" placeholder="Load name">' +
        '<input class="l-num" type="number" value="'+l.watts+'" min="0">' +
        '<input class="l-num" type="number" value="'+l.qty+'" min="0">' +
        '<div class="row-x">✕</div>';
      const inputs = row.querySelectorAll('input');
      inputs[0].addEventListener('input', function(e){ l.name = e.target.value; });
      inputs[1].addEventListener('input', function(e){ l.watts = Number(e.target.value)||0; recalc(); });
      inputs[2].addEventListener('input', function(e){ l.qty = Number(e.target.value)||0; recalc(); });
      row.querySelector('.row-x').addEventListener('click', function(){ loads.splice(i,1); render(); recalc(); });
      loadsList.appendChild(row);
    });
  }
  document.getElementById('addLoadBtn').addEventListener('click', function(){
    loads.push({ name:'Load '+(loads.length+1), watts:100, qty:1 });
    render(); recalc();
  });

  function recalc(){
    const mainA = Number(document.getElementById('mainA').value) || 0;
    const V = Number(document.getElementById('panelV').value) || 1;
    const phase = Number(document.getElementById('panelPhase').value);

    let totalW = 0;
    loads.forEach(function(l){ totalW += (l.watts||0) * (l.qty||0); });

    const capW = phase === 3 ? Math.sqrt(3) * V * mainA : V * mainA;
    const totalA = phase === 3 ? totalW / (Math.sqrt(3)*V) : totalW / V;
    const pct = capW > 0 ? (totalW/capW)*100 : 0;

    document.getElementById('totalW').textContent = Math.round(totalW).toLocaleString() + ' W';
    document.getElementById('totalA').textContent = totalA.toFixed(1) + ' A';
    document.getElementById('capW').textContent = Math.round(capW).toLocaleString() + ' W';

    const fillBar = document.getElementById('fillBar');
    fillBar.style.width = Math.min(100, pct) + '%';
    fillBar.style.background = pct <= 80 ? 'var(--green)' : pct <= 100 ? 'var(--amber)' : 'var(--red)';

    const verdictBox = document.getElementById('verdictBox');
    if(pct <= 80){
      verdictBox.className = 'verdict ok';
      verdictBox.textContent = pct.toFixed(0) + '% of capacity — within the 80% continuous-load guideline';
    } else if(pct <= 100){
      verdictBox.className = 'verdict warn';
      verdictBox.textContent = pct.toFixed(0) + '% of capacity — over 80%, check if any loads are continuous';
    } else {
      verdictBox.className = 'verdict bad';
      verdictBox.textContent = pct.toFixed(0) + '% of capacity — over the panel rating';
    }
  }

  ['mainA','panelV','panelPhase'].forEach(function(id){
    document.getElementById(id).addEventListener('input', recalc);
  });
  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  render();
  recalc();
})();