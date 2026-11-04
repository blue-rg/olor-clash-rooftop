# COLOR CLASH 3D — ROOFTOP EDITION

**실제로 조작할 수 있는 브라우저 3D 물감 배틀 게임**입니다. 참고 이미지의 분위기를 살려 3인칭 시점, 관절이 움직이는 캐릭터, 달리기와 슬라이딩, 물감총 발사 반동, 피격·부활 효과, 분홍 옥상과 콘크리트 엄폐물 등을 새로 구현했습니다.

> 참고 이미지처럼 정교한 상용 게임용 인체 리깅·텍스처·애니메이션 자산을 포함한 것은 아닙니다. 본 배포판은 Three.js에서 직접 조립한 **스타일화된 3D 캐릭터**를 움직이는 웹게임 프로토타입입니다. 메뉴 배경 이미지는 콘셉트 이미지이며, 실제 경기는 Three.js 3D 렌더링으로 진행됩니다.

## 구성 파일

```text
COLOR_CLASH_GitHub_3D_자연스러운캐릭터/
├─ index.html               ← 웹페이지 첫 화면
├─ game.js                  ← 3D 캐릭터, 경기장, 물감 전투, 수학 문제, 온라인 통신
├─ style.css                ← UI 디자인
├─ config.js                ← Firebase 설정 (이 파일 한 곳만 수정)
├─ database.rules.json      ← Firebase 콘솔의 Realtime Database 규칙 탭에 사용
├─ assets/
│  └─ rooftop-poster.webp   ← 첫 화면 콘셉트 이미지
├─ .nojekyll
└─ README_설치와_사용법.md
```

## ① 일단 게임 실행하기 — Firebase 없이 AI 연습

`config.js`의 `apiKey`가 `YOUR_FIREBASE_WEB_API_KEY`라면 자동으로 **AI 연습 모드**가 실행됩니다. 추가 등록 없이 게임 화면, 수학 문제, 물감 공격, 부활까지 미리 체험할 수 있습니다.

GitHub Pages에 업로드한 뒤 주소를 열어 `플레이어 이름 → 게임 방 만들기 → 페인트 배틀 시작하기` 순서로 누르세요. AI 3명이 자동으로 들어옵니다. 개인전/팀전도 첫 화면에서 선택할 수 있습니다.

**주의:** 네트워크가 필요합니다. Three.js는 외부 CDN, Firebase 코드는 Google 서버에서 로딩합니다. 현재 패키지에는 Three.js/Firebase SDK의 오프라인 복사본이 없습니다. `index.html`을 파일 탐색기에서 더블 클릭하는 `file://` 방식에서는 브라우저 보안 때문에 모듈 실행이 실패할 수 있으므로 GitHub Pages 주소에서 실행하세요.

## ② GitHub Pages에 게임 올리기 (Node.js 필요 없음)

