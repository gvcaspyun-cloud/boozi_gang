# usage: UNSPLASH_KEY=... python3 fetch_photos.py <workdir>
# news.json: {"date":..., "intro_q":"...", "scenes":[{..., "q":"english search query"}]}
# writes bg0 (intro) bg1..bgN (stories), by.json (photographer names)
import os,sys,json,urllib.request,urllib.parse
W=sys.argv[1];K=os.environ["UNSPLASH_KEY"];nj=json.load(open(f"{W}/news.json"))
H={"Authorization":"Client-ID "+K,"Accept-Version":"v1"}
def get(u,raw=False):
    r=urllib.request.urlopen(urllib.request.Request(u,headers=H),timeout=30).read();return r if raw else json.loads(r)
used=set();by={}
qs=[nj.get("intro_q","korea apartment complex sunrise")]+[s["q"] for s in nj["scenes"]]
for i,q in enumerate(qs):
    res=get("https://api.unsplash.com/search/photos?"+urllib.parse.urlencode(dict(query=q,orientation="portrait",content_filter="high",per_page=10)))["results"]
    pick=next((r for r in res if r["id"] not in used),None)
    if not pick: raise SystemExit(f"no photo for {q}")
    used.add(pick["id"]);by[i]=pick["user"]["name"]
    open(f"{W}/bg{i}.jpg","wb").write(get(pick["urls"]["raw"]+"&w=1400&h=2000&fit=crop&q=85&fm=jpg",True))
    try:get(pick["links"]["download_location"])
    except Exception:pass
json.dump(by,open(f"{W}/by.json","w"),ensure_ascii=False);print(by)
