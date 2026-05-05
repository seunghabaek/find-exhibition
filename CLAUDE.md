# CLAUDE.md

Claude Code가 이 프로젝트에서 작업할 때 참고하는 가이드예요.

## 프로젝트 개요

서울 전시회를 카카오맵 위에서 탐색하는 **토스 미니앱 (WebView 방식)**.

## 기술 스택

- `@apps-in-toss/web-framework` — Apps in Toss Web Framework (Granite)
- React + TypeScript + Vite
- `@toss/tds-mobile`, `@toss/tds-mobile-ait` — TDS Mobile 디자인 시스템
- 카카오맵 JavaScript API (JavaScript 키: `58b6c5725510c0445c2a73f43756bcfa`)

## 개발 서버

```bash
npx vite --port 4000
```

`npm run dev`는 포트 8081을 쓰는데 다른 프로젝트가 점유 중이라 위 명령어로 직접 실행.

## 파일 구조

```
src/
├── main.tsx               # TDSMobileAITProvider 래핑
├── App.tsx                # 상태 기반 라우팅 (map ↔ detail)
├── data/
│   └── exhibitions.json  # 전시회 데이터
├── hooks/
│   └── useKakaoMap.ts    # 지도 초기화, 마커, 좌표 캐싱
└── pages/
    ├── MapPage.tsx        # 지도 + 필터 + 하단 리스트
    └── DetailPage.tsx     # 전시 상세 정보
```

## 주요 규칙

### 외부 URL 열기
`<a target="_blank">` 사용 금지. 반드시 아래 패턴 사용:

```ts
import { openURL } from "@apps-in-toss/web-framework";

function handleOpenURL(url: string) {
  openURL(url).catch(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  });
}
```

`openURL`은 Promise를 반환하므로 `.catch()`로 브라우저 fallback 처리.

### TDS 컴포넌트 주의사항

- `BottomCTA.Single`은 자체가 `<button>` 래퍼 → 내부에 `Button` 넣으면 button > button 중첩으로 클릭 불가
  → 대신 `fixed div + Button(onClick)` 조합 사용
- `hasSafeAreaPadding`은 Toss 앱 WebView 전용 → 브라우저 테스트 시 `false`로 설정
- TDS 컴포넌트는 반드시 `TDSMobileAITProvider` 하위에서 사용 (`main.tsx`에 이미 설정됨)

### 카카오맵
- 스크립트 로딩: `autoload=false` + 동적 로딩 (`index.html` 참고)
- 좌표는 localStorage에 캐싱 (`kakao_coords_` prefix)
- 카카오 콘솔에 도메인 등록 필요: `http://localhost:4000`

### 전시회 상태 판별

```ts
const now = new Date();
const isUpcoming = new Date(exhibition.startDate) > now;  // 오픈예정
const isOngoing = !isUpcoming && new Date(exhibition.endDate) >= now;  // 진행중
// 둘 다 아니면 종료
```

### 데이터 (exhibitions.json)
- `category`: `"미술전"` 또는 `"사진전"` 두 가지만 사용
- `price`: 숫자 문자열 또는 `"무료"`
- `thumbnailUrl`: 비어있으면 ListRow에서 이미지 미표시

## 참고 문서

- [앱인토스 개발자센터](https://developers-apps-in-toss.toss.im/)
- [TDS Mobile](https://tossmini-docs.toss.im/tds-mobile/start/)
- [카카오맵 가이드](https://apis.map.kakao.com/web/guide/)
- [LLM용 전체 문서](https://developers-apps-in-toss.toss.im/llms-full.txt)
