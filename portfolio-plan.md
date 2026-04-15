# Portfolio 專案規劃摘要

> 本文件記錄個人技術 Portfolio 網站的完整規劃，供 Claude Code 實作參考使用。

---

## 背景與目標

這個專案的起點，是希望建立一個能在求職與技術交流場合中展示自我的 Portfolio。

目標受眾分兩個層次：一是非技術背景的 HR 或主管，需要透過網站直觀瀏覽個人經歷與能力；二是技術面試官，需要透過 GitHub Repo 直接審視程式碼品質與架構思維。核心賣點定位在「對 AI 工具的實際運用與理解」，這在目前市場上已是明確的差異化能力，而非單純展示會呼叫 API。

---

## 技術選型與決策原因

在框架選擇上，最初考慮過靜態網站方案（Astrofy），但考量到日後要加入 AI 問答、職缺匹配等互動功能，靜態方案的天花板太低，切換成本也高，因此決定從第一階段就採用 **Next.js**。

Next.js 的優勢在於前後端整合在同一個專案，API Routes 直接作為後端邏輯，不需要另外部署 .NET Core 服務。語言選擇 **TypeScript**，型別系統概念與 C# 高度相近，學習成本低。部署平台選用 **Vercel**，與 Next.js 原生整合，push 即自動上線。

| 項目 | 選擇 |
|------|------|
| 框架 | Next.js |
| 語言 | TypeScript |
| 部署 | Vercel |
| AI 模型 | claude-sonnet-4-20250514（Anthropic API）|
| 多語系 | Next.js i18n routing |

---

## Repo 策略

Portfolio 網站與 Side Projects 採分開存放的策略。每個 Side Project 擁有獨立 Repo，各自有完整的 commit history、README 與星星數，這是業界慣例，技術面試官也習慣直接看獨立 Repo。

Portfolio 網站的角色是**導覽頁**，Side Project 頁面只需呈現 MD 介紹並附上各 Repo 連結即可，網站本身永遠保持輕量。

```
github.com/you/portfolio          # 網站 + 個人品牌（本專案）
github.com/you/project-alpha      # 獨立 Side Project Repo
github.com/you/project-beta       # 獨立 Side Project Repo
```

---

## 核心設計：Single Source of Truth

這個設計是整個架構的亮點，也是展示 AI 理解能力的具體體現。

`content/` 資料夾下的 Markdown 檔是唯一的資料來源，Build Time 由 `GeneratePortfolio.ts` 腳本將所有內容合併，輸出成一份 `public/portfolio.md`。這份檔案同時服務三個用途：

- 靜態頁面的渲染資料
- AI 問答與職缺匹配的 System Context
- 使用者可直接下載自用的個人資料檔

這個概念對應 AI 應用中的 Personal Knowledge Base，讓所有功能共用同一份資料，不會出現內容不一致的問題。

---

## 專案結構

```
portfolio/
├── app/
│   └── [locale]/
│       ├── page.tsx                  # 首頁
│       ├── cv/
│       │   └── page.tsx              # 履歷頁
│       ├── projects/
│       │   └── page.tsx              # Side Projects 索引
│       └── ai-showcase/
│           └── page.tsx              # AI 工具展示 + 互動功能
│
├── app/api/
│   ├── chat/
│   │   └── route.ts                  # AI 問答
│   └── job-match/
│       └── route.ts                  # 職缺匹配評分
│
├── content/                          # 你維護的原始 Markdown
│   ├── experience.md
│   ├── projects.md
│   ├── skills.md
│   └── ai-workflow.md
│
├── scripts/
│   └── GeneratePortfolio.ts          # Build Time 合併腳本
│
├── public/
│   └── portfolio.md                  # 產生物，供下載 & AI Context
│
└── messages/                         # i18n 語系檔
    ├── zh-TW.json
    └── en.json
```

---

## API Routes 設計

兩支核心 API，職責明確分離：

**`api/chat/route.ts`**
載入 `portfolio.md` 作為 System Context，處理訪客對個人資料的 AI 問答。

**`api/job-match/route.ts`**
接收使用者貼入的職缺 JD，對比 `portfolio.md` 內容，回傳匹配分數與具體分析說明。

```typescript
// api/job-match/route.ts 概念範例
export async function POST(request: Request) {
    const { JobDescription } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
                role: "user",
                content: `以下是候選人資料：\n${portfolioContent}\n\n以下是職缺描述：\n${JobDescription}\n\n請評估匹配度並給出 0–100 分與具體分析。`
            }]
        })
    });

    const data = await response.json();
    return Response.json({ Result: data.content[0].text });
}
```

---

## 多語系規劃

採用 Next.js 內建 i18n routing，URL 結構如下：

```
/zh-TW/          # 繁體中文（預設）
/en/             # English
```

版面與元件共用，只替換 `messages/` 下的語系 JSON 內容。語系建議從第一天開始雙語並行維護，後期補翻譯的成本遠高於同步撰寫。

---

## 建置順序

### 第一階段：靜態展示

1. 建立 Next.js 專案，設定 TypeScript + i18n routing
2. 實作靜態頁面（首頁、履歷、Side Projects 索引）
3. 撰寫 `content/` 下的 Markdown 內容
4. 實作 `GeneratePortfolio.ts` 合併腳本
5. 設定 Vercel 部署，確認自動部署流程

### 第二階段：動態功能

6. 實作 `api/chat` 與 `api/job-match`
7. 實作前端互動介面（AI 問答輸入框、職缺匹配頁面）
8. 加入 Rate Limiting，防止 API Token 被濫用
9. 實作 AI 回應 Streaming，避免 Vercel 10 秒 timeout

### 第三階段：Side Projects 擴充

10. 依需求新增獨立 Side Project Repo
11. 回到 Portfolio 網站新增對應的 MD 介紹卡片與連結

---

## 注意事項

- `public/portfolio.md` 是公開檔案，不得放置電話、身分證等敏感個資
- `portfolio.md` 內容建議控制在 2000 字以內，避免超出 LLM Context Token 限制
- Anthropic API Key 存放於 `.env.local`，絕對不能 commit 進 Repo
- `api/job-match` 與 `api/chat` 須加 Rate Limiting，任何人都能呼叫這兩支 API，不加保護會導致 Token 被濫用
- AI 回應需使用 Streaming 方式處理，Vercel Serverless Function 預設 10 秒 timeout，一般 AI 回應容易超時
- i18n 多語系從第一階段就同步維護，勿留到後期補

---

*最後更新：2026-04-15*
