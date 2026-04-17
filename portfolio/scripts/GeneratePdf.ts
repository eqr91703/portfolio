/**
 * GeneratePdf.ts
 * Build-time script: 讀取 content/zh-TW/ 資料，
 * 使用 @react-pdf/renderer + @fontsource/noto-sans-tc 產生 public/portfolio.pdf
 *
 * 字型策略：
 *  - NotoSansTCChinese：繁體中文字元（unicode CJK 範圍）
 *  - NotoSansTCLatin  ：拉丁/ASCII 字元
 *  - renderMixed()    ：對每個 Text node 自動按腳本切分，套用正確字型
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from '@react-pdf/renderer';

// ─── 路徑 ─────────────────────────────────────────────────────────────────────
const contentDir = path.join(process.cwd(), 'content', 'zh-TW');
const outputPath = path.join(process.cwd(), 'public', 'portfolio.pdf');
const fontsDir = path.join(
  process.cwd(),
  'node_modules/@fontsource/noto-sans-tc/files'
);

// ─── 字型名稱常數 ──────────────────────────────────────────────────────────────
const FONT_ZH = 'NotoSansTCChinese';
const FONT_LATIN = 'NotoSansTCLatin';

function registerFonts() {
  Font.register({
    family: FONT_ZH,
    fonts: [
      {
        src: path.join(fontsDir, 'noto-sans-tc-chinese-traditional-400-normal.woff'),
        fontWeight: 400,
      },
      {
        src: path.join(fontsDir, 'noto-sans-tc-chinese-traditional-700-normal.woff'),
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: FONT_LATIN,
    fonts: [
      {
        src: path.join(fontsDir, 'noto-sans-tc-latin-400-normal.woff'),
        fontWeight: 400,
      },
      {
        src: path.join(fontsDir, 'noto-sans-tc-latin-700-normal.woff'),
        fontWeight: 700,
      },
    ],
  });
}

// ─── 中英文腳本分段工具 ────────────────────────────────────────────────────────
function isCjk(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return (
    (code >= 0x4e00 && code <= 0x9fff) ||  // CJK Unified Ideographs
    (code >= 0x3400 && code <= 0x4dbf) ||  // CJK Extension A
    (code >= 0xf900 && code <= 0xfaff) ||  // CJK Compatibility
    (code >= 0x2e80 && code <= 0x2eff) ||  // CJK Radicals Supplement
    (code >= 0x3000 && code <= 0x303f) ||  // CJK Symbols & Punctuation
    (code >= 0xff00 && code <= 0xffef)     // Fullwidth Forms
  );
}

function splitByScript(text: string): Array<{ text: string; cjk: boolean }> {
  if (!text) return [];
  const runs: Array<{ text: string; cjk: boolean }> = [];
  let current = '';
  let currentCjk = isCjk(text[0]);

  for (const char of text) {
    const cjk = isCjk(char);
    if (cjk !== currentCjk) {
      if (current) runs.push({ text: current, cjk: currentCjk });
      current = char;
      currentCjk = cjk;
    } else {
      current += char;
    }
  }
  if (current) runs.push({ text: current, cjk: currentCjk });
  return runs;
}

/**
 * 混合文字渲染：自動按 CJK / Latin 切分後套用正確字型。
 * 字型外的其他樣式（fontWeight, fontSize, color 等）由父節點繼承。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function T(text: string, style: any, key?: string | number): React.ReactElement {
  const runs = splitByScript(text);

  if (runs.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.createElement(Text as any, { style, key }, '');
  }

  if (runs.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.createElement(
      Text as any,
      {
        style: { ...style, fontFamily: runs[0].cjk ? FONT_ZH : FONT_LATIN },
        key,
      },
      text
    );
  }

  // 多腳本混合：外層 Text 持有 layout 樣式，內層 Text 各自套字型
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.createElement(
    Text as any,
    { style, key },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...runs.map((run, i) =>
      React.createElement(
        Text as any,
        { key: i, style: { fontFamily: run.cjk ? FONT_ZH : FONT_LATIN } },
        run.text
      )
    )
  );
}

// ─── 樣式 ──────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 52,
    paddingRight: 52,
    fontFamily: FONT_ZH,
    fontSize: 10,
    color: '#1a1a1a',
    lineHeight: 1.6,
  },
  headerName: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  headerContact: {
    fontSize: 9,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 14,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
    borderBottomStyle: 'solid',
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  expTitle: {
    fontSize: 10,
    fontWeight: 700,
  },
  expPeriod: {
    fontSize: 9,
    color: '#777',
  },
  expCompany: {
    fontSize: 9,
    color: '#555',
    marginBottom: 3,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 1.5,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
    color: '#555',
    fontFamily: FONT_LATIN,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#333',
  },
  expBlock: {
    marginBottom: 8,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  skillCat: {
    width: 90,
    fontSize: 9,
    fontWeight: 700,
    color: '#444',
  },
  skillList: {
    flex: 1,
    fontSize: 9,
    color: '#333',
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  certName: {
    fontSize: 9,
    fontWeight: 700,
  },
  certIssuer: {
    fontSize: 9,
    color: '#666',
  },
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  eduSchool: {
    fontSize: 10,
    fontWeight: 700,
  },
  eduPeriod: {
    fontSize: 9,
    color: '#777',
  },
  eduDept: {
    fontSize: 9,
    color: '#555',
    marginBottom: 2,
  },
});

// ─── 資料讀取 ──────────────────────────────────────────────────────────────────
function readMd(filename: string) {
  const raw = fs.readFileSync(path.join(contentDir, filename), 'utf-8');
  return matter(raw);
}

// ─── React-PDF Document ───────────────────────────────────────────────────────
function ResumePdf() {
  const profile = readMd('profile.md');
  const expData = readMd('experience.md');
  const skillsData = readMd('skills.md');
  const eduData = readMd('education.md');

  const profileFm = profile.data as {
    name: string;
    title: string;
    email: string;
    github: string;
    linkedin: string;
  };

  const experiences = (expData.data.entries ?? []) as Array<{
    title: string;
    company: string;
    period: string;
    highlights: string[];
  }>;

  const skillCategories = (skillsData.data.categories ?? []) as Array<{
    name: string;
    skills: string[];
  }>;

  const certifications = (skillsData.data.certifications ?? []) as Array<{
    name: string;
    issuer: string;
    url?: string;
  }>;

  const education = (eduData.data.entries ?? []) as Array<{
    school: string;
    degree: string;
    department: string;
    period: string;
    achievements: string[];
  }>;

  const contactLine = [profileFm.email, profileFm.github, profileFm.linkedin]
    .filter(Boolean)
    .join('  |  ');

  return React.createElement(
    Document,
    { title: `${profileFm.name} - 履歷` },
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },

      // ── Header ──
      T(profileFm.name, styles.headerName),
      T(profileFm.title, styles.headerTitle),
      T(contactLine, styles.headerContact),

      // ── 工作經歷 ──
      T('工作經歷', styles.sectionTitle),
      ...experiences.map((exp) =>
        React.createElement(
          View,
          { key: exp.company, style: styles.expBlock },
          React.createElement(
            View,
            { style: styles.expHeader },
            T(exp.title, styles.expTitle),
            T(exp.period, styles.expPeriod)
          ),
          T(exp.company, styles.expCompany),
          ...exp.highlights.map((h, i) =>
            React.createElement(
              View,
              { key: i, style: styles.bullet },
              React.createElement(Text, { style: styles.bulletDot }, '•'),
              T(h, styles.bulletText)
            )
          )
        )
      ),

      // ── 技術能力 ──
      T('技術能力', styles.sectionTitle),
      ...skillCategories.map((cat) =>
        React.createElement(
          View,
          { key: cat.name, style: styles.skillRow },
          T(cat.name, styles.skillCat),
          T(cat.skills.join('、'), styles.skillList)
        )
      ),

      // ── 證照 ──
      ...(certifications.length > 0
        ? [
            T('證照', styles.sectionTitle),
            ...certifications.map((cert) =>
              React.createElement(
                View,
                { key: cert.name, style: styles.certRow },
                T(cert.name, styles.certName),
                T(cert.issuer, styles.certIssuer)
              )
            ),
          ]
        : []),

      // ── 學歷 ──
      T('學歷', styles.sectionTitle),
      ...education.map((edu) =>
        React.createElement(
          View,
          { key: edu.school, style: styles.expBlock },
          React.createElement(
            View,
            { style: styles.eduHeader },
            T(edu.school, styles.eduSchool),
            T(edu.period, styles.eduPeriod)
          ),
          T(`${edu.degree}・${edu.department}`, styles.eduDept),
          ...(edu.achievements ?? []).map((a: string, i: number) =>
            React.createElement(
              View,
              { key: i, style: styles.bullet },
              React.createElement(Text, { style: styles.bulletDot }, '•'),
              T(a, styles.bulletText)
            )
          )
        )
      )
    )
  );
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────
async function generate() {
  registerFonts();

  console.log('📄 產生 portfolio.pdf...');
  const buffer = await renderToBuffer(React.createElement(ResumePdf));
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ portfolio.pdf 已產生：${outputPath}`);
  console.log(`   大小：${(buffer.length / 1024).toFixed(1)} KB`);
}

generate().catch((err) => {
  console.error('❌ PDF 產生失敗：', err);
  process.exit(1);
});
