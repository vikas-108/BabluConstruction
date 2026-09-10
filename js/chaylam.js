(function(){
  let coords = null;
  let dtMode = 'now';

  const locCoords = document.getElementById('locCoords');
  const locNote = document.getElementById('locNote');
  const heightFt = document.getElementById('heightFt');
  const customDT = document.getElementById('customDT');
  const nowReadout = document.getElementById('nowReadout');

  function fetchGPS(){
    if(!navigator.geolocation){ locCoords.textContent = 'GPS not supported'; return; }
    locCoords.textContent = 'Getting location…';
    navigator.geolocation.getCurrentPosition(
      function(pos){
        coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        locCoords.textContent = coords.lat.toFixed(4) + '°, ' + coords.lng.toFixed(4) + '°';
        locNote.textContent = "From this device's GPS.";
        recompute();
      },
      function(){ locCoords.textContent = 'GPS unavailable'; locNote.textContent = 'Enable location to use this tool.'; },
      { enableHighAccuracy:true, timeout:10000 }
    );
  }
  document.getElementById('refreshLocBtn').addEventListener('click', fetchGPS);
  fetchGPS();

  document.querySelectorAll('.dt-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.dt-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      dtMode = tab.dataset.dt;
      document.getElementById('dtCustom').classList.toggle('show', dtMode === 'custom');
      recompute();
    });
  });
  function nowLocalISOForInput(){
    const d = new Date(); d.setSeconds(0,0);
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off*60000);
    return local.toISOString().slice(0,16);
  }
  customDT.value = nowLocalISOForInput();
  customDT.addEventListener('input', recompute);
  function getActiveDate(){
    if(dtMode==='now') return new Date();
    return customDT.value ? new Date(customDT.value) : new Date();
  }

  function dayOfYear(d){
    const start = new Date(d.getFullYear(),0,0);
    return Math.floor((d-start)/86400000);
  }
  function solarPosition(date, lat, lng){
    const N = dayOfYear(date);
    const B = (360/365)*(N-81)*Math.PI/180;
    const eot = 9.87*Math.sin(2*B) - 7.53*Math.cos(B) - 1.5*Math.sin(B);
    const decl = 23.45*Math.sin((360/365)*(284+N)*Math.PI/180);
    const declRad = decl*Math.PI/180;
    const latRad = lat*Math.PI/180;
    const tzOffsetHours = -date.getTimezoneOffset()/60;
    const lstm = 15*tzOffsetHours;
    const tc = 4*(lng-lstm)+eot;
    const clockHours = date.getHours() + date.getMinutes()/60 + date.getSeconds()/3600;
    const lst = clockHours + tc/60;
    const ha = 15*(lst-12);
    const haRad = ha*Math.PI/180;
    const sinAlt = Math.sin(latRad)*Math.sin(declRad) + Math.cos(latRad)*Math.cos(declRad)*Math.cos(haRad);
    const alt = Math.asin(Math.max(-1,Math.min(1,sinAlt)))*180/Math.PI;
    let cosAz = (Math.sin(declRad) - Math.sin(latRad)*Math.sin(alt*Math.PI/180)) / (Math.cos(latRad)*Math.cos(alt*Math.PI/180));
    cosAz = Math.max(-1,Math.min(1,cosAz));
    let az = Math.acos(cosAz)*180/Math.PI;
    if(ha>0) az = 360-az;
    return { altitude:alt, azimuth:az };
  }
  function degToCompass16(deg){
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(deg/22.5)%16];
  }
  function shadowAt(date){
    if(!coords) return null;
    const pos = solarPosition(date, coords.lat, coords.lng);
    const h = Number(heightFt.value)||0;
    if(pos.altitude <= 0.1) return { length:null, dir:null, altitude:pos.altitude };
    const len = h / Math.tan(pos.altitude*Math.PI/180);
    const dir = (pos.azimuth + 180) % 360;
    return { length: len, dir: dir, altitude: pos.altitude };
  }

  function drawDiagram(altitude){
    const svg = document.getElementById('shadowSvg');
    svg.innerHTML = '';
    const groundY = 100, baseX = 40, h = 60;
    const bld = document.createElementNS('http://www.w3.org/2000/svg','line');
    bld.setAttribute('x1',baseX); bld.setAttribute('y1',groundY); bld.setAttribute('x2',baseX); bld.setAttribute('y2',groundY-h);
    bld.setAttribute('stroke','#8b9298'); bld.setAttribute('stroke-width','5');
    svg.appendChild(bld);
    const ground = document.createElementNS('http://www.w3.org/2000/svg','line');
    ground.setAttribute('x1',10); ground.setAttribute('y1',groundY); ground.setAttribute('x2',210); ground.setAttribute('y2',groundY);
    ground.setAttribute('stroke','#2b3136'); ground.setAttribute('stroke-width','2');
    svg.appendChild(ground);
    if(altitude !== null && altitude > 0.1){
      const shadowPx = Math.min(150, h/Math.tan(altitude*Math.PI/180));
      const shadow = document.createElementNS('http://www.w3.org/2000/svg','line');
      shadow.setAttribute('x1',baseX); shadow.setAttribute('y1',groundY); shadow.setAttribute('x2',baseX+shadowPx); shadow.setAttribute('y2',groundY);
      shadow.setAttribute('stroke','#f2c230'); shadow.setAttribute('stroke-width','4');
      svg.appendChild(shadow);
      const sun = document.createElementNS('http://www.w3.org/2000/svg','text');
      sun.setAttribute('x', baseX-20); sun.setAttribute('y', groundY-h-10);
      sun.setAttribute('font-size','20'); sun.textContent = '☀';
      svg.appendChild(sun);
    }
  }

  function recompute(){
    if(!coords) return;
    const date = getActiveDate();
    const s = shadowAt(date);
    const lenEl = document.getElementById('shadowLen');
    const dirEl = document.getElementById('shadowDir');
    if(!s || s.length === null){
      lenEl.textContent = 'No shadow (sun down)';
      dirEl.textContent = '—';
    } else {
      lenEl.textContent = s.length.toFixed(1) + ' ft';
      dirEl.textContent = Math.round(s.dir) + '° ' + degToCompass16(s.dir);
    }
    drawDiagram(s ? s.altitude : null);
    renderHourTable(date);
  }

  function renderHourTable(baseDate){
    const table = document.getElementById('hourTable');
    table.innerHTML = '';
    [7,9,11,13,15,17].forEach(function(hr){
      const d = new Date(baseDate);
      d.setHours(hr,0,0,0);
      const s = shadowAt(d);
      const row = document.createElement('div');
      row.className = 'table-row';
      const label = (hr%12===0?12:hr%12) + (hr<12?':00 AM':':00 PM');
      const val = (!s || s.length===null) ? 'Sun down' : s.length.toFixed(1)+' ft';
      row.innerHTML = '<span>'+label+'</span><span>'+val+'</span>';
      table.appendChild(row);
    });
  }

  function updateNowReadout(){
    if(dtMode!=='now') return;
    const d = new Date();
    nowReadout.textContent = d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}) + '  ·  ' + d.toLocaleTimeString();
  }

  heightFt.addEventListener('input', recompute);
  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  updateNowReadout();
  setInterval(function(){ updateNowReadout(); if(dtMode==='now') recompute(); }, 30000);
})();