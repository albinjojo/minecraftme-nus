import * as T from 'three';
import {Text} from 'troika-three-text';
import {config} from '../config';

export function messages(scene:T.Scene){
  function text(value:string,x:number,y:number,z:number,size:number,color='#fff3e0',maxWidth=5){
    const label=new Text();label.text=value;label.font='/fonts/Quicksand.ttf';label.fontSize=size;label.color=color;
    label.anchorX='center';label.anchorY='middle';label.textAlign='center';label.maxWidth=maxWidth;
    label.outlineWidth=color==='#fff3e0'?.018:0;label.outlineColor='#4a303e';label.position.set(x,y,z);
    label.material=new T.MeshBasicMaterial({color});label.sync();scene.add(label);return label;
  }
  config.messages.forEach((item,i)=>{
    const [x,y,z]=item.position;text(i===0?config.welcome:item.text,x,y,z+.14,.27);
    const board=new T.Mesh(new T.BoxGeometry(3.7,1.35,.18),new T.MeshStandardMaterial({color:'#523e3d',roughness:1}));
    board.position.set(x,y,z);board.castShadow=true;scene.add(board);
    for(const side of [-1,1]){
      const post=new T.Mesh(new T.BoxGeometry(.1,y,.1),new T.MeshStandardMaterial({color:'#836447'}));post.position.set(x+side*1.55,y/2,z);scene.add(post);
    }
  });
  // One oversized white apology board: the message is the monument itself.
  const [x,y,z]=config.finalPosition;
  const ink='#ad3d6c';
  // Thick original pixel lettering makes SORRY readable across the clearing.
  const glyphs:Record<string,string[]>={
    S:['11111','10000','10000','11111','00001','00001','11111'],
    O:['01110','11011','10001','10001','10001','11011','01110'],
    R:['11110','10001','10001','11110','10100','10010','10001'],
    Y:['10001','10001','01010','00100','00100','00100','00100'],
  };
  const pixels:{x:number;y:number}[]=[];const word=config.apology.heading.toUpperCase();const unit=.285;
  [...word].forEach((letter,index)=>(glyphs[letter]??glyphs.O).forEach((row,r)=>[...row].forEach((v,c)=>{if(v==='1')pixels.push({x:(index*6+c-(word.length*6-2)/2)*unit,y:y+1.24+(3-r)*unit});})));
  const lettering=new T.InstancedMesh(new T.BoxGeometry(unit,unit,.035),new T.MeshBasicMaterial({color:ink}),pixels.length);const transform=new T.Object3D();
  pixels.forEach((p,i)=>{transform.position.set(x+p.x,p.y,z+.02);transform.updateMatrix();lettering.setMatrixAt(i,transform.matrix);});lettering.computeBoundingSphere();scene.add(lettering);
  text(config.apology.nameLine,x,y-.30,z,.68,'#59364d',9);
  text(config.apology.smallLine,x,y-1.42,z,.40,'#68435c',9);
  // A second white panel at the side carries the personal dedication.
  const note=new T.Mesh(new T.BoxGeometry(3.35,2.25,.20),new T.MeshStandardMaterial({color:'#fffaf5',roughness:.9}));
  note.position.set(6.3,2.6,-12.6);note.castShadow=true;scene.add(note);
  text(config.apology.sideNote,6.3,2.6,-12.47,.42,'#68435c',2.9);
  for(const px of [4.9,7.7]){const post=new T.Mesh(new T.BoxGeometry(.14,2.4,.16),new T.MeshStandardMaterial({color:'#99715a'}));post.position.set(px,1.2,-12.6);scene.add(post);}
}
