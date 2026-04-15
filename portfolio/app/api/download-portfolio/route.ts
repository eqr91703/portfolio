import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'public', 'portfolio.md');
  const fileContent = readFileSync(filePath, 'utf-8');

  return new Response(fileContent, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="portfolio.md"',
    },
  });
}
