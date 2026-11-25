import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Keep its parking bay and plant clearance aligned with the model.
export const scooterSpot={x:-1.9,z:11.2,yaw:Math.PI/2,padWidth:3.05,padDepth:1.8};

// An original small motor scooter; static parts are merged by material for mobile.
export function addScooter(scene:T.Scene){
  const yellow=new T.MeshStandardMaterial({color:'#f8c631',roughness:.52,metalness:.12});
  const pale=new T.MeshStandardMaterial({color:'#fff0b9',roughness:.65});
  const rubber=new T.MeshStandardMaterial({color:'#292632',roughness:1});
  const seat=new T.MeshStandardMaterial({color:'#654337',roughness:.95});
  const chrome=new T.MeshStandardMaterial({color:'#cbd7d5',roughness:.35,metalness:.65});
  const headlight=new T.MeshStandardMaterial({color:'#fff5da',emissive:'#ffdf8b',emissiveIntensity:.7,roughness:.3});
  const red=new T.MeshStandardMaterial({color:'#c24c57',emissive:'#aa253a',emissiveIntensity:.2});
  const parts=new Map<T.Material,T.BufferGeometry[]>();
  const transform=new T.Object3D();
  function add(mat:T.Material,geometry:T.BufferGeometry,x:number,y:number,z:number,rz=0){
    transform.position.set(x,y,z);transform.rotation.set(0,0,rz);transform.updateMatrix();geometry.applyMatrix4(transform.matrix);
    if(!parts.has(mat))parts.set(mat,[]);parts.get(mat)!.push(geometry);
  }
  function box(mat:T.Material,x:number,y:number,z:number,w:number,h:number,d:number){add(mat,new T.BoxGeometry(w,h,d),x,y,z);}
  // Two faceted rubber wheels and contrasting hubs, running along the local Z axis.
  for(const z of [-.88,.86]){
    add(rubber,new T.CylinderGeometry(.31,.31,.20,12),0,.32,z,Math.PI/2);
    for(const side of [-1,1]){
      add(chrome,new T.CylinderGeometry(.17,.17,.014,12),side*.108,.32,z,Math.PI/2);
      add(yellow,new T.CylinderGeometry(.08,.08,.022,8),side*.12,.32,z,Math.PI/2);
      box(chrome,side*.12,.32,z,.023,.25,.035);box(chrome,side*.12,.32,z,.023,.035,.25);
    }
  }
  // Low step-through deck, curved-by-steps rear body, fenders and saddle.
  box(chrome,0,.42,-.01,.57,.10,1.55);
  box(yellow,0,.49,-.03,.62,.11,1.45);
  box(rubber,0,.555,-.15,.44,.035,.66);
  box(yellow,0,.72,.70,.70,.46,.86);
  box(yellow,0,.94,.64,.60,.20,.73);
  box(yellow,0,.64,1.09,.56,.23,.26);
  box(pale,0,.72,1.235,.42,.065,.025);
  box(red,0,.87,1.13,.26,.12,.035);
  box(chrome,0,.54,1.19,.64,.06,.08);
  box(pale,0,1.075,.58,.66,.06,.86);
  box(seat,0,1.15,.57,.66,.14,.90);
  box(seat,0,1.20,.56,.55,.06,.76);
  for(const x of [-.36,.36]){
    box(pale,x,.80,.63,.018,.045,.53);
    for(let i=0;i<3;i++)box(chrome,x,.69,.55+i*.12,.02,.035,.06);
  }
  // Upright yellow leg shield, fork and front wheel cover.
  box(chrome,0,.66,-.86,.10,.60,.12);
  box(yellow,0,.84,-.61,.65,.76,.23);
  box(yellow,0,1.18,-.64,.55,.20,.25);
  box(pale,0,.86,-.745,.045,.62,.024);
  box(yellow,0,.62,-.91,.40,.16,.61);
  box(yellow,0,.55,-1.17,.34,.14,.12);
  // Handlebar, lamp, dark grips and two square mirrors.
  box(chrome,0,1.39,-.64,.12,.28,.12);
  box(yellow,0,1.46,-.66,.76,.21,.24);
  for(const x of [-.48,.48])box(rubber,x,1.46,-.64,.25,.11,.13);
  box(chrome,0,1.48,-.80,.29,.25,.08);
  box(headlight,0,1.48,-.847,.23,.18,.025);
  box(rubber,0,1.57,-.57,.23,.025,.10);
  for(const x of [-.39,.39]){
    box(chrome,x,1.68,-.63,.035,.33,.035);
    box(chrome,x,1.86,-.63,.21,.16,.055);
    box(pale,x,1.86,-.595,.16,.11,.012);
  }
  box(chrome,.24,.21,.25,.055,.37,.055);box(rubber,.24,.035,.25,.16,.045,.14);
  // Batch the entire vehicle into seven static meshes instead of dozens of parts.
  const scooter=new T.Group();scooter.name='Yellow garden scooter';
  for(const [material,geometries] of parts){
    const geometry=mergeGeometries(geometries);if(!geometry)throw new Error('Could not merge scooter geometry');
    const mesh=new T.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;scooter.add(mesh);geometries.forEach(g=>g.dispose());
  }
  scooter.position.set(scooterSpot.x,.24,scooterSpot.z);scooter.rotation.y=scooterSpot.yaw;scene.add(scooter);scooter.updateMatrixWorld(true);
  return new T.Box3().setFromObject(scooter);
}
