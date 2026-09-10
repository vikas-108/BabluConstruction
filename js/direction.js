(function(){
  // ============================================================
  // State
  // ============================================================
  let coords = null;         // { lat, lng }
  let dtMode = 'now';
  let compassOn = false;
  let deviceHeading = null;  // degrees, 0 = true north (smoothed)
  let dialRotationAccum = 0; // unwrapped — can exceed 0–360 so CSS animates the short way, never the long way around

  const locCoords = document.getElementById('locCoords');
  const locNote = document.getElementById('locNote');
  const nowReadout = document.getElementById('nowReadout');
  const customDT = document.getElementById('customDT');
  const azimuthVal = document.getElementById('azimuthVal');
  const altitudeVal = document.getElementById('altitudeVal');
  const sunriseVal = document.getElementById('sunriseVal');
  const sunsetVal = document.getElementById('sunsetVal');
  const sunMarker = document.getElementById('sunMarker');
  const sunLine = document.getElementById('sunLine');
  const headingMarker = document.getElementById('headingMarker');
  const elevSun = document.getElementById('elevSun');
  const elevArrow = document.getElementById('elevArrow');
  const horizonLine = document.getElementById('horizonLine');

  // ============================================================
  // Compass dial ticks (N, NE, E, SE, S, SW, W, NW)
  // ============================================================
  const tickGroup = document.getElementById('tickGroup');
  const labelGroup = document.getElementById('labelGroup');
  const DIRS = [
    {a:0,l:'N'},{a:45,l:'NE'},{a:90,l:'E'},{a:135,l:'SE'},
    {a:180,l:'S'},{a:225,l:'SW'},{a:270,l:'W'},{a:315,l:'NW'}
  ];
  function polar(cx,cy,r,angleDeg){
    const rad = (angleDeg-90) * Math.PI/180; // 0deg = up (north)
    return { x: cx + r*Math.cos(rad), y: cy + r*Math.sin(rad) };
  }
  DIRS.forEach(function(d){
    const p1 = polar(125,125,112,d.a), p2 = polar(125,125,100,d.a);
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',p1.x); line.setAttribute('y1',p1.y);
    line.setAttribute('x2',p2.x); line.setAttribute('y2',p2.y);
    tickGroup.appendChild(line);
    const lp = polar(125,125,88,d.a);
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x',lp.x); text.setAttribute('y',lp.y);
    text.setAttribute('text-anchor','middle'); text.setAttribute('dominant-baseline','middle');
    text.textContent = d.l;
    labelGroup.appendChild(text);
  });

  // ============================================================
  // Location
  // ============================================================
  function setCoords(lat, lng, sourceNote){
    coords = { lat: lat, lng: lng };
    locCoords.textContent = lat.toFixed(4) + '°, ' + lng.toFixed(4) + '°';
    locNote.textContent = sourceNote;
    recompute();
  }
  function fetchGPS(){
    if(!navigator.geolocation){
      locCoords.textContent = 'GPS not supported';
      return;
    }
    locCoords.textContent = 'Getting location…';
    navigator.geolocation.getCurrentPosition(
      function(pos){ setCoords(pos.coords.latitude, pos.coords.longitude, "From this device's GPS."); },
      function(){ locCoords.textContent = 'GPS unavailable'; locNote.textContent = 'Enter coordinates manually below.'; },
      { enableHighAccuracy:true, timeout:10000 }
    );
  }
  document.getElementById('refreshLocBtn').addEventListener('click', fetchGPS);

  const manualToggle = document.getElementById('manualToggle');
  const manualRow = document.getElementById('manualRow');
  const manualLat = document.getElementById('manualLat');
  const manualLng = document.getElementById('manualLng');
  manualToggle.addEventListener('click', function(){ manualRow.classList.toggle('show'); });
  [manualLat, manualLng].forEach(function(inp){
    inp.addEventListener('input', function(){
      const lat = Number(manualLat.value), lng = Number(manualLng.value);
      if(!isNaN(lat) && !isNaN(lng) && manualLat.value && manualLng.value){
        setCoords(lat, lng, 'Manually entered.');
      }
    });
  });

  fetchGPS();

  // ============================================================
  // Date/Time
  // ============================================================
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
    const d = new Date();
    d.setSeconds(0,0);
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off*60000);
    return local.toISOString().slice(0,16);
  }
  customDT.value = nowLocalISOForInput();
  customDT.addEventListener('input', recompute);

  function getActiveDate(){
    if(dtMode === 'now') return new Date();
    return customDT.value ? new Date(customDT.value) : new Date();
  }

  // ============================================================
  // Solar position (simplified standard formulas — Cooper/Spencer approximations)
  // ============================================================
  function dayOfYear(d){
    const start = new Date(d.getFullYear(),0,0);
    return Math.floor((d - start) / 86400000);
  }
  function solarPosition(date, lat, lng){
    const N = dayOfYear(date);
    const B = (360/365) * (N - 81) * Math.PI/180;
    const eot = 9.87*Math.sin(2*B) - 7.53*Math.cos(B) - 1.5*Math.sin(B); // minutes

    const decl = 23.45 * Math.sin((360/365) * (284 + N) * Math.PI/180); // degrees
    const declRad = decl * Math.PI/180;
    const latRad = lat * Math.PI/180;

    const tzOffsetHours = -date.getTimezoneOffset()/60;
    const lstm = 15 * tzOffsetHours;
    const tc = 4*(lng - lstm) + eot; // minutes

    const clockHours = date.getHours() + date.getMinutes()/60 + date.getSeconds()/3600;
    const lst = clockHours + tc/60;
    const ha = 15*(lst - 12); // degrees
    const haRad = ha * Math.PI/180;

    const sinAlt = Math.sin(latRad)*Math.sin(declRad) + Math.cos(latRad)*Math.cos(declRad)*Math.cos(haRad);
    const alt = Math.asin(Math.max(-1,Math.min(1,sinAlt))) * 180/Math.PI;

    let cosAz = (Math.sin(declRad) - Math.sin(latRad)*Math.sin(alt*Math.PI/180)) / (Math.cos(latRad)*Math.cos(alt*Math.PI/180));
    cosAz = Math.max(-1, Math.min(1, cosAz));
    let az = Math.acos(cosAz) * 180/Math.PI;
    if(ha > 0) az = 360 - az;

    return { altitude: alt, azimuth: az, decl: decl, eot: eot, tc: tc };
  }

  function solarNoonAndDaylength(date, lat, lng){
    const N = dayOfYear(date);
    const B = (360/365) * (N - 81) * Math.PI/180;
    const eot = 9.87*Math.sin(2*B) - 7.53*Math.cos(B) - 1.5*Math.sin(B);
    const decl = 23.45 * Math.sin((360/365) * (284 + N) * Math.PI/180);
    const declRad = decl * Math.PI/180;
    const latRad = lat * Math.PI/180;
    const tzOffsetHours = -date.getTimezoneOffset()/60;
    const lstm = 15 * tzOffsetHours;
    const tc = 4*(lng - lstm) + eot;

    const cosHA0 = -Math.tan(latRad)*Math.tan(declRad);
    if(cosHA0 < -1) return { sunrise:null, sunset:null, polarDay:true };
    if(cosHA0 > 1) return { sunrise:null, sunset:null, polarNight:true };
    const ha0 = Math.acos(cosHA0) * 180/Math.PI;

    const solarNoonLST = 12;
    const sunriseLST = solarNoonLST - ha0/15;
    const sunsetLST = solarNoonLST + ha0/15;

    function lstToClock(lst){
      let clock = lst - tc/60;
      clock = ((clock % 24) + 24) % 24;
      return clock;
    }
    return { sunrise: lstToClock(sunriseLST), sunset: lstToClock(sunsetLST) };
  }

  function fmtClock(hoursDecimal){
    if(hoursDecimal == null) return '—';
    let h = Math.floor(hoursDecimal);
    let m = Math.round((hoursDecimal - h)*60);
    if(m === 60){ m = 0; h += 1; }
    const ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12; if(h12 === 0) h12 = 12;
    return h12 + ':' + String(m).padStart(2,'0') + ' ' + ampm;
  }

  function degToCompass16(deg){
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(deg/22.5) % 16];
  }

  // ============================================================
  // Rendering
  // ============================================================
  function updateNowReadout(){
    if(dtMode !== 'now') return;
    const d = new Date();
    nowReadout.textContent = d.toLocaleDateString(undefined,{ weekday:'short', month:'short', day:'numeric' }) + '  ·  ' + d.toLocaleTimeString();
  }

  function recompute(){
    if(!coords) return;
    const date = getActiveDate();
    const pos = solarPosition(date, coords.lat, coords.lng);
    const daylen = solarNoonAndDaylength(date, coords.lat, coords.lng);

    const isDay = pos.altitude > 0;
    azimuthVal.textContent = Math.round(pos.azimuth) + '° ' + degToCompass16(pos.azimuth);
    altitudeVal.textContent = Math.round(pos.altitude) + '°';
    sunriseVal.textContent = daylen.polarDay ? 'All day' : daylen.polarNight ? 'None' : fmtClock(daylen.sunrise);
    sunsetVal.textContent = daylen.polarDay ? 'None' : daylen.polarNight ? 'All night' : fmtClock(daylen.sunset);

    // ---- plan view ----
    // Use the accumulated (unwrapped) rotation, not a fresh -deviceHeading each time —
    // otherwise crossing the 0°/360° seam makes the dial spin the long way round.
    const dialRotation = compassOn ? dialRotationAccum : 0;
    document.getElementById('compassDial').style.transform = 'rotate(' + dialRotation + 'deg)';
    const p = polar(125,125,96, pos.azimuth);
    sunLine.setAttribute('x2', p.x); sunLine.setAttribute('y2', p.y);
    sunLine.setAttribute('stroke', isDay ? '#f2c230' : '#3a4147');

    const rect = document.getElementById('compassDial').getBoundingClientRect();
    const scale = rect.width / 250;
    sunMarker.style.left = (p.x*scale) + 'px';
    sunMarker.style.top = (p.y*scale) + 'px';
    sunMarker.classList.toggle('night', !isDay);
    sunMarker.style.transform = 'translate(-50%,-50%) rotate(' + (-dialRotation) + 'deg)';

    headingMarker.style.display = (compassOn && deviceHeading !== null) ? 'block' : 'none';

    // ---- elevation view ----
    const track = document.getElementById('elevTrack');
    const trackH = track.clientHeight;
    const horizonY = trackH * 0.62;
    horizonLine.style.top = horizonY + 'px';

    const maxAlt = 90;
    const altClamped = Math.max(-20, Math.min(90, pos.altitude));
    const sunY = horizonY - (altClamped/maxAlt) * (horizonY - 10);
    elevSun.style.top = sunY + 'px';
    elevSun.style.opacity = isDay ? '1' : '.25';

    const arrowLen = Math.max(20, horizonY - sunY - 14);
    const tiltDeg = Math.max(-70, Math.min(70, (90 - Math.max(altClamped,1)) * 0.7));
    elevArrow.style.top = (sunY+12) + 'px';
    elevArrow.style.height = arrowLen + 'px';
    elevArrow.style.transform = 'rotate(' + tiltDeg + 'deg)';
    elevArrow.style.opacity = isDay ? '1' : '.2';
  }

  window.addEventListener('resize', recompute);

  // ============================================================
  // Device compass (optional)
  // ============================================================
  const compassSwitch = document.getElementById('compassSwitch');
  const compassLabel = document.getElementById('compassLabel');
  function needsIOSPermission(){
    return typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';
  }

  function normalizeDelta(delta){
    // wrap into -180..180 so we always rotate the short way
    return ((delta + 180) % 360 + 360) % 360 - 180;
  }

  function handleOrientation(e){
    let heading = null;
    if(typeof e.webkitCompassHeading === 'number'){ heading = e.webkitCompassHeading; }
    else if(e.absolute && e.alpha !== null){ heading = 360 - e.alpha; }
    if(heading === null) return;

    if(deviceHeading === null){
      // first reading — snap straight to it, nothing to animate from yet
      deviceHeading = heading;
      dialRotationAccum = -heading;
    } else {
      // smooth the raw signal a little so the needle doesn't jitter with sensor noise
      const smoothedDelta = normalizeDelta(heading - deviceHeading) * 0.25;
      deviceHeading = ((deviceHeading + smoothedDelta) % 360 + 360) % 360;

      // accumulate rotation as an unwrapped value so CSS transitions smoothly
      // even when heading crosses the 0°/360° seam
      const targetRotation = -deviceHeading;
      const step = normalizeDelta(targetRotation - dialRotationAccum);
      dialRotationAccum += step;
    }
    recompute();
  }
  compassSwitch.addEventListener('click', function(){
    if(!compassOn){
      const enable = function(){
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
        compassOn = true;
        compassSwitch.classList.add('on');
        compassLabel.textContent = 'Dial rotates to match true north';
      };
      if(needsIOSPermission()){
        DeviceOrientationEvent.requestPermission().then(function(res){
          if(res === 'granted') enable();
          else compassLabel.textContent = 'Compass permission denied';
        }).catch(function(){});
      } else if(window.DeviceOrientationEvent){
        enable();
      } else {
        compassLabel.textContent = 'No compass sensor on this device';
      }
    } else {
      compassOn = false;
      deviceHeading = null;
      dialRotationAccum = 0;
      compassSwitch.classList.remove('on');
      compassLabel.textContent = 'Use device compass (align dial to true north)';
      recompute();
    }
  });

  // ============================================================
  // Boot
  // ============================================================
  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
  updateNowReadout();
  setInterval(function(){ updateNowReadout(); if(dtMode==='now') recompute(); }, 30000);
})();