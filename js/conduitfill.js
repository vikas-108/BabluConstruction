(function(){
  // Approximate internal areas for EMT conduit, mm² (from common THHN/EMT fill tables)
  const CONDUITS = [
    { size:'1/2"', area:78 }, { size:'3/4"', area:137 }, { size:'1"', area:222 },
    { size:'1-1/4"', area:387 }, { size:'1-1/2"', area:526 }, { size:'2"', area:866 },
    { size:'2-1/2"', area:1333 }, { size:'3"', area:2107 }, { size:'4"', area:3548 }
  ];
  // Approximate THHN/THWN insulated conductor cross-sectional areas, mm²
  const WIRE_AREAS = [
    { size:'14 AWG', area:8.0 }, { size:'12 AWG', area:11.7 }, { size:'10 AWG', area:16.6 },
    { size:'8 AWG', area:28.6 }, { size:'6 AWG', area:38.9 }, { size:'4 AWG', area:56.0 },
    { size:'3 AWG', area:64.8 }, { size:'2 AWG', area:74.9 }, { size:'1 AWG', area:97.2 },
    { size:'1/0 AWG', area:113.9 }, { size:'2/0 AWG', area:133.9 }, { size:'3/0 AWG', area:158.4 },
    { size:'4/0 AWG', area:187.7 }
  ];

  const conduitSize = document.getElementById('conduitSize');
  conduitSize.innerHTML = CONDUITS.map(function(c){ return '<option value="'+c.size+'">'+c.size+'</option>'; }).join('');
  conduitSize.selectedIndex = 2;

  let wires = [ { size:'12 AWG', qty:6 } ];
  const wiresList = document.getElementById('wiresList');

  function renderWires(){
    wiresList.innerHTML = '';
    wires.forEach(function(w, i){
      const row = document.createElement('div');
      row.className = 'wire-row';
      row.innerHTML =
        '<select class="w-size">' + WIRE_AREAS.map(function(o){ return '<option value="'+o.size+'"'+(o.size===w.size?' selected':'')+'>'+o.size+'</option>'; }).join('') + '</select>' +
        '<input class="w-qty" type="number" value="'+w.qty+'" min="0">' +
        '<div class="row-x">✕</div>';
      row.querySelector('.w-size').addEventListener('change', function(e){ w.size = e.target.value; recalc(); });
      row.querySelector('.w-qty').addEventListener('input', function(e){ w.qty = Number(e.target.value)||0; recalc(); });
      row.querySelector('.row-x').addEventListener('click', function(){ wires.splice(i,1); renderWires(); recalc(); });
      wiresList.appendChild(row);
    });
  }
  document.getElementById('addWireBtn').addEventListener('click', function(){
    wires.push({ size:'12 AWG', qty:1 });
    renderWires(); recalc();
  });

  function recalc(){
    const conduit = CONDUITS.find(function(c){ return c.size === conduitSize.value; });
    if(!conduit) return;

    let totalArea = 0, totalCount = 0;
    wires.forEach(function(w){
      const wa = WIRE_AREAS.find(function(x){ return x.size === w.size; });
      if(wa){ totalArea += wa.area * w.qty; totalCount += w.qty; }
    });

    const allowedPct = totalCount <= 1 ? 53 : totalCount === 2 ? 31 : 40;
    const allowedArea = conduit.area * (allowedPct/100);
    const fillPct = conduit.area > 0 ? (totalArea/conduit.area)*100 : 0;

    document.getElementById('fillPct').textContent = fillPct.toFixed(1) + '%';
    document.getElementById('allowedPct').textContent = allowedPct + '%';
    document.getElementById('areaRatio').textContent = Math.round(totalArea) + ' / ' + Math.round(conduit.area) + ' mm²';

    const fillBar = document.getElementById('fillBar');
    fillBar.style.width = Math.min(100, fillPct) + '%';
    const ok = totalArea <= allowedArea;
    fillBar.style.background = ok ? 'var(--green)' : 'var(--red)';

    const verdictBox = document.getElementById('verdictBox');
    verdictBox.className = 'verdict ' + (ok ? 'ok' : 'bad');
    verdictBox.textContent = ok
      ? 'Within allowed fill (' + allowedPct + '% max for ' + totalCount + ' conductor' + (totalCount===1?'':'s') + ')'
      : 'Over the allowed fill — use a larger conduit or fewer/smaller conductors';
  }

  conduitSize.addEventListener('change', recalc);
  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  renderWires();
  recalc();
})();