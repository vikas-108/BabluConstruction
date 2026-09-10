(function(){
  const inV = document.getElementById('inV');
  const inI = document.getElementById('inI');
  const inR = document.getElementById('inR');
  const inP = document.getElementById('inP');
  const hintNote = document.getElementById('hintNote');

  function round(n){ return Math.round(n*10000)/10000; }

  function compute(){
    const raw = {
      V: inV.value !== '' ? Number(inV.value) : null,
      I: inI.value !== '' ? Number(inI.value) : null,
      R: inR.value !== '' ? Number(inR.value) : null,
      P: inP.value !== '' ? Number(inP.value) : null
    };
    const known = Object.keys(raw).filter(function(k){ return raw[k] !== null && !isNaN(raw[k]); });

    if(known.length < 2){
      hintNote.textContent = 'Type values into any two fields — the other two fill in automatically.';
      return;
    }

    let V=raw.V, I=raw.I, R=raw.R, P=raw.P;

    for(let pass=0; pass<3; pass++){
      if(V===null && I!==null && R!==null) V = I*R;
      if(V===null && P!==null && I!==null && I!==0) V = P/I;
      if(V===null && P!==null && R!==null && P*R>=0) V = Math.sqrt(P*R);

      if(I===null && V!==null && R!==null && R!==0) I = V/R;
      if(I===null && P!==null && V!==null && V!==0) I = P/V;
      if(I===null && P!==null && R!==null && R!==0 && P/R>=0) I = Math.sqrt(P/R);

      if(R===null && V!==null && I!==null && I!==0) R = V/I;
      if(R===null && P!==null && I!==null && I!==0) R = P/(I*I);
      if(R===null && V!==null && P!==null && P!==0) R = (V*V)/P;

      if(P===null && V!==null && I!==null) P = V*I;
      if(P===null && I!==null && R!==null) P = I*I*R;
      if(P===null && V!==null && R!==null && R!==0) P = (V*V)/R;
    }

    if(V!==null && known.indexOf('V')===-1) inV.value = round(V);
    if(I!==null && known.indexOf('I')===-1) inI.value = round(I);
    if(R!==null && known.indexOf('R')===-1) inR.value = round(R);
    if(P!==null && known.indexOf('P')===-1) inP.value = round(P);

    hintNote.textContent = 'Solved from ' + known.join(' & ') + '.';
  }

  [['V',inV],['I',inI],['R',inR],['P',inP]].forEach(function(pair){
    pair[1].addEventListener('input', compute);
  });

  document.getElementById('clearBtn').addEventListener('click', function(){
    inV.value=''; inI.value=''; inR.value=''; inP.value='';
    hintNote.textContent = 'Type values into any two fields — the other two fill in automatically.';
  });

  document.getElementById('exitBtn').addEventListener('click', function(){ window.history.back(); });
})();