import {isBlocked,groundHeight} from './collision';
import * as T from 'three';
import {createCharacter} from './character';

export function player(camera:T.PerspectiveCamera,canvas:HTMLCanvasElement,colliders:T.Box3[],scene:T.Scene,onPause:()=>void){
  const avatar=createCharacter(scene),position=avatar.root.position;
  const keys=new Set<string>(),stick=new T.Vector2(),velocity=new T.Vector2();
  const desired=new T.Vector3(),focus=new T.Vector3(),direction=new T.Vector3(),hit=new T.Vector3(),ray=new T.Ray();
  const cameraBounds=colliders.filter(b=>b.max.y>.8).map(b=>b.clone().expandByScalar(.18));
  let moment=false;let active=false,vy=0,grounded=true,yaw=0,pitch=.36;
  const mobile=matchMedia('(pointer: coarse)').matches||new URLSearchParams(location.search).has('mobile');
  document.body.classList.toggle('touch',mobile);
  const joy=document.querySelector<HTMLDivElement>('#joystick')!,knob=document.querySelector<HTMLDivElement>('#knob')!;
  const clear=()=>{keys.clear();stick.set(0,0);velocity.set(0,0);knob.style.transform='';};
  function cameraFollow(dt:number,snap=false){
    focus.copy(position);focus.y+=moment?2.7:.95;
    const distance=moment?6.5:innerWidth<700?6.6:5.5;const cameraPitch=moment?.14:pitch;
    desired.set(Math.sin(yaw)*Math.cos(cameraPitch),Math.sin(cameraPitch),Math.cos(yaw)*Math.cos(cameraPitch)).multiplyScalar(distance).add(focus);
    desired.x=T.MathUtils.clamp(desired.x,-17.8,17.8);desired.z=T.MathUtils.clamp(desired.z,-21.8,21.8);
    // Keep the following camera in front of walls/trunks instead of inside them.
    direction.subVectors(desired,focus);let length=direction.length();direction.normalize();ray.set(focus,direction);
    for(const bounds of cameraBounds){if(!bounds.containsPoint(focus)&&ray.intersectBox(bounds,hit)){const d=focus.distanceTo(hit);if(d<length)length=Math.max(.7,d-.12);}}
    desired.copy(focus).addScaledVector(direction,length);
    if(snap)camera.position.copy(desired);else camera.position.lerp(desired,1-Math.exp(-9*dt));
    camera.lookAt(focus);
  }
  function teleport(x:number,z:number){position.set(x,groundHeight(x,z)+.12,z);vy=0;grounded=true;avatar.root.rotation.y=0;clear();cameraFollow(0,true);}
  function reset(){moment=false;yaw=0;pitch=.36;teleport(0,17.5);}
  reset();
  window.addEventListener('keydown',e=>{
    if((e.target as HTMLElement)?.closest('input,textarea,select'))return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
    if(e.code==='Escape'&&active){active=false;clear();onPause();return;}
    if(e.code==='KeyR'){reset();return;}
    if(e.code==='Space'&&grounded&&active&&!e.repeat){vy=4;grounded=false;}
    if(active)keys.add(e.code);
  });
  window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
  function move(e:PointerEvent){if(!active||!joy.hasPointerCapture(e.pointerId))return;const r=joy.getBoundingClientRect();stick.set((e.clientX-r.x-r.width/2)/42,(e.clientY-r.y-r.height/2)/42);if(stick.length()>1)stick.normalize();knob.style.transform=`translate(${stick.x*32}px,${stick.y*32}px)`;}
  joy.addEventListener('pointerdown',e=>{if(active){joy.setPointerCapture(e.pointerId);move(e);}});joy.addEventListener('pointermove',move);
  const release=()=>{stick.set(0,0);knob.style.transform='';};joy.addEventListener('pointerup',release);joy.addEventListener('pointercancel',release);joy.addEventListener('lostpointercapture',release);
  let look:number|null=null,lx=0,ly=0;
  canvas.addEventListener('pointerdown',e=>{if(active){look=e.pointerId;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId);}});
  canvas.addEventListener('pointermove',e=>{if(look!==e.pointerId||!active)return;yaw-=(e.clientX-lx)*.004;pitch=T.MathUtils.clamp(pitch+(e.clientY-ly)*.003,.12,.85);lx=e.clientX;ly=e.clientY;});
  const endLook=()=>{look=null;};canvas.addEventListener('pointerup',endLook);canvas.addEventListener('pointercancel',endLook);canvas.addEventListener('lostpointercapture',endLook);
  return {position,reset,teleport,frameMonument(){moment=true;yaw=0;active=false;clear();},pause(){active=false;clear();},enter(){moment=false;active=true;clear();},isActive:()=>active,update(dt:number){
    const beforeX=position.x,beforeZ=position.z;
    if(active){
      const x=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'))+stick.x;
      const z=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'))+stick.y;
      const target=new T.Vector2(x,z);if(target.length()>1)target.normalize();velocity.lerp(target,1-Math.exp(-12*dt));
      const dx=(velocity.x*Math.cos(yaw)+velocity.y*Math.sin(yaw))*2.7*dt,dz=(-velocity.x*Math.sin(yaw)+velocity.y*Math.cos(yaw))*2.7*dt;
      if(!isBlocked(position.x+dx,position.z,position.y+1.6,colliders))position.x+=dx;
      if(!isBlocked(position.x,position.z+dz,position.y+1.6,colliders))position.z+=dz;
      const floor=groundHeight(position.x,position.z)+.12;vy-=10*dt;position.y+=vy*dt;
      if(position.y<=floor){position.y=floor;vy=0;grounded=true;}
      if(position.y< -5||!Number.isFinite(position.x))reset();
    }
    const dx=position.x-beforeX,dz=position.z-beforeZ,moving=Math.min(1,Math.hypot(dx,dz)/Math.max(dt*2.7,.00001));
    if(moving>.02){const angle=Math.atan2(-dx,-dz),difference=Math.atan2(Math.sin(angle-avatar.root.rotation.y),Math.cos(angle-avatar.root.rotation.y));avatar.root.rotation.y+=difference*(1-Math.exp(-15*dt));}
    avatar.animate(dt,moving,groundHeight(position.x,position.z)+.12,!grounded);
    cameraFollow(dt);
  }};
}

