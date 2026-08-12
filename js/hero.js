window.addEventListener("load",()=>{

const scene=document.querySelector(".construction-scene");

const worker=document.querySelector(".worker");

setTimeout(()=>{

scene.classList.add("gate-open");

},800);

setTimeout(()=>{

worker.classList.add("walk");

},2400);

});