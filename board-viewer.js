import './assets/vendor/model-viewer.min.js';

const viewer=document.querySelector('model-viewer');
const hint=document.querySelector('.model-hint');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
let visible=false;
let ready=false;

function updateRotation(){
  viewer.toggleAttribute('auto-rotate',ready&&visible&&!document.hidden&&!motion.matches);
}
function loaded(){
  ready=true;
  hint.hidden=false;
  viewer.closest('figure').dataset.modelState='loaded';
  updateRotation();
}
viewer.addEventListener('load',loaded);
if(viewer.loaded)loaded();
viewer.addEventListener('error',()=>{
  ready=false;
  hint.hidden=true;
  viewer.closest('figure').dataset.modelState='error';
  document.querySelector('.model-fallback').hidden=false;
  viewer.hidden=true;
});
new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  updateRotation();
},{threshold:.1}).observe(viewer);
document.addEventListener('visibilitychange',updateRotation);
motion.addEventListener('change',updateRotation);
