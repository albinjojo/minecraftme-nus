import * as T from 'three';

// Original voxel avatar. Its front faces -Z; the little heart backpack faces the camera.
export function createCharacter(scene:T.Scene) {
  const root=new T.Group();root.name='Pink garden friend';scene.add(root);
  const body=new T.Group();root.add(body);
  const material=(color:string)=>new T.MeshStandardMaterial({color,roughness:.92});
  const pink=material('#ed91bb'),light=material('#ffd1e6'),dark=material('#b94f87');
  const cream=material('#ffe7d8'),hair=material('#6f3e59'),eyes=material('#352b44'),white=material('#fff8f1');
  const geometry=new T.BoxGeometry(1,1,1);
  const cube=(parent:T.Object3D,mat:T.Material,x:number,y:number,z:number,w:number,h:number,d:number)=>{
    const mesh=new T.Mesh(geometry,mat);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.receiveShadow=true;parent.add(mesh);return mesh;
  };
  cube(body,pink,0,.81,0,.49,.53,.30);
  cube(body,light,0,.57,0,.50,.10,.31);
  // Oversized square hood with small cat ears and a pixel face.
  const head=new T.Group();head.position.y=1.24;body.add(head);
  cube(head,pink,0,0,0,.62,.57,.55);
  for(const side of [-1,1]){
    cube(head,pink,side*.23,.34,0,.16,.20,.19);
    cube(head,light,side*.23,.34,-.105,.08,.10,.025);
  }
  cube(head,cream,0,-.025,-.283,.44,.36,.025);
  cube(head,hair,0,.13,-.305,.45,.07,.025);
  cube(head,hair,-.19,.055,-.305,.06,.18,.025);
  for(const side of [-1,1]){
    cube(head,eyes,side*.10,-.01,-.305,.055,.075,.025);
    cube(head,white,side*.10-.009,.01,-.322,.018,.022,.008);
    cube(head,dark,side*.15,-.10,-.305,.06,.025,.025);
  }
  cube(head,hair,0,-.12,-.305,.055,.018,.025);
  const arms:T.Group[]=[],legs:T.Group[]=[];
  for(const side of [-1,1]){
    const arm=new T.Group();arm.position.set(side*.335,1.015,0);body.add(arm);arms.push(arm);
    cube(arm,pink,0,-.19,0,.17,.40,.22);cube(arm,cream,0,-.405,0,.16,.08,.20);
    cube(arm,light,0,-.335,0,.18,.06,.23);
    const leg=new T.Group();leg.position.set(side*.135,.53,0);body.add(leg);legs.push(leg);
    cube(leg,dark,0,-.205,0,.21,.41,.24);
    cube(leg,light,0,-.40,-.045,.23,.16,.32);
    cube(leg,white,0,-.47,-.045,.24,.035,.33);
  }
  // Backpack and tiny pixel heart on its back.
  cube(body,dark,0,.82,.205,.35,.36,.15);
  cube(body,light,0,.82,.29,.28,.29,.025);
  const heart=['0110110','1111111','0111110','0011100','0001000'];
  heart.forEach((row,y)=>[...row].forEach((v,x)=>{if(v==='1')cube(body,dark,(x-3)*.028,.88-y*.028,.311,.029,.029,.018);}));
  // A moving contact shadow works with the garden's cached static shadows.
  const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
  const ctx=canvas.getContext('2d')!;const gradient=ctx.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'rgba(39,24,47,.40)');gradient.addColorStop(1,'rgba(39,24,47,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
  const shadow=new T.Mesh(new T.PlaneGeometry(1.3,1.0),new T.MeshBasicMaterial({map:new T.CanvasTexture(canvas),transparent:true,depthWrite:false}));
  shadow.rotation.x=-Math.PI/2;scene.add(shadow);
  let step=0;
  return {root,animate(dt:number,moving:number,ground:number,jumping:boolean){
    step+=dt*moving*10;
    const swing=Math.sin(step)*Math.min(moving,1)*.65;
    arms[0].rotation.x=swing;arms[1].rotation.x=-swing;
    legs[0].rotation.x=-swing;legs[1].rotation.x=swing;
    body.position.y=jumping?0:Math.abs(Math.sin(step))*moving*.035;
    head.rotation.y=Math.sin(step*.5)*moving*.025;
    shadow.position.set(root.position.x,ground+.025,root.position.z);
    shadow.scale.setScalar(jumping?.7:1);
  }};
}
