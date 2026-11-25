import {config} from '../config';
import * as T from 'three';
let seed = 83;
export function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
export function texture(kind: string, base: string) {
  const c = document.createElement('canvas'); c.width = c.height = 32;
  const g = c.getContext('2d')!; g.fillStyle = base; g.fillRect(0,0,32,32);
  for (let i=0;i<310;i++) {
    const x = Math.floor(random()*32), y = Math.floor(random()*32);
    g.fillStyle = random()>.5 ? 'rgba(255,255,220,.13)' : 'rgba(23,17,24,.16)';
    g.fillRect(x,y,kind==='wood'?1:2,kind==='wood'?5:2);
  }
  if(kind==='stone') { g.strokeStyle='#544b5260'; g.lineWidth=1; for(let y=0;y<32;y+=8){g.beginPath();g.moveTo(0,y);g.lineTo(32,y);g.stroke();g.strokeRect(y%16, y, 16,8);} }
  if(kind==='leaf') { for(let i=0;i<28;i++)g.clearRect(Math.floor(random()*32),Math.floor(random()*32),2,2); }
  const t = new T.CanvasTexture(c); t.magFilter=T.NearestFilter; t.minFilter=T.NearestMipmapNearestFilter; t.colorSpace=T.SRGBColorSpace; return t;
}
export const mats = {
  grass: new T.MeshStandardMaterial({map:texture('grass',config.theme.grass),roughness:1}),
  dirt: new T.MeshStandardMaterial({map:texture('dirt','#6b5146'),roughness:1}),
  stone:new T.MeshStandardMaterial({map:texture('stone','#a29f94'),roughness:.95}),
  darkStone:new T.MeshStandardMaterial({map:texture('stone','#686b69'),roughness:1}),
  wood:new T.MeshStandardMaterial({map:texture('wood','#926044'),roughness:.9}),
  bark:new T.MeshStandardMaterial({map:texture('wood','#55414a'),roughness:1}),
  leaf:new T.MeshStandardMaterial({map:texture('leaf',config.theme.blossom),alphaTest:.5,roughness:1,side:T.DoubleSide}),
  paleLeaf:new T.MeshStandardMaterial({map:texture('leaf','#ffd2dc'),alphaTest:.5,roughness:1}),
  hedge:new T.MeshStandardMaterial({map:texture('grass','#42684b'),alphaTest:.5,roughness:1}),
  board:new T.MeshBasicMaterial({color:'#fffdfb'}),
  petalPink:new T.MeshStandardMaterial({map:texture('petal','#d866ad'),roughness:1,side:T.DoubleSide}),
  petalLight:new T.MeshStandardMaterial({map:texture('petal','#f49ac9'),roughness:1}),
  petalDark:new T.MeshStandardMaterial({map:texture('petal','#ad4789'),roughness:1}),
  vineLeaf:new T.MeshStandardMaterial({map:texture('grass','#4c7d3a'),roughness:1}),
  vineLight:new T.MeshStandardMaterial({map:texture('grass','#8aaf48'),roughness:1}),
  vineStem:new T.MeshStandardMaterial({color:'#50713b',roughness:1}),
  pollen:new T.MeshStandardMaterial({color:'#efbb4e',emissive:'#bb791b',emissiveIntensity:.25,roughness:.8}),
  gold:new T.MeshStandardMaterial({color:'#c99a57',metalness:.5,roughness:.4}),
  glow:new T.MeshStandardMaterial({color:'#ffe8aa',emissive:'#ffb752',emissiveIntensity:3}),
};
export type Mat = keyof typeof mats;
export type Block = {x:number;y:number;z:number;sx:number;sy:number;sz:number;mat:Mat};
export class Builder {
  blocks: Block[]=[]; colliders: T.Box3[]=[];
  box(mat:Mat,x:number,y:number,z:number,sx=1,sy=1,sz=1,solid=false){
    this.blocks.push({mat,x,y,z,sx,sy,sz});
    if(solid)this.colliders.push(new T.Box3(new T.Vector3(x-sx/2,y-sy/2,z-sz/2),new T.Vector3(x+sx/2,y+sy/2,z+sz/2)));
  }
  finish(scene:T.Scene){
    const dummy=new T.Object3D();
    for(const [name,mat] of Object.entries(mats)){
      const blocks=this.blocks.filter(b=>b.mat===name); if(!blocks.length)continue;
      const mesh=new T.InstancedMesh(new T.BoxGeometry(1,1,1),mat,blocks.length);
      blocks.forEach((b,i)=>{dummy.position.set(b.x,b.y,b.z);dummy.scale.set(b.sx,b.sy,b.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
      mesh.castShadow=name!=='grass'&&name!=='dirt';mesh.receiveShadow=true;mesh.computeBoundingSphere();scene.add(mesh);
    }
  }
}

