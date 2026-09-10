(function(){
  const ids = ['lotWidth','lotDepth','farVal','setFront','setRear','setLeft','setRight'];
  const els = {};
  ids.forEach(id=> els[id] = document.getElementById(id));

  function recalc(){
    const W = Number(els.lotWidth.value)||0;
    const D = Number(els.lotDepth.value)||0;
    const FAR = Number(els.farVal.value)||0;
    const sf = Number(els.setFront.value)||0;
    const sr = Number(els.setRear.value)||0;
    const sl = Number(els.setLeft.value)||0;
    const srr = Number(els.setRight.value)||0;

    const lotArea = W*D;
    const maxFloorArea = lotArea * FAR;
    const buildW = Math.max(0, W - sl - srr);
    const buildD = Math.max(0, D - sf - sr);
    const footprint = buildW * buildD;
    const coverage = lotArea>0 ? (footprint/lotArea*100) : 0;
    const maxStories = footprint>0 ? Math.floor(maxFloorArea/footprint) : 0;

    document.getElementById('lotArea').textContent = lotArea.toLocaleString() + ' sqft';
    document.getElementById('maxFloorArea').textContent = maxFloorArea.toLocaleString(undefined,{maximumFractionDigits:0}) + ' sqft';
    document.getElementById('footprint').textContent = footprint.toLocaleString(undefined,{maximumFractionDigits:0}) + ' sqft';
    document.getElementById('coverage').textContent = coverage.toFixed(1) + '%';
    document.getElementById('maxStories').textContent = maxStories + ' stories';

    drawLot(W,D,sf,sr,sl,srr);
  }

  function drawLot(W,D,sf,sr,sl,srr){
    const svg = document.getElementById('lotSvg');
    svg.innerHTML = '';
    const pad = 20, maxDim = 180;
    const scale = Math.min(maxDim/Math.max(W,1), (maxDim*0.8)/Math.max(D,1));
    const lw = W*scale, ld = D*scale;
    const ox = (220-lw)/2, oy = 10;

    function rect(x,y,w,h,stroke,dash,fillC){
      const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
      r.setAttribute('x',x); r.setAttribute('y',y); r.setAttribute('width',Math.max(0,w)); r.setAttribute('height',Math.max(0,h));
      r.setAttribute('stroke',stroke); r.setAttribute('fill', fillC||'none'); r.setAttribute('stroke-width','2');
      if(dash) r.setAttribute('stroke-dasharray', dash);
      svg.appendChild(r);
    }
    rect(ox,oy,lw,ld,'#3a4147',null,null);
    const bx = ox + sl*scale, by = oy + sf*scale;
    const bw = lw - (sl+srr)*scale, bh = ld - (sf+sr)*scale;
    rect(bx,by,bw,bh,'#f2c230','4 3','rgba(242,194,48,.12)');
  }

  ids.forEach(id=> els[id].addEventListener('input', recalc));
  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  recalc();
})();