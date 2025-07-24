require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_DATABASE_ID;

async function runNotionAutomation() {
  try {
    const res = await notion.databases.query({ database_id: DB_ID });
    for (const page of res.results) {
      const 확인 = page.properties['보고확인']?.checkbox;
      const 보고내용 = page.properties['금주/차주 보고내용']?.rich_text?.[0]?.text?.content;
      if (확인 && 보고내용) {
        const now = new Date();
        const today = `${now.getFullYear()}년 ${String(now.getMonth()+1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;
        const prettyText = [
          '---',
          `🗓️ ${today}`,
          '',
          `📌 ${보고내용}`,
          '---'
        ].join('\n');
        await notion.blocks.children.append({
          block_id: page.id,
          children: [{
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{
                type: 'text',
                text: { content: prettyText }
              }]
            }
          }]
        });
        await notion.pages.update({
          page_id: page.id,
          properties: {
            '금주/차주 보고내용': { rich_text: [] },
            '보고확인': { checkbox: false }
          }
        });
        console.log(`[✔] 자동화 처리 완료: ${page.id}`);
      }
    }
  } catch (err) {
    console.error('에러:', err);
  }
}

runNotionAutomation(); 