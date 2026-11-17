import numpy as np,wave,sys
sr=44100;dur=float(sys.argv[1]);bpm=104;beat=60/bpm;N=int(dur*sr);t=np.arange(N)/sr
out=np.zeros((N,2));rng=np.random.default_rng(3)
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*sr)
    if i>=N: return
    s=sig[:N-i]; out[i:i+len(s),0]+=s*g*(1-pan)/2*1.4; out[i:i+len(s),1]+=s*g*(1+pan)/2*1.4
def tone(f,d,dec=6,harm=(1,.35,.15,.08),att=0.004):
    n=int(d*sr);tt=np.arange(n)/sr;s=sum(h*np.sin(2*np.pi*f*(k+1)*tt) for k,h in enumerate(harm))
    e=np.exp(-dec*tt)*np.minimum(1,tt/att);return s*e
def hz(m): return 440*2**((m-69)/12)
def noise(d,hp=True):
    n=int(d*sr);x=rng.standard_normal(n)
    if hp: x=np.diff(x,prepend=0)
    return x
chords=[(48,[60,64,67]),(43,[59,62,67]),(45,[60,64,69]),(41,[60,65,69])]   # C G Am F
pent=[72,74,76,79,81,84]
bar=4*beat;nb=int(dur/bar)+1
for b in range(nb):
    root,notes=chords[b%4];t0=b*bar
    # soft keys comp
    for pos in (0,1.5,2.5,3):
        for m in notes: add(tone(hz(m),0.5,dec=7,harm=(1,.5,.2,.1)),t0+pos*beat,pan=((m%5)-2)/6,g=0.07)
    # bass
    for pos in (0,2,3.5): add(tone(hz(root-12+12),beat*1.2,dec=4,harm=(1,.25)),t0+pos*beat,g=0.32)
    # drums
    for pos in (0,2): 
        n=int(0.25*sr);tt=np.arange(n)/sr;k=np.sin(2*np.pi*(55*tt+ (95*(1-np.exp(-30*tt)))/30*0+ 70*(1-np.exp(-25*tt))/25))*np.exp(-14*tt);add(k,t0+pos*beat,g=0.45 if b>=1 else 0)
    for pos in (1,3): add(noise(0.12,False)*np.exp(-np.arange(int(0.12*sr))/sr*30),t0+pos*beat,g=0.09 if b>=2 else 0)
    for e in range(8):
        add(noise(0.05)*np.exp(-np.arange(int(0.05*sr))/sr*90),t0+e*beat/2,pan=0.3,g=0.05*(1.4 if e%2 else 0.8))
    # bell melody from bar 2
    if b>=2:
        for e in range(8):
            if (e+b)%3==0 or e in (0,5):
                m=pent[(e*3+b*2)%len(pent)];add(tone(hz(m),0.6,dec=5,harm=(1,.2,.6,.1)),t0+e*beat/2,pan=0.4,g=0.09)
# echo
d=int(0.29*sr);ech=np.zeros_like(out);ech[d:]=out[:-d]*0.28;out+=ech
env=np.minimum(1,t/1.2)*np.minimum(1,(dur-t)/2.5)
out*= env[:,None]
out/=np.max(np.abs(out))*1.12
w=wave.open(sys.argv[2],"wb");w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype("<i2").tobytes());w.close()
