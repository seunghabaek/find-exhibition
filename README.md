# 서울 전시회 지도

서울에서 진행 중이거나 곧 열릴 전시회를 지도 위에서 한눈에 탐색하는 토스 미니앱이에요.

## 주요 기능

- 카카오맵 위에 전시회 마커 표시
- 전체 / 무료 / 유료 필터
- 진행중 / 오픈예정 / 종료 상태 표시
- 전시회 상세 페이지 (기간, 장소, 입장료, 공식 사이트 링크)

## 기술 스택

- [Apps in Toss Web Framework](https://developers-apps-in-toss.toss.im/)
- React + TypeScript + Vite
- [TDS Mobile](https://tossmini-docs.toss.im/tds-mobile/start/) (Toss Design System)
- 카카오맵 JavaScript API

## 개발 서버 실행

```bash
npm install
npx vite --port 4000
```

브라우저에서 `http://localhost:4000` 접속

## 데이터

`src/data/exhibitions.json`에 전시회 데이터가 있어요. 아래 형식으로 추가할 수 있어요.

```json
{
  "id": "unique_id",
  "title": "전시 제목",
  "venue": "전시 장소명",
  "address": "전체 주소",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "category": "미술전 | 사진전",
  "thumbnailUrl": "",
  "sourceUrl": "https://...",
  "price": "숫자 문자열 또는 무료"
}
```

## 배포

```bash
npm run build
npm run deploy
```

- 배포 API 키: [앱인토스 콘솔](https://apps-in-toss.toss.im/) > 워크스페이스 > API 키

## 유용한 링크

- [앱인토스 콘솔](https://apps-in-toss.toss.im/)
- [앱인토스 개발자센터](https://developers-apps-in-toss.toss.im/)
- [카카오맵 가이드](https://apis.map.kakao.com/web/guide/)
- [TDS Mobile 문서](https://tossmini-docs.toss.im/tds-mobile/start/)
