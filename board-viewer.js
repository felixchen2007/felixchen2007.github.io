import './assets/vendor/model-viewer.min.js';

const viewer=document.querySelector('model-viewer');
const controls=document.querySelector('.model-controls');
const toggle=document.querySelector('.model-toggle');
const reset=document.querySelector('.model-reset');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
let wantsRotation=!motion.matches;
let visible=false;
let ready=false;

function updateRotation(){
  viewer.toggleAttribute('auto-rotate',ready&&visible&&!document.hidden&&wantsRotation);
  toggle.textContent=wantsRotation?'Pause rotation':'Resume rotation';
  toggle.setAttribute('aria-label',wantsRotation?'Pause automatic rotation':'Resume automatic rotation');
}
function loaded(){
  ready=true;
  controls.hidden=false;
  viewer.closest('figure').dataset.modelState='loaded';
  updateRotation();
}
viewer.addEventListener('load',loaded);
if(viewer.loaded)loaded();
viewer.addEventListener('error',()=>{
  ready=false;
  controls.hidden=true;
  viewer.closest('figure').dataset.modelState='error';
  document.querySelector('.model-fallback').hidden=false;
  viewer.hidden=true;
});
toggle.addEventListener('click',()=>{wantsRotation=!wantsRotation;updateRotation();});
reset.addEventListener('click',()=>{
  viewer.resetTurntableRotation();
  viewer.cameraOrbit='35deg 65deg 115%';
  viewer.cameraTarget='auto auto auto';
  viewer.jumpCameraToGoal();
});
new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  updateRotation();
},{threshold:.1}).observe(viewer);
document.addEventListener('visibilitychange',updateRotation);
motion.addEventListener('change',()=>{wantsRotation=!motion.matches;updateRotation();});
