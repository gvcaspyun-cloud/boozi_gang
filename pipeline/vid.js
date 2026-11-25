const C=@@CFG@@,TOT=@@TOT@@;
const root=document.getElementById('root'),cv=document.getElementById('cv'),cx=cv.getContext('2d');
const eo=x=>1-Math.pow(1-x,3),cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
function fmt(s){return s.replace(/\[\[(.*?)\]\]/g,'<mark>$1</mark>').replace(/#(\d+)#/g,'<span class=cn data-v=$1>$1</span>')}
C.forEach(s=>{const d=document.createElement('div');d.className='sc lay'+s.lay+(s.lines.length<=3?' big':'');d.style.display='none';
 d.innerHTML=(s.no?'<div class=tag>NEWS '+s.no+'</div>':'')+'<div class=t>'+s.lines.map(l=>'<div class=l>'+fmt(l)+'</div>').join('')+'</div>';root.appendChild(d);s.el=d});
let off=[0];C.forEach(s=>off.push(off[off.length-1]+s.dur));
const IM=[];let loaded=0;window.ready=false;
const NI=C.length;const SP={};['neutral','up','down','deal'].forEach(n=>{const im=new Image();im.onload=()=>{if(++loaded==NI+4)document.fonts.load('800 100px PT').then(()=>document.fonts.ready).then(()=>window.ready=true)};im.src='file://@@OUT@@/ch_'+n+'.png';SP[n]=im});for(let i=0;i<NI;i++){const im=new Image();im.onload=()=>{if(++loaded==NI+4)document.fonts.load('800 100px PT').then(()=>document.fonts.ready).then(()=>window.ready=true)};im.src='file://@@OUT@@/bg'+i+'.jpg';IM.push(im)}
const GR=[[[0,.5],[.14,.12],[.2,.4],[.3,.62],[.62,.66],[.74,.25],[.86,.2],[1,.75]],[[0,.72],[.35,.55],[.5,.18],[.7,.12],[.85,.35],[1,.8]],[[0,.55],[.3,.42],[.5,.52],[.75,.62],[1,.82]]];
function bgp(k,lt,dur,al){const im=IM[k],p=lt/dur,m=C[k].mv;let z=1.04+0.16*p,dx=0,dy=0;
 if(m==0)dx=p*40;else if(m==1)z=1.2-0.16*p;else if(m==2){z=1.12;dy=-p*60}else if(m==3){z=1.12;dy=p*60}else{z=1.06+0.12*p;dx=-p*50}
 const sc=Math.max(1080/im.width,1920/im.height)*z,w=im.width*sc,h=im.height*sc;
 cx.save();cx.globalAlpha=al;cx.filter='saturate(.88) contrast(1.06) brightness(.96)';cx.drawImage(im,(1080-w)/2+dx,(1920-h)/2+dy,w,h);cx.filter='none';
 const g=cx.createLinearGradient(0,0,0,1920);GR[C[k].lay].forEach(q=>g.addColorStop(q[0],'rgba(0,0,0,'+q[1]+')'));cx.fillStyle=g;cx.fillRect(0,0,1080,1920);cx.restore()}
function counter(s,lt){const c=s.ctr;if(!c)return;const L=s.lay,e=eo(cl((lt-0.15)/0.6));
 const fin=c.n!=null?(c.dec?c.n.toFixed(1):Math.round(c.n).toLocaleString('en-US')):c.t;
 cx.font="800 200px PT";const w0=cx.measureText(fin).width;cx.font="800 66px PT";const wu=c.u?cx.measureText(c.u).width+18:0;
 const f=Math.min(1,900/(w0+wu)),fs=200*f,us=66*f,tw=w0*f+wu*f;
 const P=[{x:66,ly:490,ny:690},{x:66,ly:1390,ny:1600},{x:(1080-tw)/2,ly:560,ny:770}][L];
 cx.save();cx.globalAlpha=e;cx.translate(0,(1-e)*30);cx.shadowColor='rgba(0,0,0,.55)';cx.shadowBlur=24;cx.textBaseline='alphabetic';
 cx.fillStyle='#FFE500';cx.font="700 34px PT";if(L==2){cx.textAlign='center';cx.fillText(c.label,540,P.ly)}else{cx.textAlign='left';cx.fillText(c.label,70,P.ly)}
 cx.textAlign='left';let txt=c.t;if(c.n!=null){const v=c.n*eo(cl((lt-0.25)/1.6));txt=c.dec?v.toFixed(1):Math.round(v).toLocaleString('en-US')}
 cx.fillStyle='#fff';cx.font="800 "+fs+"px PT";cx.fillText(txt,P.x,P.ny);const w=cx.measureText(c.n!=null?fin:txt).width;
 if(c.u){cx.font="800 "+us+"px PT";cx.fillText(c.u,P.x+w+18*f,P.ny)}cx.restore()}
function mascot(t,mood,lt){mx.setTransform(1,0,0,1,0,0);mx.clearRect(0,0,800,800);const im=SP[mood]||SP.neutral,e=cl(lt/.55),pop=Math.max(.001,1+2.2*Math.pow(e-1,3)+1.2*Math.pow(e-1,2));
 const h=650,w=Math.min(720,im.width*h/im.height);let jp=0,rot=Math.sin(t*1.6)*.03,sx=1,sy=1,dx=0;
 if(mood=='up'){const a=Math.abs(Math.sin(t*4.2));jp=a*80;rot=Math.sin(t*4.2)*.06;sy=1-.05*(1-a);sx=1+.04*(1-a)}
 else if(mood=='down'){jp=-8+Math.sin(t*2)*4;rot=Math.sin(t*1.5)*.025;dx=Math.sin(t*22)*2.5}
 else if(mood=='deal'){const a=Math.abs(Math.sin(t*3.2));jp=a*45;rot=Math.sin(t*2.2)*.06;sy=1-.03*(1-a)}
 else{jp=Math.abs(Math.sin(t*2.6))*14}
 mx.fillStyle='rgba(0,0,0,'+(.34-jp/400)+')';mx.beginPath();mx.ellipse(400+dx,748,w*.34*pop*(1-jp/350),20*pop,0,0,7);mx.fill();
 mx.save();mx.translate(400+dx,740-jp);mx.rotate(rot);mx.scale(pop*sx,pop*sy);mx.shadowColor='rgba(0,0,0,.45)';mx.shadowBlur=30;mx.drawImage(im,-w/2,-h,w,h);mx.restore()}
const MC=document.getElementById('mc');const mx=MC.getContext('2d');const MP=[[360,1100],[320,620],[140,1210]];
window.draw=function(t){
 let k=0;while(k<C.length-1&&t>=off[k+1])k++;
 const s=C[k],lt=t-off[k];C.forEach((c,i)=>c.el.style.display=i==k?'block':'none');
 cx.setTransform(1,0,0,1,0,0);cx.fillStyle='#000';cx.fillRect(0,0,1080,1920);
 const X=0.4;if(k>0&&lt<X){bgp(k-1,C[k-1].dur,C[k-1].dur,1);bgp(k,lt,s.dur,eo(lt/X))}else bgp(k,lt,s.dur,1);
 counter(s,lt);
 const tg=s.el.querySelector('.tag');if(tg)tg.style.opacity=eo(cl((lt-0.1)/0.5));
 s.el.querySelectorAll('.l').forEach((e,j)=>{
  const a=s.lead+j*s.step,u=eo(cl((lt-a)/0.5)),next=s.lead+(j+1)*s.step,dim=lt>next?cl((lt-next)/0.3):0;
  if(!e.dataset.f){e.dataset.f=1;const w=e.scrollWidth;if(w>940)e.style.fontSize=(parseFloat(getComputedStyle(e).fontSize)*940/w)+'px'}e.style.opacity=u*(1-0.28*dim);e.style.transform='translateY('+((1-u)*28)+'px)';
  e.querySelectorAll('mark').forEach(m=>m.style.setProperty('--w',(eo(cl((lt-a-0.2)/0.5))*100)+'%'));
  e.querySelectorAll('.cn').forEach(n=>{n.textContent=Math.round(+n.dataset.v*eo(cl((lt-a)/0.9))).toLocaleString('en-US')})});
 
 const mp=MP[s.lay];MC.style.left=mp[0]+'px';MC.style.top=mp[1]+'px';mascot(t,s.mood||'neutral',lt);
 document.getElementById('pb').style.width=(t/TOT*100)+'%';
};
