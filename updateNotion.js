require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_DATABASE_ID;

async function updatePages() {
  const res = await notion.databases.query({ database_id: DB_ID });

  for (const page of res.results) {
    const 기대효과 = page.properties['기대효과']?.rich_text?.[0]?.text?.content;
    if (!기대효과) continue;

    const today = new Date().toISOString().slice(0, 10);

    // 본문에 블록 추가
    await notion.blocks.children.append({
      block_id: page.id,
      children: [{
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'text',
            text: {
              content: `📅 ${today} - ${기대효과}`
            }
          }]
        }
      }]
    });

    // 기대효과 초기화
    await notion.pages.update({
      page_id: page.id,
      properties: {
        '기대효과': { rich_text: [] }
      }
    });

    console.log(`[✔] 기록 완료: ${page.id}`);
  }
}

updatePages().catch(console.error); 