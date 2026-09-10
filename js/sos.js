(function(){
  const STORAGE_KEY = 'emergencyContacts_v1';
  const contactsList = document.getElementById('contactsList');

  function loadAll(){
    try{
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(stored) return stored;
    }catch(e){}
    return [{ name:'Site Manager', role:'Primary contact', phone:'', primary:true }];
  }
  function saveAll(list){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }catch(e){} }
  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  let contacts = loadAll();

  function render(){
    contactsList.innerHTML = '';
    contacts.forEach((c,i)=>{
      const row = document.createElement('div');
      row.className = 'contact-row';
      row.innerHTML =
        '<div class="cn"><div class="name">'+escHtml(c.name)+(c.primary?' ★':'')+'</div><div class="role">'+escHtml(c.role||'')+'</div></div>' +
        '<div class="cp">'+escHtml(c.phone||'—')+'</div>' +
        (c.phone ? '<div class="contact-call">'+callIcon()+'</div>' : '') +
        '<div class="contact-del">✕</div>';
      if(c.phone){
        row.querySelector('.contact-call').addEventListener('click', ()=>{ window.location.href = 'tel:'+c.phone; });
      }
      row.querySelector('.contact-del').addEventListener('click', ()=>{
        contacts.splice(i,1); saveAll(contacts); render();
      });
      contactsList.appendChild(row);
    });
  }
  function callIcon(){ return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.1 2h3a2 2 0 012 1.72c.12.9.33 1.77.63 2.61a2 2 0 01-.45 2.11L8.09 9.63a16 16 0 006 6l1.19-1.19a2 2 0 012.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0122 16.92z"/></svg>'; }

  document.getElementById('addContactBtn').addEventListener('click', ()=>{
    const name = document.getElementById('acName').value.trim();
    const role = document.getElementById('acRole').value.trim();
    const phone = document.getElementById('acPhone').value.trim();
    if(!name || !phone){ alert('Enter at least a name and phone number.'); return; }
    contacts.push({ name, role, phone, primary:false });
    saveAll(contacts);
    document.getElementById('acName').value = '';
    document.getElementById('acRole').value = '';
    document.getElementById('acPhone').value = '';
    render();
  });

  // ---- SOS ----
  let lastPos = null;
  if(navigator.geolocation){
    navigator.geolocation.watchPosition(
      pos=>{ lastPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }; },
      ()=>{}, { enableHighAccuracy:true }
    );
  }

  document.getElementById('sosBtn').addEventListener('click', ()=>{
    const primary = contacts.find(c=> c.primary && c.phone) || contacts.find(c=> c.phone);
    if(!primary){
      alert('Add a contact with a phone number first, so the SOS message has somewhere to go.');
      return;
    }
    if(!confirm('Send an emergency SMS with your location to ' + primary.name + '?')) return;

    let msg = 'EMERGENCY — need help at the site.';
    if(lastPos){
      msg += ' Location: https://maps.google.com/?q=' + lastPos.lat + ',' + lastPos.lng;
    } else {
      msg += ' (Location unavailable)';
    }
    const digits = primary.phone.replace(/[^\d+]/g,'');
    const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    const sep = isIOS ? '&' : '?';
    window.location.href = 'sms:' + digits + sep + 'body=' + encodeURIComponent(msg);
  });

  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  render();
})();