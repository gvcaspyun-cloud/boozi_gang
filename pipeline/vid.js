const C=@@CFG@@,TOT=@@TOT@@;
const root=document.getElementById('root'),cv=document.getElementById('cv'),cx=cv.getContext('2d');
const eo=x=>1-Math.pow(1-x,3),cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
function fmt(s){return s.replace(/\[\[(.*?)\]\]/g,'<mark>$1</mark>').replace(/#(\d+)#/g,'<span class=cn data-v=$1>$1</span>')}
C.forEach(s=>{const d=document.createElement('div');d.className='sc'+(s.lines.length<=3?' big':'');d.style.display='none';
 d.innerHTML=(s.no?'<div class=tag>NEWS '+s.no+'</div>':'')+'<div class=t>'+s.lines.map(l=>'<div class=l>'+fmt(l)+'</div>').join('')+'</div>';root.appendChild(d);s.el=d});
let off=[0];C.forEach(s=>off.push(off[off.length-1]+s.dur));
const IM=[];let loaded=0;window.ready=false;
const NI=C.length;for(let i=0;i<NI;i++){const im=new Image();im.onload=()=>{if(++loaded==NI)document.fonts.load('800 100px PT').then(()=>document.fonts.ready).then(()=>window.ready=true)};im.src='file://@@OUT@@/bg'+i+'.jpg';IM.push(im)}
function bgp(k,lt,dur,al){const im=IM[k],p=lt/dur,z=1.04+0.16*p,sc=Math.max(1080/im.width,1920/im.height)*z,w=im.width*sc,h=im.height*sc,dx=(k%2?-1:1)*p*40;
 cx.save();cx.globalAlpha=al;cx.filter='saturate(.88) contrast(1.06) brightness(.96)';cx.drawImage(im,(1080-w)/2+dx,(1920-h)/2,w,h);cx.filter='none';
 const g=cx.createLinearGradient(0,0,0,1920);g.addColorStop(0,'rgba(0,0,0,.5)');g.addColorStop(.14,'rgba(0,0,0,.12)');g.addColorStop(.2,'rgba(0,0,0,.4)');g.addColorStop(.3,'rgba(0,0,0,.62)');g.addColorStop(.62,'rgba(0,0,0,.66)');g.addColorStop(.74,'rgba(0,0,0,.25)');g.addColorStop(.86,'rgba(0,0,0,.2)');g.addColorStop(1,'rgba(0,0,0,.75)');cx.fillStyle=g;cx.fillRect(0,0,1080,1920);cx.restore()}
function counter(s,lt){const c=s.ctr;if(!c)return;const e=eo(cl((lt-0.15)/0.6));cx.save();cx.globalAlpha=e;cx.translate(0,(1-e)*30);cx.shadowColor='rgba(0,0,0,.55)';cx.shadowBlur=24;cx.textAlign='left';cx.textBaseline='alphabetic';
 cx.fillStyle='#FFE500';cx.font="700 34px PT";cx.fillText(c.label,70,490);
 let txt=c.t;if(c.n!=null){const v=c.n*eo(cl((lt-0.25)/1.6));txt=c.dec?v.toFixed(1):Math.round(v).toLocaleString('en-US')}
 cx.fillStyle='#fff';cx.font="800 200px PT";cx.fillText(txt,66,690);const w=cx.measureText(txt).width;
 if(c.u){cx.font="800 66px PT";cx.fillText(c.u,66+w+18,690)}cx.restore()}
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
 
 document.getElementById('pb').style.width=(t/TOT*100)+'%';
};
