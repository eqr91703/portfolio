/**
 * GeneratePortfolio.ts
 * Build-time script: 讀取 content/zh-TW/ 所有 Markdown，
 * 合併輸出成 public/portfolio.md（供下載 & Phase 3 AI Context 用）
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'zh-TW');
const outputPath = path.join(process.cwd(), 'public', 'portfolio.md');

const ORDER = ['profile', 'experience', 'skills', 'education', 'projects'];

function sectionTitle(filename: string): string {
  const map: Record<string, string> = {
    profile: '個人簡介',
    experience: '工作經歷',
    skills: '技術能力',
    education: '學歷',
    projects: 'Side Projects',
  };
  return map[filename] ?? filename;
}

function formatFrontmatter(data: Record<string, unknown>, filename: string): string {
  const lines: string[] = [];

  switch (filename) {
    case 'profile': {
      lines.push(`姓名：${data.name}`);
      lines.push(`職稱：${data.title}`);
      lines.push(`Tagline：${data.tagline}`);
      lines.push(`Email：${data.email}`);
      if (data.github) lines.push(`GitHub：${data.github}`);
      if (data.linkedin) lines.push(`LinkedIn：${data.linkedin}`);
      break;
    }
    case 'experience': {
      const entries = data.entries as Array<{
        title: string;
        company: string;
        period: string;
        highlights: string[];
      }>;
      entries.forEach((e) => {
        lines.push(`\n### ${e.title} @ ${e.company}（${e.period}）`);
        e.highlights.forEach((h) => lines.push(`- ${h}`));
      });
      break;
    }
    case 'skills': {
      const categories = data.categories as Array<{ name: string; skills: string[] }>;
      categories.forEach((cat) => {
        lines.push(`\n**${cat.name}**：${cat.skills.join('、')}`);
      });
      const certs = data.certifications as Array<{ name: string; issuer: string }>;
      if (certs?.length) {
        lines.push(`\n**證照**：${certs.map((c) => c.name).join('、')}`);
      }
      const soft = data.soft_skills as string[];
      if (soft?.length) {
        lines.push(`\n**軟實力**：${soft.join('、')}`);
      }
      break;
    }
    case 'education': {
      const entries = data.entries as Array<{
        school: string;
        degree: string;
        department: string;
        period: string;
        achievements: string[];
      }>;
      entries.forEach((e) => {
        lines.push(`\n### ${e.school}（${e.period}）`);
        lines.push(`${e.degree} · ${e.department}`);
        if (e.achievements?.length) {
          lines.push('\n**成就：**');
          e.achievements.forEach((a) => lines.push(`- ${a}`));
        }
      });
      break;
    }
    case 'projects': {
      const entries = data.entries as Array<{
        name: string;
        description: string;
        tags: string[];
        github: string;
      }>;
      if (!entries?.length) {
        lines.push('（專案陸續建立中）');
      } else {
        entries.forEach((p) => {
          lines.push(`\n### ${p.name}`);
          lines.push(p.description);
          if (p.tags?.length) lines.push(`技術：${p.tags.join('、')}`);
          if (p.github) lines.push(`GitHub：${p.github}`);
        });
      }
      break;
    }
  }

  return lines.join('\n');
}

function generate() {
  const parts: string[] = ['# 王之豪 個人 Portfolio\n'];
  parts.push('> 此文件由 GeneratePortfolio.ts 自動產生，供 AI 問答使用。\n');

  ORDER.forEach((name) => {
    const filePath = path.join(contentDir, `${name}.md`);
    if (!fs.existsSync(filePath)) return;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    parts.push(`\n## ${sectionTitle(name)}\n`);
    parts.push(formatFrontmatter(data, name));
    if (content.trim()) parts.push(`\n${content.trim()}`);
  });

  const output = parts.join('\n');
  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`✅ portfolio.md 已產生：${outputPath}`);
  console.log(`   字數：${output.length} 字元`);
}

generate();
