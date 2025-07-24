# notion-webhook-runner

Notion DB의 "보고확인" 체크 및 "금주/차주 보고내용" 자동 기록/초기화 자동화 스크립트입니다.

## 폴더 구조
```
notion-webhook-runner/
├── .github/
│   └── workflows/
│       └── cron.yml        ← GitHub Action 정의
├── index.js                ← Webhook 처리/자동화 스크립트
├── package.json
├── .env                   ← Notion API 키 (보안 필요)
└── README.md
```

## 환경변수 (.env)
```
NOTION_TOKEN=노션_시크릿_키
NOTION_DATABASE_ID=노션_DB_ID
```

## 사용법

### 1. 로컬에서 수동 실행
```
npm install
node index.js
```

### 2. GitHub Actions로 주기적(cron) 자동 실행
- `.github/workflows/cron.yml`에서 스케줄(cron) 설정 가능
- 예시: 매일 오전 9시 자동 실행

```
name: Notion 자동화
on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  run-notion:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Node.js 설치
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'
      - name: 의존성 설치
        run: npm install
      - name: .env 파일 생성
        run: |
          echo "NOTION_TOKEN=${{ secrets.NOTION_TOKEN }}" >> .env
          echo "NOTION_DATABASE_ID=${{ secrets.NOTION_DATABASE_ID }}" >> .env
      - name: 자동화 스크립트 실행
        run: node index.js
```

- **보안:** Notion API 키와 DB ID는 GitHub Secrets에 등록 후 사용하세요.

## 주요 기능
- "보고확인" 체크된 row만 본문에 날짜별로 기록
- "금주/차주 보고내용"은 비우고, "보고확인" 체크 해제
- 기록은 깔끔한 구분선/이모지/날짜 포맷으로 남김

---
문의: IT팀 