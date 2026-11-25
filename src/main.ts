import './style.css';
import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {createGarden} from './world/garden';
import {atmosphere} from './effects/atmosphere';
import {messages} from './messages/messages';
import {player} from './player/controls';
import {config} from './config';
document.querySelector<HTMLDivElement>('#app')!.innerHTML=`<div id="world"></div><header><span class="mark">✿</span><div>Sakura, for Meenu<small>A LITTLE WORLD. A LOT OF HEART.</small></div></header><div id="arrival"><span class="eyebrow">SOMEWHERE SOFT, JUST FOR YOU</span><h1>A little garden,<br>just for Meenu.</h1><p>Follow the petals. Cross the water.<br>There’s something I want to say.</p><button id="enter">Enter garden <span>✿</span></button><small>Take your time. This moment is yours.</small></div><div id="pause" hidden><button id="resume">Continue exploring</button></div><div id="crosshair" hidden>·</div><div id="caption" aria-live="polite"></div><footer><span id="hint">W A S D · WALK &nbsp; / &nbsp; DRAG · ROTATE VIEW &nbsp; / &nbsp; ESC · PAUSE</span><div class="tools"><button id="mute" aria-label="Enable ambient sound">Sound off</button><button id="reset">Return to entrance</button></div></footer><div id="joystick" aria-label="Movement joystick"><div id="knob"></div></div><div id="mobilehint">Move your little friend · drag to rotate the view</div><div id="reveal" hidden><span>✧</span><p></p><button id="dismiss">Keep this moment</button></div><div id="fallback" hidden>This garden needs WebGL 2. Please try a recent browser with graphics acceleration enabled.</div>`;
const $=(id:string)=>document.getElementById(id)!;
const scene=new T.Scene();const camera=new T.PerspectiveCamera(65,innerWidth/innerHeight,.08,180);camera.rotation.order='YXZ';
let renderer:T.WebGLRenderer;
try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch(e){$('fallback').hidden=false;throw e;}
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,config.graphics.maxPixelRatio));renderer.shadowMap.enabled=config.graphics.shadows;renderer.shadowMap.type=T.PCFShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;$('world').append(renderer.domElement);
renderer.shadowMap.autoUpdate=false; renderer.shadowMap.needsUpdate=true; const colliders=createGarden(scene);messages(scene);const animateAtmosphere=atmosphere(scene);const controls=player(camera,renderer.domElement,colliders,scene,()=>{$('pause').hidden=false;});
if(new URLSearchParams(location.search).get('preview')==='monument'){controls.teleport(0,-9);}

const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),config.graphics.bloom,.6,1.2);composer.addPass(bloom);composer.addPass(new OutputPass());
let entered=false,revealed=false,low=matchMedia('(pointer:coarse)').matches,audio:AudioContext|undefined,gain:GainNode|undefined,sound=false;
function quality(){renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:config.graphics.maxPixelRatio));renderer.shadowMap.enabled=!low;renderer.shadowMap.needsUpdate=true;bloom.enabled=!low;composer.setPixelRatio(renderer.getPixelRatio());}quality();
function enter(){entered=true;controls.enter();$('arrival').hidden=true;$('pause').hidden=true;$('crosshair').hidden=true;document.body.classList.add('entered');setTimeout(()=>$('hint').classList.add('quiet'),12000);}
$('arrival').setAttribute('aria-label',config.occasion+' for '+config.friendName);
$('enter').onclick=()=>{enter();if(config.music.enabled&&!sound)$('mute').click();};$('resume').onclick=enter;
$('reset').onclick=()=>{controls.reset();revealed=false;$('reveal').hidden=true;if(entered)enter();$('caption').textContent='A fresh start, under the blossoms.';};

$('mute').onclick=async()=>{if(!audio){audio=new AudioContext();gain=audio.createGain();gain.gain.value=0;gain.connect(audio.destination);for(const f of [174.61,261.63,349.23,440]){const osc=audio.createOscillator();osc.type='sine';osc.frequency.value=f;const g=audio.createGain();g.gain.value=.08;osc.connect(g);g.connect(gain);osc.start();}}await audio.resume();sound=!sound;gain!.gain.setTargetAtTime(sound?config.music.volume:0,audio.currentTime,.4);$('mute').textContent=sound?'Sound on':'Sound off';$('mute').setAttribute('aria-label',sound?'Mute ambient sound':'Enable ambient sound');};
$('reveal').querySelector('p')!.textContent=config.finalWish.replace('\n',' ');$('dismiss').onclick=()=>{$('reveal').hidden=true;$('pause').hidden=false;};
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);});
let last=performance.now(),elapsed=0,frames=0,total=0;let fps=0;let slowSamples=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.05);last=now;elapsed+=dt;controls.update(dt);animateAtmosphere(reduced?0:elapsed,revealed);
  if(entered){const near=config.messages.find(m=>Math.hypot(controls.position.x-m.position[0],controls.position.z-m.position[2])<5);$('caption').textContent=near&&!revealed?near.text.replace('\n',' '):'';
    if(!revealed&&controls.position.z< -8.5&&Math.abs(controls.position.x)<6){revealed=true;controls.frameMonument();$('reveal').hidden=false;$('pause').hidden=true;}}
  if(low)renderer.render(scene,camera);else composer.render();frames++;total+=dt;if(total>1){fps=Math.round(frames/total);frames=0;total=0;if(!low&&fps<35&&++slowSamples>=3){low=true;quality();}document.documentElement.dataset.fps=String(fps);document.documentElement.dataset.position=controls.position.toArray().map(n=>n.toFixed(2)).join(',');document.documentElement.dataset.revealed=String(revealed);}
});
// Read-only diagnostics for manual QA; no public mutation or test-only navigation.
Object.defineProperty(window,'gardenDiagnostics',{get:()=>({fps,position:controls.position.toArray(),camera:camera.position.toArray(),colliders:colliders.length,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,entered,revealed,quality:low?'light':'high'})});



