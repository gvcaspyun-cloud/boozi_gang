# usage: python3 render.py <workdir>   (workdir has news.json + bg0..bgN.jpg)
import os,asyncio,subprocess,json,sys,datetime,shutil
from playwright.async_api import async_playwright
H=os.path.dirname(os.path.abspath(__file__));OUT=os.path.abspath(sys.argv[1]);FPS=30
FD=f"{H}/fonts/node_modules"
if not os.path.exists(f"{FD}/pretendard"):
    os.makedirs(FD,exist_ok=True);subprocess.run(["npm","install","--prefix",f"{H}/fonts","pretendard"],check=True)
CSS=open(f"{H}/style.css").read().replace("__FD__",FD)
nj=json.load(open(f"{OUT}/news.json"));d=datetime.date.fromisoformat(nj["date"]);WD="월화수목금토일"[d.weekday()]
n=len(nj["scenes"])
scenes=[("intro",None,["오늘의 부동산 뉴스","[[1분 뉴스]]로 정리했어요",f"{d.month}월 {d.day}일 {WD}요일"],1.0,dict(label="매일 아침 8:30",t=f"TOP {n}"))]
for i,s in enumerate(nj["scenes"]):scenes.append((s["src"],f"{i+1:02d}",s["lines"],1.05,s["ctr"]))
scenes.append(("outro",None,["[[매일 아침 8시 30분]]","부동산 1분 뉴스","@boozi_gang 팔로우"],1.0,dict(label="매일 아침",t="08:30")))
STEP,LEAD,TAIL=0.85,0.25,0.9
cfg=[dict(lay=(i+d.day)%3,mv=(i*2+d.day)%5,src=s,no=nn,lines=l,step=st,lead=LEAD,ctr=c,dur=LEAD+len(l)*st+TAIL) for i,(s,nn,l,st,c) in enumerate(scenes)]
shutil.copy(f"{OUT}/bg0.jpg",f"{OUT}/bg{len(cfg)-1}.jpg")
TOTAL=sum(c["dur"] for c in cfg);N=int(TOTAL*FPS)
HTML="""<html><head><meta charset=utf-8><style>@@CSS@@
body{height:1920px;background:#000}
.sc{position:absolute;inset:0;overflow:hidden}
.t{position:absolute;left:70px;right:70px;top:800px;display:flex;flex-direction:column;gap:14px;z-index:4}
.tag{position:absolute;left:70px;top:395px;font-family:'PT';font-weight:700;font-size:30px;letter-spacing:1px;color:#FFE500;opacity:0;z-index:4}
.t .l{font-family:'PT';font-weight:800;font-size:66px;line-height:1.28;letter-spacing:-1.5px;color:#fff;text-shadow:0 2px 16px rgba(0,0,0,.75);opacity:0;white-space:nowrap}
.big .l{font-size:82px}.big .t{top:820px}
.sc.lay1 .t{top:300px}.sc.lay1.big .t{top:330px}.sc.lay1 .tag{top:225px}
.sc.lay2 .t{top:880px;align-items:center;text-align:center}.sc.lay2.big .t{top:900px}.sc.lay2 .tag{left:0;right:0;text-align:center;top:480px}
mark{background:linear-gradient(#FFE500,#FFE500) left bottom/var(--w,0%) 5px no-repeat;color:#FFE500;padding:0 0 3px}
.pb{position:absolute;left:0;top:0;height:6px;background:#FFE500;z-index:9;width:0}
</style></head><body><canvas id=cv width=1080 height=1920 style="position:absolute;left:0;top:0"></canvas><div id=root></div>
<div class=pb id=pb></div>
<script>@@JS@@</script></body></html>"""
js=open(f"{H}/vid.js").read().replace("@@CFG@@",json.dumps(cfg)).replace("@@TOT@@",str(TOTAL)).replace("@@OUT@@",OUT)
open(f"{OUT}/p.html","w").write(HTML.replace("@@CSS@@",CSS).replace("@@JS@@",js))
offs=[0]
for c in cfg: offs.append(offs[-1]+c["dur"])
async def prev():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--allow-file-access-from-files"]);pg=await b.new_page(viewport={"width":1080,"height":1920});pg.on("pageerror",lambda e:print("ERR",e))
        await pg.goto(f"file://{OUT}/p.html");await pg.wait_for_function("window.ready===true",timeout=60000);await pg.wait_for_timeout(600)
        for i in range(len(cfg)):
            await pg.evaluate(f"draw({offs[i]+cfg[i]['dur']-0.5})");await pg.screenshot(path=f"{OUT}/prev_{i}.png")
        await b.close()
async def work(b,ci,a,z):
    pg=await b.new_page(viewport={"width":1080,"height":1920});await pg.goto(f"file://{OUT}/p.html");await pg.wait_for_function("window.ready===true",timeout=60000);await pg.wait_for_timeout(600)
    tmp=f"{OUT}/c{ci}.tmp.mp4"
    ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","image2pipe","-framerate",str(FPS),"-c:v","mjpeg","-i","-","-c:v","libx264","-crf","22","-preset","veryfast","-pix_fmt","yuv420p","-r",str(FPS),tmp],stdin=subprocess.PIPE)
    for k in range(a,z):
        await pg.evaluate(f"draw({k/FPS})");ff.stdin.write(await pg.screenshot(type="jpeg",quality=90))
    ff.stdin.close();ff.wait();os.rename(tmp,f"{OUT}/c{ci}.mp4")
async def main():
    W=4;ch=[(i*N//W,(i+1)*N//W) for i in range(W)]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--allow-file-access-from-files"])
        await asyncio.gather(*[work(b,i,a,z) for i,(a,z) in enumerate(ch)]);await b.close()
    open(f"{OUT}/all.txt","w").write("".join(f"file '{OUT}/c{i}.mp4'\n" for i in range(W)))
    subprocess.run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",f"{OUT}/all.txt","-c","copy",f"{OUT}/v.tmp.mp4"],check=True)
    subprocess.run(["python3",f"{H}/make_bgm.py",str(TOTAL),f"{OUT}/bgm.wav"],check=True)
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",f"{OUT}/v.tmp.mp4","-i",f"{OUT}/bgm.wav","-map","0:v","-map","1:a","-c:v","copy","-c:a","aac","-b:a","192k","-shortest","-movflags","+faststart",f"{OUT}/reel.tmp.mp4"],check=True)
    os.rename(f"{OUT}/reel.tmp.mp4",f"{OUT}/reel.mp4");print("ok",TOTAL)
asyncio.run(prev() if "--prev" in sys.argv else main())
