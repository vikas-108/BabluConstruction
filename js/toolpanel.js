(function(){
  const searchInput = document.getElementById('toolSearch');
  const searchClear = document.getElementById('searchClear');
  const searchCount = document.getElementById('searchCount');
  const noResults = document.getElementById('noResults');
  const panels = Array.from(document.querySelectorAll('.tp-panel'));

  // ---- collapsible categories ----
  panels.forEach(panel=>{
    const header = panel.querySelector('.tp-header');
    header.addEventListener('click', ()=>{
      if(searchInput.value.trim()) return; // don't let a manual toggle fight an active search
      panel.classList.toggle('collapsed');
    });
  });

  // ---- search across name + description ----
  function runSearch(){
    const q = searchInput.value.trim().toLowerCase();
    searchClear.classList.toggle('show', !!q);

    if(!q){
      document.querySelectorAll('.tp-card').forEach(c=> c.classList.remove('hidden-by-search'));
      panels.forEach(p=> p.classList.remove('hidden-by-search'));
      searchCount.style.display = 'none';
      noResults.classList.remove('show');
      return;
    }

    let totalMatches = 0;
    panels.forEach(panel=>{
      let panelMatches = 0;
      panel.querySelectorAll('.tp-card').forEach(card=>{
        const name = (card.querySelector('h3') || {}).textContent || '';
        const desc = (card.querySelector('p') || {}).textContent || '';
        const hit = (name + ' ' + desc).toLowerCase().indexOf(q) > -1;
        card.classList.toggle('hidden-by-search', !hit);
        if(hit) panelMatches++;
      });
      panel.classList.toggle('hidden-by-search', panelMatches === 0);
      panel.classList.remove('collapsed'); // always show matches, ignore manual collapse while searching
      totalMatches += panelMatches;
    });

    searchCount.style.display = 'block';
    searchCount.textContent = totalMatches + (totalMatches === 1 ? ' tool found' : ' tools found');
    noResults.classList.toggle('show', totalMatches === 0);
  }

  searchInput.addEventListener('input', runSearch);
  searchClear.addEventListener('click', ()=>{
    searchInput.value = '';
    runSearch();
    searchInput.focus();
  });

  document.getElementById('backBtn').addEventListener('click', ()=> window.history.back());
})();