1. [github.com](https://github.com/)에서 로그인하고 **New repository**로 공개 저장소를 만듭니다. 예: `color-clash-rooftop`.
2. 저장소에서 **Add file → Upload files**를 누릅니다.
3. 압축을 푼 폴더 안의 `index.html`, `game.js`, `style.css`, `config.js`, `database.rules.json`, `.nojekyll`, `assets` 폴더, README를 **저장소의 최상위에** 업로드합니다. 특히 `index.html`이 저장소 최상위에 있어야 합니다. GitHub 웹 업로드에서 폴더 구조가 올바르게 올라갔는지 `assets/rooftop-poster.webp` 경로를 확인합니다.
4. **Commit changes**를 누릅니다.
5. 저장소 **Settings → Pages**로 이동합니다.
6. **Build and deployment → Source**를 **Deploy from a branch**로 바꿉니다.
7. **Branch = main, folder = /(root)**를 선택하고 **Save**합니다.
8. 표시된 사이트 주소 `https://사용자이름.github.io/color-clash-rooftop/`를 엽니다. 사이트 발행에는 약간의 시간이 걸릴 수 있습니다.

GitHub 공식 설명: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## ③ 기존 Firebase 프로젝트 `math641`을 연결해 최대 4명 대전하기

`config.js`에는 앞선 대화에서 확인한 `math641` 프로젝트의 `authDomain`, `databaseURL`, `projectId`, `appId`가 이미 들어 있습니다. **Firebase의 웹 앱 API 키 1개만** 입력하면 됩니다.

1. Firebase 콘솔 https://console.firebase.google.com/ → **math641** 선택.
2. **프로젝트 설정(톱니바퀴) → 일반 → 내 앱 → 웹 앱 → SDK 설정 및 구성 → 구성(Config)**.
3. `apiKey`의 실제 값을 복사합니다. GitHub 저장소의 `config.js`에서 다음 줄을 수정합니다.

   ```js
   apiKey: 'YOUR_FIREBASE_WEB_API_KEY',
   ```

   를

   ```js
   apiKey: 'Firebase에서_복사한_실제_키',
   ```

   로 바꾸고 **Commit changes**로 저장합니다. 설정된 다른 값들이 본인 프로젝트와 일치하는지도 확인합니다.

4. Firebase 콘솔에서 **Authentication → Sign-in method → 익명(Anonymous) → 사용 설정 → 저장**.
5. **Realtime Database → 규칙**에서 `database.rules.json` 파일의 **전체 내용**을 붙여넣고 **게시**합니다. 기존 규칙을 덮어쓰기 전에 다른 앱에서 사용 중인지 확인하세요. Firebase 프로젝트 하나를 이 게임 전용으로 사용하는 것이 안전합니다.
6. GitHub Pages 주소를 새로고침합니다. 첫 화면 상태가 `FIREBASE ONLINE`으로 변하면 연결된 것입니다.
7. 방장이 **방 만들기 → 방 코드/초대 링크 복사**, 다른 학생 최대 3명이 **방 코드로 입장**, 방장이 **시작하기**를 누릅니다. 빈자리는 AI가 채웁니다.

**Firebase 웹 앱 API 키는 공개 클라이언트 앱 설정값으로서 자체적으로 비밀 인증 수단이 아닙니다.** 실제 접근 제한은 인증 및 Realtime Database 보안 규칙으로 처리합니다. Firebase SDK는 Google 제공 모듈 CDN을 사용합니다. 익명 인증, 읽기·쓰기 권한 설정이 누락되면 네트워크 대전이 연결되지 않을 수 있습니다.

Firebase 익명 로그인 공식 설명: https://firebase.google.com/docs/auth/web/anonymous-auth

## ④ 조작법

| 조작 | 행동 |
|---|---|
| `W A S D` / 방향키 | 캐릭터 이동 (부드러운 가속과 감속) |
| `Shift` | 달리기 |
| `C` | 짧은 슬라이딩 |
| 화면 짧은 클릭 / 터치 | 해당 위치 조준 + 물감 발사 |
| 화면 드래그 | 시점 회전 |
| `L` 또는 화면 상단 마우스 조준 버튼 | FPS 마우스 잠금 전환 (지원 브라우저) |
| `Esc` | FPS 마우스 잠금 해제 |
| `F` / `Space` / 발사 버튼 | 화면 중앙으로 발사 |
| `Q` / 문제 풀기 버튼 | 수학 문제창 열기 / 닫기 |
| 모바일 · 태블릿 | 왼쪽 조이스틱 이동, 오른쪽 발사/문제 버튼, 터치 조준 |

**수학 문제를 풀고 있는 동안에도 상대가 공격할 수 있습니다.**

## ⑤ 게임 규칙

- **개인전**: 4명(인간 1~4명, 빈자리 AI), 각각 빨강·파랑·노랑·초록으로 대전.
- **2:2 팀전**: 1번·3번 빨강팀, 2번·4번 파랑팀. 아군 물감 공격은 무효.
- 소수·분수의 비를 간단한 자연수의 비로 나타내는 수학 **교과서 82~83쪽** 문제만 출제.
- 정답 1개당 물감 총알 **3발** 충전(최대 24발).
- 캐릭터 몸통의 **6개 색칠 칸**이 같은 공격 색으로 완성되면 아웃. 마지막 명중을 시킨 공격자에게 **아웃 1점**.
- **2초 후** 시작 위치에서 색칠 초기화 후 부활.
- 라운드 **4분** 종료 시 아웃 횟수가 많은 개인 또는 팀 승리. 최고점 동점이면 무승부.

## 참고 및 제한 사항

- 이 구현은 **방장 브라우저가 정답·명중·아웃 판정**을 수행합니다. 방장이 탭을 닫으면 온라인 경기 판정이 중단됩니다. 전문 FPS 서버의 고정밀 저지연·부정행위 방지 수준은 아닙니다.
- Firebase 무료 사용량을 초과하는 사용이나 학교 네트워크 정책에 따라 데이터 전송 제한·지연이 발생할 수 있습니다.
- 실제 Firebase 사용자 계정에 연결한 4인 교실 실전 테스트는 진행되지 않았습니다. 수업 전에 교사용 컴퓨터 1대와 학생 기기 1대로 먼저 테스트하세요.
- 이미지에 보이는 수준의 고품질 GLB 캐릭터/모션캡처는 추후 별도 모델 자산을 확보해 대체할 수 있습니다. 지금 버전은 독립된 실시간 3D 캐릭터와 로직을 갖춘 플레이 가능한 프로토타입입니다.
- 초등학생은 실명 대신 별명을 사용하도록 안내하세요.
