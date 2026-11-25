import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
let R,S,Cam,root,armL,armR,mS,mF,pupils,sh,coin,body;
function mat(c,r=.55){return new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:0})}
function init(cv){
 R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true});R.setPixelRatio(1);R.setSize(640,640,false);R.setClearColor(0x000000,0);
 S=new THREE.Scene();Cam=new THREE.PerspectiveCamera(32,1,.1,50);Cam.position.set(0,1.5,8.2);Cam.lookAt(0,1.45,0);
 S.add(new THREE.HemisphereLight(0xffffff,0x9fb4c8,1.25));const dl=new THREE.DirectionalLight(0xffffff,2.4);dl.position.set(3,5,5);S.add(dl);
 root=new THREE.Group();S.add(root);
 body=new THREE.Mesh(new RoundedBoxGeometry(1.5,1.9,1.2,6,.28),mat(0xF6EBDD));body.position.y=1.35;root.add(body);
 for(const x of[-.4,.4])for(const y of[1.0,.62]){const w=new THREE.Mesh(new RoundedBoxGeometry(.34,.28,.08,3,.05),mat(0x6FC3C9,.3));w.position.set(x,y,.62);root.add(w)}
 for(const x of[-.35,.35]){const l=new THREE.Mesh(new THREE.CylinderGeometry(.17,.2,.42,16),mat(0xE0A458));l.position.set(x,.21,0);root.add(l)}
 const hat=new THREE.Mesh(new THREE.SphereGeometry(.92,32,16,0,Math.PI*2,0,Math.PI/2),mat(0xFFD400,.35));hat.scale.set(1,.8,.9);hat.position.y=2.28;root.add(hat);
 const brim=new THREE.Mesh(new THREE.CylinderGeometry(1.02,1.02,.1,32),mat(0xFFD400,.35));brim.position.set(0,2.26,.08);root.add(brim);
 const ridge=new THREE.Mesh(new RoundedBoxGeometry(.22,.12,1.5,3,.05),mat(0xF2C200,.35));ridge.position.set(0,2.95,0);root.add(ridge);
 for(const x of[-.36,.36]){const e=new THREE.Mesh(new THREE.SphereGeometry(.19,24,16),mat(0xffffff,.3));e.scale.z=.55;e.position.set(x,1.78,.6);root.add(e)}
 pupils=[];for(const x of[-.36,.36]){const p=new THREE.Mesh(new THREE.SphereGeometry(.09,16,12),mat(0x1d1d1d,.2));p.position.set(x,1.78,.72);root.add(p);pupils.push(p)}
 for(const x of[-.62,.62]){const c=new THREE.Mesh(new THREE.CircleGeometry(.11,20),new THREE.MeshBasicMaterial({color:0xFF9AA2,transparent:true,opacity:.8}));c.position.set(x,1.55,.605);root.add(c)}
 const mm=new THREE.MeshBasicMaterial({color:0x5a2a2a});
 mS=new THREE.Mesh(new THREE.TorusGeometry(.2,.04,8,24,Math.PI),mm);mS.rotation.z=Math.PI;mS.position.set(0,1.52,.62);root.add(mS);
 mF=new THREE.Mesh(new THREE.TorusGeometry(.2,.04,8,24,Math.PI),mm);mF.position.set(0,1.38,.62);root.add(mF);
 function arm(sx){const g=new THREE.Group();g.position.set(sx*.86,1.65,0);const a=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.5,6,12),mat(0xF6EBDD));a.position.y=-.35;g.add(a);const h=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),mat(0xFFD400,.4));h.position.y=-.72;g.add(h);root.add(g);return g}
 armR=arm(1);armL=arm(-1);
 sh=new THREE.Mesh(new THREE.CircleGeometry(.95,32),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28}));sh.rotation.x=-Math.PI/2;sh.position.y=.02;S.add(sh);
 coin=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.08,28),mat(0xFFC400,.25));coin.rotation.x=Math.PI/2;S.add(coin);
}
function set(t,mood,lt){
 const e=cl(lt/.55),bk=1+2.2*Math.pow(e-1,3)+1.2*Math.pow(e-1,2);const pop=Math.max(.001,bk);
 let y=Math.abs(Math.sin(t*3.2))*.07,aR=.15+Math.sin(t*3)*.05,aL=-.15-Math.sin(t*3)*.05,rz=0,sy=1,smile=true,py=0;
 coin.visible=false;
 if(mood=='up'){y=Math.abs(Math.sin(t*4.2))*.5;aR=2.6+Math.sin(t*9)*.25;aL=-2.6-Math.sin(t*9)*.25;}
 else if(mood=='down'){y=-.04;sy=.93+Math.sin(t*2)*.01;aR=.12;aL=-.12;rz=Math.sin(t*1.4)*.05;smile=false;py=-.04}
 else if(mood=='deal'){y=Math.abs(Math.sin(t*3.6))*.18;aR=1.3+Math.sin(t*6)*.3;aL=-1.3-Math.sin(t*6+1)*.3;coin.visible=true;coin.position.set(Math.sin(t*2)*.1,3.45+Math.sin(t*3)*.1,0);coin.rotation.y=t*5}
 else{aR=2.35+Math.sin(t*7)*.35}
 root.position.y=y;root.scale.set(pop,pop*sy,pop);root.rotation.y=Math.sin(t*1.3)*.28;root.rotation.z=rz;
 armR.rotation.z=aR;armL.rotation.z=aL;mS.visible=smile;mF.visible=!smile;pupils.forEach(p=>p.position.y=1.78+py);
 const ss=(1-y*.7)*pop;sh.scale.set(ss,ss,1);sh.material.opacity=.28-y*.2;
 R.render(S,Cam);
}
window.Mascot={init,set};
