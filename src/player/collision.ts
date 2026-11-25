export type Bounds={min:{x:number;y:number;z:number};max:{x:number;y:number;z:number}};
export function isBlocked(x:number,z:number,eyeY:number,bounds:Bounds[]){
  return Math.abs(x)>18||Math.abs(z)>22||bounds.some(b=>eyeY-1.5<b.max.y&&eyeY>b.min.y&&x>b.min.x-.28&&x<b.max.x+.28&&z>b.min.z-.28&&z<b.max.z+.28);
}
export function groundHeight(x:number,z:number){return Math.abs(x)<1.7&&z>-4.5&&z<3.5?.30+Math.max(0,Math.sin((z+4)/7*Math.PI))*.55:0;}
