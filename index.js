// .env 파일을 로드하여 환경변수를 사용할 수 있게 설정
require('dotenv').config();

// Notion API 클라이언트 불러오기
const { Client } = require('@notionhq/client');

// Notion 클라이언트 인스턴스 생성 (인증 토큰 사용)
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Notion 데이터베이스 ID 환경변수에서 가져오기 (둘 다 지원)
const DB_ID = process.env.NOTION_DATABASE_ID || process.env.DATABASE_ID;

// Notion 자동화 메인 함수 정의 (비동기)
async function runNotionAutomation() {
  try {

    console.log("📄 NOTION_DATABASE_ID:", process.env.NOTION_DATABASE_ID);

    // 데이터베이스에서 모든 페이지(행) 쿼리
    const res = await notion.databases.query({ database_id: DB_ID });

    // 각 페이지(행) 순회
    for (const page of res.results) {
<<<<<<< Updated upstream
      // '보고확인' 체크박스 값 추출 (체크 여부)
      const 확인 = page.properties['보고확인']?.checkbox;
      // '금주/차주 보고내용'의 첫 번째 rich_text 내용 추출
      const 보고내용 = page.properties['금주/차주 보고내용']?.rich_text?.[0]?.text?.content;
=======
      // '상태' 속성 확인 (진행중인지  체크)
      const 상태속성 = page.properties['상태'];
      let 상태 = null;
      
      if (상태속성) {
        if (상태속성.type === 'status') {
          // Status 타입 (Notion의 기본 상태 컬럼)
          상태 = 상태속성.status?.name || null;
        } else if (상태속성.type === 'select') {
          // Select 타입 (사용자 정의 선택 컬럼)
          상태 = 상태속성.select?.name || null;
        }
      }
      
      const 진행중 = 상태 === '진행 중';
      
      // '보고확인' 체크박스 값 추출 (원래 방식으로 복원 - 더 안전하게)
      const 보고확인속성 = page.properties['보고확인'];
      const 확인 = 보고확인속성?.type === 'checkbox' ? 보고확인속성.checkbox === true : false;
      
      // '금주/차주 보고내용'의 첫 번째 rich_text 내용 추출 (원래 방식으로 복원)
      const 보고내용속성 = page.properties['금주/차주 보고내용'];
      let 보고내용 = null;
      if (보고내용속성?.type === 'rich_text' && 보고내용속성.rich_text && 보고내용속성.rich_text.length > 0) {
        // rich_text 배열의 모든 항목에서 텍스트 추출 (plain_text 우선, 없으면 text.content)
        const texts = 보고내용속성.rich_text
          .map(item => item.plain_text || item.text?.content || '')
          .filter(text => text && text.trim().length > 0);
        보고내용 = texts.length > 0 ? texts.join('\n') : null;
      }
>>>>>>> Stashed changes

      // '보고확인'이 체크되어 있고, '금주/차주 보고내용'이 비어있지 않은 경우에만 처리
      if (확인 && 보고내용) {
        // 현재 날짜를 "YYYY년 MM월 DD일" 형식으로 포맷
        const now = new Date();
        const today = `${now.getFullYear()}년 ${String(now.getMonth()+1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;

        // 해당 페이지에 블록(구분선, 날짜, 보고내용, 구분선) 추가
        await notion.blocks.children.append({
          block_id: page.id, // 블록을 추가할 대상 페이지 ID
          children: [
            // 구분선 블록
            { object: 'block', type: 'divider', divider: {} },
            // 날짜 표시 블록
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: `🗓️ ${today}` } }
                ]
              }
            },
            // 보고내용 표시 블록
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  { type: 'text', text: { content: `📌 ${보고내용}` } }
                ]
              }
            },
            // 구분선 블록
            { object: 'block', type: 'divider', divider: {} }
          ]
        });

        // 해당 페이지의 '금주/차주 보고내용'을 비우고, '보고확인' 체크 해제
        await notion.pages.update({
          page_id: page.id,
          properties: {
            '금주/차주 보고내용': { rich_text: [] },
            '보고확인': { checkbox: false }
          }
        });

        // 처리 완료 로그 출력
        console.log(`[✔] 자동화 처리 완료: ${page.id}`);
      }
    }
  } catch (err) {
    // 에러 발생 시 에러 메시지 출력
    console.error('에러:', err);
  }
}

// 자동화 함수 실행
runNotionAutomation(); 