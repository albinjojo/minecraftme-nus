import * as T from 'three';
import { config } from '../config';
import { random } from '../world/materials';
export function atmosphere(scene:T.Scene){
  scene.background=new T.Color(config.theme.sky);scene.fog=new T.FogExp2('#e6b5b6',.023);
  scene.add(new T.HemisphereLight('#fff1de','#776783',2));
  const sun=new T.DirectionalLight(config.timeOfDay.sunColor,config.timeOfDay.intensity);sun.position.set(-18,28,-15);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-26,right:26,top:28,bottom:-28,near:1,far:85});sun.shadow.bias=-.0004;sun.shadow.normalBias=.04;sun.shadow.radius=3;scene.add(sun);
  const sky=new T.Mesh(new T.SphereGeometry(150,32,20),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{},vertexShader:'varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 v;void main(){float h=normalize(v).y;vec3 c=mix(vec3(.96,.69,.59),vec3(.43,.48,.69),smoothstep(0.,.8,h));gl_FragColor=vec4(c,1.);}'}));scene.add(sky);
  const disc=new T.Mesh(new T.SphereGeometry(4,24,16),new T.MeshBasicMaterial({color:'#ffe6b3',fog:false}));disc.position.set(-38,28,-80);scene.add(disc);
  const water=new T.Mesh(new T.PlaneGeometry(12.8,7.6,36,24),new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0}},vertexShader:'uniform float time;varying vec2 v;void main(){v=uv;vec3 p=position;p.z+=sin(p.x*2.+time)*.025+cos(p.y*3.+time)*.02;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',fragmentShader:'uniform float time;varying vec2 v;void main(){float r=sin(v.x*90.+sin(v.y*32.+time)*2.+time)*sin(v.y*80.-time);vec3 c=mix(vec3(.12,.40,.42),vec3(.66,.76,.68),pow(max(r,0.),12.)*.6);c+=pow(max(sin(v.y*60.+v.x*30.+time),0.),24.)*.12;gl_FragColor=vec4(c,.84);}'}));water.rotation.x=-Math.PI/2;water.position.set(0,.26,-.5);scene.add(water);
  // Gentle contact shadows ground the canopies and monument without a full-screen AO cost.
  const cv=document.createElement('canvas');cv.width=cv.height=64;const ctx=cv.getContext('2d')!;const grad=ctx.createRadialGradient(32,32,0,32,32,32);grad.addColorStop(0,'rgba(37,30,48,.32)');grad.addColorStop(1,'rgba(37,30,48,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,64,64);
  for(const [x,z] of [[-6,17],[7,16],[-7,8],[8,5],[-8,-12],[8,-14],[0,-17]]){const s=new T.Mesh(new T.PlaneGeometry(8,8),new T.MeshBasicMaterial({map:new T.CanvasTexture(cv),transparent:true,depthWrite:false}));s.rotation.x=-Math.PI/2;s.position.set(x,.15,z);scene.add(s);}
  const petals=new T.InstancedMesh(new T.PlaneGeometry(.12,.18),new T.MeshBasicMaterial({color:'#ffd1dd',side:T.DoubleSide}),config.particles.petals);scene.add(petals);
  const data=Array.from({length:config.particles.petals},()=>({x:(random()-.5)*35,y:random()*11,z:(random()-.5)*44,s:random()}));const d=new T.Object3D();
  const points=new Float32Array(config.particles.fireflies*3);for(let i=0;i<points.length;i+=3){points[i]=(random()-.5)*28;points[i+1]=.6+random()*2;points[i+2]=(random()-.5)*36;}
  const pgeo=new T.BufferGeometry();pgeo.setAttribute('position',new T.BufferAttribute(points,3));const fireflies=new T.Points(pgeo,new T.PointsMaterial({color:'#ffe9a1',size:.065,transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false}));scene.add(fireflies);
  return (time:number,reveal:boolean)=>{(water.material as T.ShaderMaterial).uniforms.time.value=time;
    data.forEach((p,i)=>{d.position.set(p.x+Math.sin(time*.4+p.s*10)*.8,(p.y-time*(.25+p.s*.18))%11+((p.y-time*(.25+p.s*.18))%11<0?11:0),p.z);d.rotation.set(time*.5+p.s*6,time*.3,Math.sin(time+p.s)*.8);d.scale.setScalar(reveal?1.5:1);d.updateMatrix();petals.setMatrixAt(i,d.matrix);});petals.instanceMatrix.needsUpdate=true;fireflies.position.y=Math.sin(time*.5)*.18;};
}
