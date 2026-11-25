import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
let R,S,Cam,root,armL,armR,mS,mF,lens,sh,cash,hat;
function mat(c,r=.55,m=0){return new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m})}
function stripeTex(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='#161c33';g.fillRect(0,0,128,128);g.fillStyle='rgba(170,180,210,.22)';for(let x=8;x<128;x+=21)g.fillRect(x,0,2,128);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,1);return t}
function init(cv){
 R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true});R.setPixelRatio(1);R.setSize(800,800,false);R.setClearColor(0x000000,0);
 S=new THREE.Scene();Cam=new THREE.PerspectiveCamera(32,1,.1,50);Cam.position.set(0,1.75,9.6);Cam.lookAt(0,1.7,0);
 S.add(new THREE.HemisphereLight(0xffffff,0x7f8fb0,1.15));const dl=new THREE.DirectionalLight(0xffffff,2.5);dl.position.set(3,5,5);S.add(dl);const rl=new THREE.DirectionalLight(0xffb070,1.0);rl.position.set(-4,2,-3);S.add(rl);
 root=new THREE.Group();S.add(root);
 const suit=new THREE.MeshStandardMaterial({map:stripeTex(),roughness:.6});
 const body=new THREE.Mesh(new RoundedBoxGeometry(1.7,1.55,1.1,6,.25),suit);body.position.y=1.2;root.add(body);
 // white shirt V + red tie
 const v=new THREE.Shape();v.moveTo(-.38,0);v.lineTo(.38,0);v.lineTo(0,-.95);v.closePath();
 const shirt=new THREE.Mesh(new THREE.ShapeGeometry(v),mat(0xf5f5f0,.5));shirt.position.set(0,1.95,.555);root.add(shirt);
 const tie=new THREE.Shape();tie.moveTo(-.09,0);tie.lineTo(.09,0);tie.lineTo(.15,-.7);tie.lineTo(0,-.85);tie.lineTo(-.15,-.7);tie.closePath();
 const tm=new THREE.Mesh(new THREE.ShapeGeometry(tie),mat(0xc4162a,.4));tm.position.set(0,1.78,.565);root.add(tm);
 for(const sx of[-1,1]){const l=new THREE.Shape();l.moveTo(0,0);l.lineTo(.34*sx,0);l.lineTo(.12*sx,-.95);l.closePath();const lp=new THREE.Mesh(new THREE.ShapeGeometry(l),mat(0x141a30,.6));lp.position.set(.38*sx,1.95,.558);root.add(lp)}
 // chain + medallion
 const ch=new THREE.Mesh(new THREE.TorusGeometry(.42,.035,8,40,Math.PI),mat(0xFFC400,.25,.9));ch.rotation.z=Math.PI;ch.position.set(0,1.88,.6);root.add(ch);
 const md=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.05,24),mat(0xFFC400,.2,.9));md.rotation.x=Math.PI/2;md.position.set(0,1.38,.62);root.add(md);
 // legs + shoes
 for(const x of[-.4,.4]){const l=new THREE.Mesh(new THREE.CylinderGeometry(.2,.22,.45,16),mat(0x1c2440));l.position.set(x,.25,0);root.add(l);const s=new THREE.Mesh(new RoundedBoxGeometry(.4,.14,.62,3,.06),mat(0x0b0b0e,.2,.2));s.position.set(x,.05,.1);root.add(s)}
 // head
 const head=new THREE.Mesh(new THREE.SphereGeometry(.66,32,24),mat(0xf0c8a0,.6));head.position.y=2.55;head.scale.set(1,.95,.92);root.add(head);
 // sunglasses
 lens=new THREE.Group();lens.position.set(0,2.62,0);root.add(lens);
 for(const x of[-.27,.27]){const g=new THREE.Mesh(new RoundedBoxGeometry(.4,.26,.08,3,.07),mat(0x050507,.08,.4));g.position.set(x,0,.6);lens.add(g);const sh2=new THREE.Mesh(new THREE.PlaneGeometry(.12,.05),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35}));sh2.position.set(x-.07,.05,.645);lens.add(sh2)}
 const br=new THREE.Mesh(new THREE.BoxGeometry(.16,.04,.06),mat(0x050507));br.position.set(0,.04,.6);lens.add(br);
 const nose=new THREE.Mesh(new THREE.SphereGeometry(.07,12,10),mat(0xe0b088,.6));nose.position.set(0,2.45,.62);root.add(nose);
 const mm=new THREE.MeshBasicMaterial({color:0x4a2020});
 mS=new THREE.Mesh(new THREE.TorusGeometry(.2,.035,8,24,Math.PI),mm);mS.rotation.z=Math.PI;mS.position.set(.04,2.27,.58);mS.rotation.z=Math.PI+.12;root.add(mS);
 mF=new THREE.Mesh(new THREE.TorusGeometry(.2,.035,8,24,Math.PI),mm);mF.position.set(0,2.13,.58);root.add(mF);
 const tp=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.4,6),mat(0xe8d9b0));tp.rotation.z=Math.PI/2-.25;tp.position.set(.3,2.2,.62);root.add(tp);
 // fedora
 hat=new THREE.Group();hat.position.y=2.95;root.add(hat);
 const brim=new THREE.Mesh(new THREE.CylinderGeometry(1.08,1.08,.07,40),mat(0x121216,.5));brim.scale.z=.85;hat.add(brim);
 const crown=new THREE.Mesh(new THREE.CylinderGeometry(.5,.6,.5,32),mat(0x17171c,.5));crown.position.y=.28;hat.add(crown);
 const top=new THREE.Mesh(new THREE.SphereGeometry(.5,24,12,0,Math.PI*2,0,Math.PI/2),mat(0x17171c,.5));top.scale.set(1,.28,1);top.position.y=.53;hat.add(top);
 const band=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.13,32),mat(0xc4162a,.4));band.position.y=.1;hat.add(band);
 // arms
 function arm(sx){const g=new THREE.Group();g.position.set(sx*1.0,1.75,0);const a=new THREE.Mesh(new THREE.CapsuleGeometry(.16,.5,6,12),suit);a.position.y=-.38;g.add(a);const cf=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.08,16),mat(0xf5f5f0));cf.position.y=-.72;g.add(cf);const h=new THREE.Mesh(new THREE.SphereGeometry(.17,16,12),mat(0xf0c8a0));h.position.y=-.84;g.add(h);if(sx>0){const rg=new THREE.Mesh(new THREE.TorusGeometry(.07,.025,8,16),mat(0xFFC400,.2,.9));rg.position.set(.1,-.86,.07);g.add(rg)}root.add(g);return g}
 armR=arm(1);armL=arm(-1);
 sh=new THREE.Mesh(new THREE.CircleGeometry(1.0,32),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.3}));sh.rotation.x=-Math.PI/2;sh.position.y=.02;S.add(sh);
 cash=new THREE.Group();const cb=new THREE.Mesh(new RoundedBoxGeometry(.8,.34,.42,2,.04),mat(0x3f9b52,.5));cash.add(cb);const bd=new THREE.Mesh(new THREE.BoxGeometry(.2,.36,.44),mat(0xe6d9a8,.6));cash.add(bd);S.add(cash);
}
function set(t,mood,lt){
 const e=cl(lt/.55),bk=1+2.2*Math.pow(e-1,3)+1.2*Math.pow(e-1,2);const pop=Math.max(.001,bk);
 let y=Math.abs(Math.sin(t*2.6))*.05,aR=.18+Math.sin(t*2.4)*.05,aL=-.18-Math.sin(t*2.4)*.05,rz=Math.sin(t*1.6)*.03,sy=1,smile=true,ly=0,ht=Math.sin(t*1.6)*.04;
 cash.visible=false;
 if(mood=='up'){y=Math.abs(Math.sin(t*4.2))*.45;aR=2.55+Math.sin(t*9)*.25;aL=-2.55-Math.sin(t*9)*.25;ht=.15;rz=Math.sin(t*4.2)*.06}
 else if(mood=='down'){y=-.04;sy=.94+Math.sin(t*2)*.01;aR=.1;aL=-.1;rz=Math.sin(t*1.4)*.06;smile=false;ly=-.06;ht=-.28}
 else if(mood=='deal'){y=Math.abs(Math.sin(t*3.2))*.14;aR=1.2+Math.sin(t*5)*.3;aL=-1.2-Math.sin(t*5+1)*.3;cash.visible=true;cash.position.set(Math.sin(t*1.7)*.1,4.35+Math.sin(t*3)*.1,0);cash.rotation.y=t*4;cash.rotation.z=Math.sin(t*2)*.2;ht=.1}
 else{aR=2.3+Math.sin(t*7)*.3;ht=.08}
 root.position.y=y;root.scale.set(pop,pop*sy,pop);root.rotation.y=Math.sin(t*1.3)*.3;root.rotation.z=rz;
 armR.rotation.z=aR;armL.rotation.z=aL;mS.visible=smile;mF.visible=!smile;lens.position.y=2.62+ly;hat.rotation.z=ht;
 const ss=(1-y*.6)*pop;sh.scale.set(ss,ss,1);sh.material.opacity=.3-y*.2;
 R.render(S,Cam);
}
window.Mascot={init,set};
