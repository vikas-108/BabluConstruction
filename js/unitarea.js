(function(){
  // ---- Length (base unit: mm) ----
  const LEN_UNITS = {
    mm:1, cm:10, m:1000, km:1000000,
    'in':25.4, 'ft':304.8, 'yd':914.4, 'mi':1609344
  };
  const lenUnit = document.getElementById('lenUnit');
  Object.keys(LEN_UNITS).forEach(function(u){
    const opt = document.createElement('option'); opt.value=u; opt.textContent=u; lenUnit.appendChild(opt);
  });
  lenUnit.value = 'm';

  function updateLength(){
    const val = Number(document.getElementById('lenVal').value)||0;
    const baseMM = val * LEN_UNITS[lenUnit.value];
    const order = ['mm','cm','m','km','in','ft','yd','mi'];
    const results = document.getElementById('lenResults');
    results.innerHTML = '';
    order.filter(function(u){ return u !== lenUnit.value; }).forEach(function(u){
      const out = baseMM / LEN_UNITS[u];
      const row = document.createElement('div');
      row.className = 'result-row';
      row.innerHTML = '<span>'+u+'</span><span>'+out.toLocaleString(undefined,{maximumFractionDigits:4})+'</span>';
      results.appendChild(row);
    });
  }
  document.getElementById('lenVal').addEventListener('input', updateLength);
  lenUnit.addEventListener('change', updateLength);

  // ---- ft-in <-> m ----
  function updateFtIn(){
    const ft = Number(document.getElementById('ftIn').value)||0;
    const inch = Number(document.getElementById('inIn').value)||0;
    const totalIn = ft*12 + inch;
    const meters = totalIn * 25.4 / 1000;
    document.getElementById('ftinResult').textContent = meters.toFixed(3) + ' m';
  }
  document.getElementById('ftIn').addEventListener('input', updateFtIn);
  document.getElementById('inIn').addEventListener('input', updateFtIn);

  // ---- Area (base unit: sqm) ----
  const AREA_UNITS = {
    'sqmm':0.000001, 'sqcm':0.0001, 'sqm':1, 'hectare':10000,
    'sqft':0.09290304, 'sqyd':0.83612736, 'acre':4046.8564224
  };
  const areaUnit = document.getElementById('areaUnit');
  Object.keys(AREA_UNITS).forEach(function(u){
    const opt = document.createElement('option'); opt.value=u; opt.textContent=u; areaUnit.appendChild(opt);
  });
  areaUnit.value = 'sqft';

  function updateArea(){
    const val = Number(document.getElementById('areaVal').value)||0;
    const baseSqm = val * AREA_UNITS[areaUnit.value];
    const order = ['sqmm','sqcm','sqm','hectare','sqft','sqyd','acre'];
    const results = document.getElementById('areaResults');
    results.innerHTML = '';
    order.filter(function(u){ return u !== areaUnit.value; }).forEach(function(u){
      const out = baseSqm / AREA_UNITS[u];
      const row = document.createElement('div');
      row.className = 'result-row';
      row.innerHTML = '<span>'+u+'</span><span>'+out.toLocaleString(undefined,{maximumFractionDigits:4})+'</span>';
      results.appendChild(row);
    });
  }
  document.getElementById('areaVal').addEventListener('input', updateArea);
  areaUnit.addEventListener('change', updateArea);

  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  updateLength(); updateFtIn(); updateArea();
})();