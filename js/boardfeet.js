(function(){
  let boards = [
    { name:'2x4', t:1.5, w:3.5, l:8, qty:10 },
    { name:'1x6', t:0.75, w:5.5, l:8, qty:6 }
  ];

  const boardsList = document.getElementById('boardsList');
  function escAttr(s){ return String(s||'').replace(/"/g,'&quot;'); }

  function render(){
    boardsList.innerHTML = '';
    boards.forEach((b,i)=>{
      const bf = (b.t * b.w * b.l / 12) * b.qty;
      const row = document.createElement('div');
      row.className = 'board-row';
      row.innerHTML =
        '<input class="b-name" type="text" value="'+escAttr(b.name)+'" placeholder="Board name">'+
        '<input class="b-num" type="number" value="'+b.t+'" step="0.125" min="0">'+
        '<input class="b-num" type="number" value="'+b.w+'" step="0.25" min="0">'+
        '<input class="b-num" type="number" value="'+b.l+'" step="0.5" min="0">'+
        '<input class="b-num" type="number" value="'+b.qty+'" step="1" min="0">'+
        '<div class="row-x">✕</div>';
      const inputs = row.querySelectorAll('input');
      inputs[0].addEventListener('input', e=>{ b.name = e.target.value; });
      inputs[1].addEventListener('input', e=>{ b.t = Number(e.target.value)||0; recalc(); });
      inputs[2].addEventListener('input', e=>{ b.w = Number(e.target.value)||0; recalc(); });
      inputs[3].addEventListener('input', e=>{ b.l = Number(e.target.value)||0; recalc(); });
      inputs[4].addEventListener('input', e=>{ b.qty = Number(e.target.value)||0; recalc(); });
      row.querySelector('.row-x').addEventListener('click', ()=>{ boards.splice(i,1); render(); recalc(); });
      boardsList.appendChild(row);
    });
  }

  function recalc(){
    let totalBF = 0;
    boards.forEach(b=>{ totalBF += (b.t * b.w * b.l / 12) * b.qty; });
    const price = Number(document.getElementById('priceInput').value) || 0;
    document.getElementById('totalBF').textContent = totalBF.toFixed(2) + ' BF';
    document.getElementById('totalCost').textContent = '₹' + (totalBF*price).toLocaleString(undefined,{maximumFractionDigits:2});
  }

  document.getElementById('addBoardBtn').addEventListener('click', ()=>{
    boards.push({ name:'Board '+(boards.length+1), t:1.5, w:3.5, l:8, qty:1 });
    render(); recalc();
  });
  document.getElementById('priceInput').addEventListener('input', recalc);
  document.getElementById('exitBtn').addEventListener('click', ()=> window.history.back());

  render(); recalc();
})();