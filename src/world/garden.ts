import {addScooter,scooterSpot} from './scooter';
import {addBlossoms} from './blossoms';
import * as T from 'three';
import {Builder, random} from './materials';
export const pathX=(z:number)=>z>4?Math.sin((z-4)*.24)*2.4:0;
export function tree(b:Builder,x:number,z:number,h=5){
  b.box('bark',x,h/2,z,.85,h,.85,true);
  for(const side of [-1,1]) { b.box('bark',x+side*.8,h-1.1,z,.6,.6,1.1);b.box('bark',x+side*1.4,h-.6,z,.55,1.4,.55); }
  // Layered irregular voxel crowns with perforated pixel foliage.
  for(let y=0;y<4;y++)for(let dx=-4;dx<=4;dx++)for(let dz=-3;dz<=3;dz++){
    const r=(dx*dx/17+dz*dz/12)+(y-1)*.22;
    if(r<1.15&&random()>.10)b.box(random()>.4?'leaf':'paleLeaf',x+dx*.78,h+y*.65,z+dz*.8,.84,.75,.84);
  }
  for(let i=0;i<10;i++){const a=random()*Math.PI*2;b.box('leaf',x+Math.cos(a)*2.5,h-.5-random(),z+Math.sin(a)*2,.6,1,.6);}
}
export function lantern(b:Builder,x:number,z:number,y=0){
  b.box('wood',x,y+1.5,z,.18,3,.18,true);b.box('wood',x+.36,y+3,z,.85,.16,.18);
  b.box('gold',x+.7,y+2.65,z,.1,.55,.1);b.box('glow',x+.7,y+2.26,z,.42,.55,.42);
  for(const dy of [-.32,.32])b.box('bark',x+.7,y+2.26+dy,z,.58,.12,.58);
}
export function createGarden(scene:T.Scene){
  const b=new Builder();
  b.box('dirt',0,-1.78,0,40,3,48);for(let gx=-20;gx<20;gx++)for(let gz=-24;gz<24;gz++)b.box('grass',gx+.5,-.14,gz+.5,1,.28,1);
  // Finite, authored path and individually textured pavers.
  for(let z=-17;z<22;z++)for(let x=-5;x<=5;x++){
    if(Math.abs(x-pathX(z))<1.8&&!(z>-4&&z<3))b.box(random()>.18?'stone':'darkStone',x,.04,z,.96,.12,.96);
  }
  for(let i=0;i<320;i++){let x=(random()-.5)*35,z=(random()-.5)*44;if(Math.abs(x-pathX(z))<2.2||Math.abs(x)<7&&z< -13||Math.abs(x)<7&&z>-5&&z<4)continue;b.box('grass',x,.09,z,.5,.18,.5);}
  // Pond: bed, irregular stone shore, and bridge crossing north/south.
  b.box('darkStone',0,.01,-.5,13,.14,7.4);
  for(let x=-7;x<=7;x++)for(const z of [-4.5,3.5])b.box('stone',x,.20,z,1,.4,1);
  for(const x of [-7,7])for(let z=-4;z<=3;z++)b.box('stone',x,.2,z,1,.4,1);
  for(let z=-4;z<=3;z+=.4){let y=.15+Math.sin((z+4)/7*Math.PI)*.55;b.box('wood',0,y,z,3.4,.22,.37);
    if(Math.round(z*10)%8===0)for(const x of [-1.7,1.7]){b.box('wood',x,y+.65,z,.14,1.35,.14);}
    for(const x of [-1.7,1.7])b.box('wood',x,y+1.25,z,.15,.16,.43);
  }
  b.colliders.push(new T.Box3(new T.Vector3(-7,0,-4.5),new T.Vector3(-1.9,2,3.5)),new T.Box3(new T.Vector3(1.9,0,-4.5),new T.Vector3(7,2,3.5)));
  for(const x of [-1.87,1.87])b.colliders.push(new T.Box3(new T.Vector3(x-.1,0,-4.5),new T.Vector3(x+.1,2,3.5)));
  for(const [x,z,h] of [[-6,17,5],[7,16,5],[-7,8,5.5],[8,5,5],[-10,-1,5],[10,-5,5.7],[-8,-12,6],[8,-14,6],[-12,-20,6],[12,-21,6],[-15,12,6],[15,13,6],[-16,-10,5],[16,-13,6],[-4,-23,6],[4,-23,6]])tree(b,x,z,h);
  // Enclosing hedges and wooden perimeter hide the finite world edge.
  for(let z=-23;z<=23;z+=2)for(const x of [-19,19]){b.box('hedge',x,1,z,2,2.5,2);b.box('wood',x*.94,.8,z,.2,1.6,.2);}
  for(let x=-18;x<=18;x+=2)for(const z of [-23,23])b.box('hedge',x,1,z,2,2.5,2);
  // Entrance torii-inspired pergola.
  for(const x of [-3.6,3.6]){b.box('stone',x,.3,19,1,.6,1,true);b.box('wood',x,2.5,19,.55,4.5,.55,true);}
  b.box('bark',0,4.65,19,8.9,.45,.8);b.box('wood',0,4.05,19,8,.22,.4);
  for(let x=-4;x<=4;x++)b.box('leaf',x,4.95,19,1,.35,1.2);
  for(const [x,z] of [[-3,12],[4,9],[-2.6,3],[2.6,-4],[-3,-10],[3,-13],[-4,-18],[4,-18]])lantern(b,x,z);
  // A huge white apology board replaces the heart monument.
  b.box('darkStone',0,.18,-17,11.8,.36,5,true);
  b.box('stone',0,.48,-17,10.8,.3,4,true);
  b.box('wood',0,.70,-17,10.1,.14,3.3);
  for(const x of [-4.55,4.55])b.box('wood',x,3.1,-17.15,.28,5,.30,true);
  b.box('board',0,4.1,-17,10.5,5.5,.32,true);
  for(const y of [1.28,6.92])b.box('wood',0,y,-17,10.85,.16,.45);
  for(const x of [-5.34,5.34])b.box('wood',x,4.1,-17,.16,5.8,.45,true);
  for(const x of [-5.85,5.85]){b.box('stone',x,1,-17.4,.8,2,.8,true);b.box('glow',x,2.15,-17.4,.60,.5,.60);}
  addBlossoms(b);
  // A small stone parking bay leaves the walking route open.
  b.box('stone',scooterSpot.x,.12,scooterSpot.z,scooterSpot.padWidth,.24,scooterSpot.padDepth);
  b.colliders.push(addScooter(scene));
  b.finish(scene);
  // Hundreds of crossed pixel flowers and grass blades, batched by color.
  const flowerColors=['#f4b9d8','#fff6e4','#ce7dcb','#ffd779'];
  for(const color of flowerColors){const geo=new T.PlaneGeometry(.48,.7);const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d')!;
    g.fillStyle='#446c3b';g.fillRect(7,7,2,9);g.fillRect(3,10,5,2);g.fillRect(9,12,5,2);g.fillStyle=color;g.fillRect(4,2,8,7);g.fillRect(2,4,12,3);g.fillStyle='#eacb68';g.fillRect(6,4,3,3);
    const tex=new T.CanvasTexture(c);tex.magFilter=T.NearestFilter;tex.colorSpace=T.SRGBColorSpace;
    const mesh=new T.InstancedMesh(geo,new T.MeshStandardMaterial({map:tex,transparent:true,alphaTest:.4,side:T.DoubleSide}),520);const d=new T.Object3D();
    let count=0;for(let i=0;i<260;i++){let x=(random()-.5)*34,z=(random()-.5)*43;if(Math.abs(x-scooterSpot.x)<scooterSpot.padWidth/2+.2&&Math.abs(z-scooterSpot.z)<scooterSpot.padDepth/2+.2||Math.abs(x-pathX(z))<2||Math.abs(x)<7.5&&z>-5&&z<4||Math.abs(x)<4&&z< -14)continue;
      for(let j=0;j<2;j++){d.position.set(x,.36,z);d.rotation.y=j*Math.PI/2;d.scale.setScalar(.7+random()*.6);d.updateMatrix();mesh.setMatrixAt(count++,d.matrix);}}
    mesh.count=count;mesh.castShadow=false;scene.add(mesh);
  }
  return b.colliders;
}


