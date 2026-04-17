import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'public', 'portfolio.pdf');

  try {
    const fileContent = readFileSync(filePath);
    return new Response(fileContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="ChihHao-Wang-Resume.pdf"',
      },
    });
  } catch {
    return new Response('PDF not found. Please rebuild the project.', { status: 404 });
  }
}
