(function(){
  const gpsDot = document.getElementById('gpsDot');
  const gpsText = document.getElementById('gpsText');
  const pointsList = document.getElementById('pointsList');
  const shapeSvg = document.getElementById('shapeSvg');

  let points = []; // { lat, lng, acc }
  let current = null;

  function startWatch(){
    if(!navigator.geolocation){
      gpsText.textContent = 'GPS not supported on this device';
      return;
    }
    navigator.geolocation.watchPosition(
      pos=>{
        current = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
        gpsDot.classList.add('locked');
        gpsText.innerHTML = 'GPS locked · ±<span class="gps-acc">' + Math.round(pos.coords.accuracy) + 'm</span> accuracy';
      },
      ()=>{ gpsText.textContent = 'GPS unavailable — check location permission'; },
      { enableHighAccuracy:true, maximumAge:2000 }
    );
  }
  startWatch();

  // Equirectangular projection to local meters, centered on first point
  function toLocalMeters(p, origin){
    const R = 6371000;
    const dLat = (p.lat - origin.lat) * Math.PI/180;
    const dLng = (p.lng - origin.lng) * Math.PI/180;
    const x = dLng * R * Math.cos(origin.lat*Math.PI/180);
    const y = dLat * R;
    return { x, y };
  }
  function haversine(a,b){
    const R = 6371000;
    const dLat = (b.lat-a.lat)*Math.PI/180, dLng=(b.lng-a.lng)*Math.PI/180;
    const la1=a.lat*Math.PI/180, la2=b.lat*Math.PI/180;
    const h = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
    return 2*R*Math.asin(Math.sqrt(h));
  }

  function render(){
    pointsList.innerHTML = '';
    let perimeter = 0;
    points.forEach((p,i)=>{
      const row = document.createElement('div');
      row.className = 'point-row';
      let segText = '';
      if(i > 0){
        const d = haversine(points[i-1], p);
        perimeter += d;
        segText = d.toFixed(1) + 'm from prev';
      }
      row.innerHTML = '<span class="idx">P'+(i+1)+'</span><span class="seg">'+segText+'</span>';
      pointsList.appendChild(row);
    });

    let area = null;
    if(points.length >= 3){
      const closing = haversine(points[points.length-1], points[0]);
      perimeter += closing;
      const origin = points[0];
      const local = points.map(p=> toLocalMeters(p, origin));
      let sum = 0;
      for(let i=0;i<local.length;i++){
        const a = local[i], b = local[(i+1)%local.length];
        sum += a.x*b.y - b.x*a.y;
      }
      area = Math.abs(sum/2);
    }

    document.getElementById('perimVal').textContent = points.length > 1 ? perimeter.toFixed(1)+' m' : '—';
    document.getElementById('areaVal').textContent = area !== null
      ? (area >= 10000 ? (area/10000).toFixed(3)+' ha' : area.toFixed(1)+' m²')
      : '—';

    drawShape();
  }

  function drawShape(){
    shapeSvg.innerHTML = '';
    if(points.length < 2) return;
    const origin = points[0];
    const local = points.map(p=> toLocalMeters(p, origin));
    const xs = local.map(p=>p.x), ys = local.map(p=>p.y);
    const minX=Math.min(...xs), maxX=Math.max(...xs), minY=Math.min(...ys), maxY=Math.max(...ys);
    const w = Math.max(1, maxX-minX), h = Math.max(1, maxY-minY);
    const scale = 180 / Math.max(w,h);
    const offX = 20 + (180 - w*scale)/2, offY = 20 + (180 - h*scale)/2;

    const pts = local.map(p=> ((p.x-minX)*scale+offX) + ',' + ((maxY-p.y)*scale+offY));
    const poly = document.createElementNS('http://www.w3.org/2000/svg', points.length>=3 ? 'polygon' : 'polyline');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill', points.length>=3 ? 'rgba(242,194,48,.15)' : 'none');
    poly.setAttribute('stroke', '#f2c230');
    poly.setAttribute('stroke-width', '2');
    shapeSvg.appendChild(poly);

    local.forEach((p,i)=>{
      const cx = (p.x-minX)*scale+offX, cy=(maxY-p.y)*scale+offY;
      const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('cx',cx); dot.setAttribute('cy',cy); dot.setAttribute('r','5');
      dot.setAttribute('fill','#f2c230');
      shapeSvg.appendChild(dot);
    });
  }

  document.getElementById('addBtn').addEventListener('click', ()=>{
    if(!current){ gpsText.textContent = 'Still waiting for a GPS fix…'; return; }
    points.push({ lat:current.lat, lng:current.lng });
    render();
  });
  document.getElementById('undoBtn').addEventListener('click', ()=>{
    points.pop(); render();
  });
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    if(points.length && !confirm('Clear all points?')) return;
    points = []; render();
  });

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  render();
})();