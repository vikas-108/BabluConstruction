(function(){
  const ISO_SHEETS = [
    { name:'A4', w:210, h:297 },
    { name:'A3', w:297, h:420 },
    { name:'A2', w:420, h:594 },
    { name:'A1', w:594, h:841 },
    { name:'A0', w:841, h:1189 }
  ];

  const realW = document.getElementById('realW');
  const realD = document.getElementById('realD');
  const scaleSelect = document.getElementById('scaleSelect');

  function recalc(){
    const w = Number(realW.value)||0;
    const d = Number(realD.value)||0;
    const scale = Number(scaleSelect.value)||1;
    const drawW = (w*1000)/scale; // mm on paper
    const drawD = (d*1000)/scale;

    document.getElementById('drawingSize').textContent = drawW.toFixed(0) + ' × ' + drawD.toFixed(0) + ' mm';

    const sheetList = document.getElementById('sheetList');
    sheetList.innerHTML = '';
    ISO_SHEETS.forEach(function(s){
      const fitsPortrait = drawW <= s.w && drawD <= s.h;
      const fitsLandscape = drawW <= s.h && drawD <= s.w;
      const fits = fitsPortrait || fitsLandscape;
      const row = document.createElement('div');
      row.className = 'sheet-row' + (fits ? ' fits' : '');
      row.innerHTML = '<span>'+s.name+' ('+s.w+'×'+s.h+'mm)</span><span>'+(fits ? '✓ Fits' : 'Too small')+'</span>';
      sheetList.appendChild(row);
    });
  }

  [realW, realD, scaleSelect].forEach(function(el){ el.addEventListener('input', recalc); });
  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  recalc();
})();