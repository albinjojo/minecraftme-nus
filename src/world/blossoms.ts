import {Builder} from './materials';

// Original voxel botanicals inspired by the supplied flower-and-vine reference.
// Broad stepped petals form a bloom viewed both from above and underneath.
function blossom(b:Builder,x:number,y:number,z:number,size=1,hanging=false){
  const cube=(mat:Parameters<Builder['box']>[0],dx:number,dy:number,dz:number,w:number,h:number,d:number)=>b.box(mat,x+dx*size,y+dy*size,z+dz*size,w*size,h*size,d*size);
  for(const direction of [0,1,2,3]){
    const along=(a:number,side:number)=>direction===0?[a,side]:direction===1?[-a,side]:direction===2?[side,a]:[side,-a];
    for(const [distance,width,length,level] of [[.23,.52,.42,0],[.48,.64,.28,-.035],[.66,.44,.18,-.085],[.78,.22,.12,-.12]]){
      const [dx,dz]=along(distance,0);const [w,d]=direction<2?[length,width]:[width,length];
      cube(distance>.6?'petalLight':'petalPink',dx,level,dz,w,.10,d);
      if(distance<.6){const [sx,sz]=along(distance,-width*.28);cube('petalDark',sx,level-.055,sz,direction<2?length*.7:.10,.025,direction<2?.10:length*.7);}
    }
  }
  cube('petalDark',0,-.02,0,.38,.13,.38);
  cube('pollen',0,hanging?-.12:.10,0,.25,.16,.25);
  cube('petalLight',-.07,hanging?-.21:.20,-.04,.07,.035,.08);
  if(hanging){cube('vineStem',0,.35,0,.11,.65,.11);for(const direction of [-1,1])cube('vineLeaf',direction*.22,.20,0,.42,.08,.22);}
  else{
    b.box('vineStem',x,y/2,z,.09,y,.09);
    for(const side of [-1,1])b.box('vineLeaf',x+side*.22,y*.45,z,.48,.09,.26);
  }
}

function vine(b:Builder,x:number,y:number,z:number,length:number,phase=0){
  for(let i=0;i<length;i++){
    const px=x+Math.sin(i*.8+phase)*.18,py=y-i*.26;
    b.box('vineStem',px,py,z,.065,.32,.065);
    const side=i%2===0?-1:1;
    b.box(i%3===0?'vineLight':'vineLeaf',px+side*.17,py-.08,z,.34,.20,.17);
    b.box('vineLight',px+side*.29,py-.06,z-.03,.13,.12,.19);
    if(i%4===1){b.box('pollen',px+side*.11,py-.20,z-.10,.14,.19,.14);b.box('vineLight',px+side*.11,py-.10,z-.10,.17,.07,.16);}
  }
}

export function addBlossoms(b:Builder){
  // Hanging blooms and lush trailing foliage welcome the little pink character.
  for(const x of [-2.35,2.35]){blossom(b,x,3.55,18.85,.85,true);vine(b,x,4.65,18.9,5,x);}
  for(const x of [-3.45,3.45]){vine(b,x,4.25,18.65,12,x);vine(b,x+.17,3.7,19.2,8,x+1);}
  // Low, broad blooms sit in deliberate beds rather than obstructing the path.
  for(const [x,z,size] of [[-4.6,14,1.1],[4.8,11,.95],[-4,7,1.1],[5.4,4.3,.9],[-5.2,4.3,.95],[-5.2,-5.4,1.1],[5.3,-6.0,1.0],[-5.8,-11.5,1.2],[5.7,-12,1.1],[-6.4,-15.5,1.2],[6.1,-17,1.0],[-7.1,-18.6,.9]]){
    blossom(b,x,.75,z,size);blossom(b,x+.75,.40,z+.75,size*.55);blossom(b,x-.7,.50,z-.45,size*.65);
  }
  // Canopy blooms with cascades of green leaves and amber buds.
  for(const [x,y,z] of [[-5.2,4.15,15.6],[6,4.2,13.8],[-6,4.4,6.5],[7,4.2,3.8],[-7,4.7,-12],[7.0,4.7,-14.0]]){
    blossom(b,x,y,z,.95,true);vine(b,x-.65,y+1.1,z,7,x);vine(b,x+.65,y+.9,z+.2,9,z);
  }
  // The apology board is framed with living vines and pink flowers.
  for(const x of [-5.35,5.35]){vine(b,x,7.25,-16.55,17,x);vine(b,x+.3,7.15,-16.7,12,x+1);blossom(b,x,6.7,-16.45,.68,true);}
  for(let x=-4.6;x<=4.7;x+=1.15){b.box('vineLeaf',x,7.08,-16.9,.9,.22,.40);b.box('vineLight',x+.25,7.20,-16.9,.40,.16,.35);}
  for(const x of [-4.6,-2.3,2.3,4.6])blossom(b,x,7.05,-16.8,.42,true);
}
