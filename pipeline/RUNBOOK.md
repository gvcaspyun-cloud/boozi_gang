# 부지깽 매일 릴스 자동 게시 런북 (평일 08:30 KST)

계정: 인스타 @boozi_gang (Windsor instagram, account id 17841412913762184). 저장소: gvcaspyun-cloud/boozi_gang (이 파일 위치 pipeline/).

## 순서
1. 저장소 attach(add_repo push) 후 /home/claude/boozi_gang 사용. `pip install playwright numpy`, `playwright install chromium`(없으면), ffmpeg 필요.
2. 먼저 reels/ 아래 가장 최근 2개 날짜의 news.json을 읽고 어제·그제와 겹치는 주제·기사·사진 검색어·사진가를 피한다.
   WebSearch로 오늘(KST) 한국 부동산 뉴스 TOP 10 선정. 최근 24~48시간 기사, 주제 분산. 10개 중 최소 3~4개는 '딜·거래' 소식(빌딩/오피스 매각·인수, 물류센터·호텔 거래, 리츠·펀드, PF·시행사 소식, 대형 수주, 경매·공매 낙찰)으로 채우고, 나머지는 시세·전월세·금리·분양·재건축·정책·지역에서 섞는다. 같은 지표(주간 아파트값 등)는 이틀 연속 1번 항목으로 쓰지 않는다. 각 기사는 반드시 WebFetch로 사실 확인. 본문 문장 복사 금지, 사실만 자기 말로 재작성.
3. workdir(/home/claude/work_today)에 news.json 작성:
   {"date":"YYYY-MM-DD","intro_q":"...","scenes":[{"src":"언론사 · MM.DD","lines":[4줄],"ctr":{"label":"...","n":숫자,"u":"단위"} 또는 {"label":"...","t":"텍스트"},"q":"사진 영어 검색어"}] x10}
   - lines: 4줄, 줄당 약 16자 이내. 강조는 [[단어]], 카운트업 숫자는 #350#만. 톤은 편한 구어체(~예요/~했어요), 힙한 수사 금지, 숫자는 기사 근거만.
   - ctr: 큰 숫자 하나(n, dec:true면 소수1자리) 또는 텍스트 t. 기사에 없는 숫자 금지.
   - q: 기사 내용과 시각적으로 맞는 사진 검색어. 10개 모두 서로 다른 피사체·구도로(예: 'office tower skyline dusk', 'logistics warehouse aerial', 'hotel lobby interior', 'construction site cranes', 'handshake business meeting', 'subway commuters seoul', 'apartment complex night windows'). 콘크리트 외벽 클로즈업·동전·열쇠 같은 흔한 컷은 하루 최대 1장. 사람 얼굴 중심은 피함.
4. `UNSPLASH_KEY=<키> python3 pipeline/fetch_photos.py workdir` 후 `python3 -I pipeline/render.py workdir` → workdir/reel.mp4 (약 62초, BGM 포함). 영상 중간 프레임 1~2개 `--prev`로 확인(글자 잘림/겹침).
5. workdir/news.json과 by.json도 reels/YYYY-MM-DD/에 함께 복사한다(다음날 중복 회피용). reel.mp4를 reels/YYYY-MM-DD/reel.mp4로 복사 → git commit(-c user.name=boozi -c user.email=gvcaspyun@gmail.com) → push.
6. raw URL(https://raw.githubusercontent.com/gvcaspyun-cloud/boozi_gang/main/reels/YYYY-MM-DD/reel.mp4)이 200 되면 Windsor instagram `create_video_post`(share_to_feed true, thumb_offset 600) 실행.
7. 캡션: "📰 오늘의 부동산 뉴스 TOP 10, 1분 뉴스로 정리했어요" + 한줄 요약 + "매일 아침 8시 30분, @boozi_gang 팔로우하고 놓치지 마세요 🔔" + "출처: 언론사들" + "사진: Unsplash (사진가 이름들, by.json)" + 해시태그 10개. 면책문구 넣지 않음.
8. 실패 시 재시도 1회, 그래도 실패하면 게시하지 말고 원인을 요약해 알림.

## 규칙
- 영상 하단/상단에 브랜드 박스·출처 표기 없음(출처는 캡션에만).
- 실존 인물 사진·로고·유료 이미지 사용 금지.
- 주말 실행 없음(월~금).

## 품질 점검(게시 전 필수)
- `python3 -I pipeline/render.py workdir --prev`로 prev_*.png를 만들어 12장을 한 장으로 합쳐 눈으로 확인: 글자가 화면 밖으로 나가거나 겹치지 않는지. 문제면 문구를 줄이고 다시 렌더.
- 레이아웃(글자 위치 3종)과 사진 움직임은 날짜별로 자동 변주된다. 사진이 비슷해 보이면 q를 바꿔 다시 받는다.
