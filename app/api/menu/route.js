import fs from 'fs';
import path from 'path';


export async function PUT(req) {
  const data = await req.json(); // { updatedAt, items }
  const filePath = path.join(process.cwd(), 'data', 'menu.json');

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'menu.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return new Response(data, {
    headers: { 'Content-Type': 'application/json' }
  });
}
