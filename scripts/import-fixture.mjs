// An original miniature bridge in glTF: import feasibility without third-party build rights.
import {BoxGeometry} from 'three';
import {mkdirSync,writeFileSync} from 'node:fs';
const g=new BoxGeometry(1,1,1);const arrays=[g.attributes.position.array,g.attributes.normal.array,g.index.array];
let offset=0;const views=arrays.map(a=>{const v={buffer:0,byteOffset:offset,byteLength:a.byteLength};offset+=a.byteLength;return v;});
const buffer=Buffer.concat(arrays.map(a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength)));
const nodes=[];for(let z=-3;z<=3;z+=.5){const y=.3+Math.cos(z/3*Math.PI/2)*.5;nodes.push({mesh:0,translation:[0,y,z],scale:[3,.22,.46]});for(const x of [-1.5,1.5]){nodes.push({mesh:0,translation:[x,y+.6,z],scale:[.14,1.2,.14]},{mesh:0,translation:[x,y+1.2,z],scale:[.16,.16,.5]});}}
const file={asset:{version:'2.0',generator:'Original Surprise Garden import fixture'},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes:[{primitives:[{attributes:{POSITION:0,NORMAL:1},indices:2,material:0}]}],materials:[{pbrMetallicRoughness:{baseColorFactor:[.45,.25,.15,1],metallicFactor:0,roughnessFactor:.9}}],buffers:[{byteLength:buffer.length,uri:'data:application/octet-stream;base64,'+buffer.toString('base64')}],bufferViews:views,accessors:[{bufferView:0,componentType:5126,count:24,type:'VEC3',min:[-.5,-.5,-.5],max:[.5,.5,.5]},{bufferView:1,componentType:5126,count:24,type:'VEC3'},{bufferView:2,componentType:5123,count:36,type:'SCALAR'}]};
mkdirSync('public/models',{recursive:true});writeFileSync('public/models/bridge-prototype.gltf',JSON.stringify(file));
