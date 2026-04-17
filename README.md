# PersonalTechnologyStack

> 王之豪的個人技術棧展示倉庫 — 不只是 Portfolio，也是 AI 輔助開發工作流的實際案例集。

🌐 **線上展示**：[portfolio-amber-beta-77.vercel.app](https://portfolio-amber-beta-77.vercel.app)

---

## 這份 Repo 是什麼？

許多工程師的 GitHub 是函式庫或課程練習的集散地。這份 Repo 的出發點不同：

> **「如果有人想了解我平日怎麼工作、怎麼用 AI 工具解決真實問題，這份 Repo 能不能說清楚？」**

因此它包含兩個層次：

| 層次 | 內容 | 說明 |
|---|---|---|
| **Portfolio 網站** | `portfolio/` | 展示個人技術背景的 Next.js 應用 |
| **AI 工作流 Skill** | `.claude/skills/` | 工作中實際沉澱的 Claude Code Agent 工具鏈 |

---

## 發想過程

### 起點：如何良好的展現我的AI技能

傳統 Portfolio 千篇一律：自介、技能條、Side Project 截圖。對技術面試官而言，這些資訊密度極低。

我想要一個能**主動示範AI技能**的 Portfolio，重點不是「我用過什麼技術」，而是「我怎麼使用AI」。

### 決策：用 AI 工具建這件事本身就是 Showcase

整個網站從規劃、實作到部署，全程與 Claude Code 協作完成。這份過程本身就是 AI 輔助開發能力的直接證明，而非口號。

### 架構取向：內容驅動、可驗證

- 案例來源於 `.claude/skills/` 下的實際 Skill 定義，非虛構
- [Claude Code Insights 報告](https://portfolio-amber-beta-77.vercel.app/claude-code-insights.html) 為 Anthropic 生成的真實使用分析，具備第三方可查性
- 實際串接Claude API 實踐互動功能（問答、職缺匹配）可即時操作驗證

---

## Repo 結構

```
PersonalTechnologyStack/
│
├── portfolio/                  # Next.js Portfolio 網站
│   ├── app/                    # App Router 頁面與 API Routes
│   │   ├── [locale]/           # 多語系頁面（zh-TW / en）
│   │   │   ├── page.tsx        # 首頁
│   │   │   ├── cv/             # 履歷頁
│   │   │   └── projects/       # AI 實踐展示頁
│   │   └── api/                # API Routes
│   │       ├── chat/           # AI 問答（Anthropic Streaming）
│   │       ├── job-match/      # 職缺匹配分析
│   │       ├── download-pdf/   # PDF 履歷下載
│   │       └── download-portfolio/  # Markdown 履歷下載
│   ├── content/                # 內容層（Markdown + gray-matter）
│   │   ├── zh-TW/              # 繁體中文內容
│   │   └── en/                 # 英文內容
│   ├── scripts/
│   │   ├── GeneratePortfolio.ts  # Build 時產生 portfolio.md（AI 系統提示）
│   │   └── GeneratePdf.ts        # Build 時產生 portfolio.pdf（含 CJK 字型）
│   └── tests/e2e/              # Playwright E2E Smoke Tests
│
└── .claude/skills/             # Claude Code Agent 工具鏈
    ├── db-connect/SKILL.md     # DB 環境連線自動化
    ├── db-schema/SKILL.md      # 自然語言 Schema 查詢
    ├── db-select/SKILL.md      # 多步驟 DB 查詢 Workflow
    └── prompt-optimizer/SKILL.md  # 系統化 Prompt 優化器
```

---

## Portfolio 網站亮點

### 技術選型

| 技術 | 版本 | 說明 |
|---|---|---|
| Next.js | 16.2.3 | App Router、Breaking changes 已對應（proxy.ts、awaited params） |
| React | 19.2.4 | — |
| next-intl | v4 | zh-TW 預設 + `/en` 路由，i18n 完整覆蓋 |
| Tailwind CSS | v4 | — |
| shadcn/ui | base-ui | `render` prop 取代 `asChild`（v4 breaking change） |
| @anthropic-ai/sdk | latest | Streaming 問答 + 結構化 JSON 職缺匹配 |
| @react-pdf/renderer | 4.5.1 | Build 時產生含 CJK 字型嵌入的 PDF |

### 架構決策

**內容與呈現解耦**：所有個人資料存放於 `content/{locale}/*.md`（gray-matter frontmatter），透過 `lib/content.ts` 統一讀取後注入頁面。更新內容只需改 Markdown，不動元件程式碼。

**AI 系統提示自動生成**：`scripts/GeneratePortfolio.ts` 在 `npm run build` 時將所有 Markdown 合併為 `public/portfolio.md`，作為 AI 問答的 system prompt，確保 AI 回答有據可查。

**Rate Limiting**：`lib/rateLimit.ts` 對 AI API Routes 實施 in-memory 速率限制（5 req/min/IP）。

---

## AI 工作流亮點（`.claude/skills/`）

這四個 Skill 是工作中真實使用並沉澱的 Claude Code Agent 定義，非示範用途。

### 🔌 DB 環境連線自動化（`db-connect`）
封裝 K8s context 切換 + KubeVPN 建立為單一指令，輪詢確認連線就緒後才繼續。
- **效益**：每次環境切換省去 2–5 分鐘手動操作，誤切環境紀錄歸零

### 🔍 自然語言 Schema 查詢（`db-schema`）
以業務關鍵字搜尋本機 Markdown Schema 知識庫（574 份），自動選擇精確搜尋或領域索引查詢。
- **效益**：新人可直接用中文查詢系統架構，資深工程師每週被中斷次數預估降低 5–8 次

### 🗄️ 多步驟 DB 查詢 Workflow（`db-select`）
串接 db-connect → db-schema → SQL 執行，內建唯讀防護（禁止 INSERT/UPDATE/DELETE）。
- **效益**：查詢前置作業從 10 分鐘縮短至 1 分鐘，非技術成員零 SQL 誤操作紀錄

### ✏️ 系統化 Prompt 優化器（`prompt-optimizer`）
8 步驟流程將模糊 Prompt 轉換為具備明確目標、限制條件與輸出格式的可執行指令。
- **效益**：回應重工率降低約 60%，設計週期從 3–5 輪縮短至 1–2 輪

---

## 相關連結

- 🌐 [線上 Portfolio](https://portfolio-amber-beta-77.vercel.app)
- 📊 [Claude Code Insights 報告](https://portfolio-amber-beta-77.vercel.app/claude-code-insights.html)
- 📄 [下載 PDF 履歷](https://portfolio-amber-beta-77.vercel.app/api/download-pdf)
