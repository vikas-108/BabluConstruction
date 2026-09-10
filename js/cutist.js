(function(){
  let pieces = [
    { len:24, qty:6 },
    { len:36, qty:4 },
    { len:18, qty:8 }
  ];

  const piecesList = document.getElementById('piecesList');

  function renderPieces(){
    piecesList.innerHTML = '';
    pieces.forEach((p,i)=>{
      const row = document.createElement('div');
      row.className = 'piece-row';
      row.innerHTML =
        '<input class="p-len" type="number" value="'+p.len+'" min="0.1" step="0.5">'+
        '<input class="p-qty" type="number" value="'+p.qty+'" min="1" step="1">'+
        '<div class="row-x">✕</div>';
      const inputs = row.querySelectorAll('input');
      inputs[0].addEventListener('input', e=>{ p.len = Number(e.target.value)||0; });
      inputs[1].addEventListener('input', e=>{ p.qty = Number(e.target.value)||0; });
      row.querySelector('.row-x').addEventListener('click', ()=>{ pieces.splice(i,1); renderPieces(); });
      piecesList.appendChild(row);
    });
  }
  document.getElementById('addPieceBtn').addEventListener('click', ()=>{
    pieces.push({ len:12, qty:1 });
    renderPieces();
  });

  // First-Fit-Decreasing bin packing
  function optimize(){
    const stockLen = Number(document.getElementById('stockLen').value) || 96;
    const kerf = Number(document.getElementById('kerf').value) || 0;

    let items = [];
    pieces.forEach(p=>{
      for(let i=0;i<p.qty;i++) items.push(p.len);
    });
    items.sort((a,b)=> b-a);

    const boards = []; // each: { used: number, cuts: [len,...] }
    items.forEach(len=>{
      let placed = false;
      for(const board of boards){
        const needed = board.cuts.length ? len + kerf : len;
        if(board.used + needed <= stockLen + 1e-9){
          board.used += needed;
          board.cuts.push(len);
          placed = true;
          break;
        }
      }
      if(!placed){
        boards.push({ used: len, cuts: [len] });
      }
    });

    const totalUsedForPieces = items.reduce((s,l)=> s+l, 0);
    const totalStock = boards.length * stockLen;
    const wastePct = totalStock > 0 ? ((totalStock - totalUsedForPieces) / totalStock * 100) : 0;

    document.getElementById('boardsNeeded').textContent = boards.length;
    document.getElementById('wastePct').textContent = wastePct.toFixed(1) + '%';

    const colors = ['#f2c230','#31d17a','#5aa9ff','#ff5347','#ffb020','#b784ff'];
    const boardBars = document.getElementById('boardBars');
    boardBars.innerHTML = '';
    boards.forEach((board, bi)=>{
      const wrap = document.createElement('div');
      wrap.className = 'board-bar';
      const usedLen = board.cuts.reduce((s,l,idx)=> s + l + (idx>0?kerf:0), 0);
      const wastePctThis = ((stockLen - usedLen)/stockLen*100).toFixed(0);
      wrap.innerHTML = '<div class="label">Board ' + (bi+1) + ' — ' + stockLen + '" (waste ' + wastePctThis + '%)</div>';
      const bar = document.createElement('div');
      bar.className = 'bar';
      board.cuts.forEach((len, ci)=>{
        const seg = document.createElement('div');
        seg.className = 'seg';
        seg.style.width = (len/stockLen*100) + '%';
        seg.style.background = colors[ci % colors.length];
        seg.textContent = len + '"';
        bar.appendChild(seg);
      });
      const wastePx = stockLen - usedLen;
      if(wastePx > 0.1){
        const waste = document.createElement('div');
        waste.className = 'seg waste';
        waste.style.width = (wastePx/stockLen*100) + '%';
        waste.textContent = wastePx >= stockLen*0.08 ? wastePx.toFixed(1)+'"' : '';
        bar.appendChild(waste);
      }
      wrap.appendChild(bar);
      boardBars.appendChild(wrap);
    });

    document.getElementById('resultsSection').style.display = 'block';
  }

  document.getElementById('optimizeBtn').addEventListener('click', optimize);
  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());
  renderPieces();
})();