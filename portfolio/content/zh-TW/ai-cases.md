---
entries:
  - id: prompt-optimizer
    category: prompt
    title: 系統化 Prompt 優化器
    description: 設計 8 步驟優化流程（深度理解 → 結構拆解 → 規格建立 → 逐段重寫 → 歧義排除 → 可行性測試 → 最終驗證 → 健全性檢查），將模糊的 Prompt 轉換為具備明確目標、限制條件與輸出格式的可執行指令。
    tools:
      - Claude Code
    outcome: 減少 AI 回應的歧義與錯誤率，沉澱為可複用的 Prompt 設計框架供日常開發使用

  - id: agent-db-connect
    category: agent
    title: DB 環境連線自動化 Agent
    description: 封裝 K8s context 切換與 KubeVPN 連線為單一 Skill 指令。Agent 自動偵測當前連線環境，判斷是否需要重連或環境切換，並輪詢確認連線就緒後才繼續作業，支援開發與正式複本兩套環境。
    tools:
      - Claude Code
      - KubeVPN
      - kubectx
    outcome: 省去每次手動切換 K8s context + 建立 VPN 的步驟，並消除因環境切換錯誤導致的誤操作風險

  - id: agent-db-schema
    category: agent
    title: 自然語言 DB Schema 查詢助手
    description: 以業務關鍵字搜尋本機 Markdown Schema 知識庫，依查詢意圖自動選擇精確物件搜尋或領域索引查詢，支援表結構、預存程序、函數、視圖等多種物件類型，無需撰寫 SQL 或記憶資料表名稱。
    tools:
      - Claude Code
    outcome: 新人可直接用中文查詢系統架構，資深工程師被打斷次數明顯降低

  - id: agent-db-select
    category: agent
    title: 多步驟 DB 查詢 Workflow
    description: 串接連線驗證（db-connect）、Schema 查詢（db-schema）與 SQL 執行三個步驟，以自然語言描述查詢需求即可取得結果。內建唯讀防護（禁止 INSERT/UPDATE/DELETE 等）與自動加 TOP 100 保護機制。
    tools:
      - Claude Code
      - MCP
    outcome: 資料查詢流程標準化，非技術成員亦可安全查詢，消除 SQL 誤操作造成的資料風險

  - id: tooling-sql-debug
    category: tooling
    title: Claude Code × SQL 生產問題除錯
    description: 將 Production SQL 逾時、型別轉換錯誤等實際 runtime 問題帶入 Claude Code，以「假設 + 實際錯誤訊息」的方式驅動根因分析。成功診斷出 Connection Pool 耗盡、nvarchar 轉型失敗等隱性問題。
    tools:
      - Claude Code
    outcome: 從「猜測可能原因再測試」改為「確認根因再修復」，平均排查時間大幅縮短

  - id: tooling-schema-docs
    category: tooling
    title: SQL Schema 大規模文件化
    description: 將完整資料庫 Schema（表、預存程序、函數、視圖）轉換為 574 份結構化 Markdown 文件，建立領域索引（Domain Index）與術語對照表，奠定 AI 知識庫基礎。透過控制 Agent 並發批次（最多 3 批次）克服 API Rate Limit。
    tools:
      - Claude Code
    outcome: 完成 574 份可搜尋的 Schema 文件，成為 AI 輔助開發的知識庫來源

  - id: tooling-csharp-refactor
    category: tooling
    title: C# 後端多檔案重構
    description: 透過 Claude Code 進行跨多檔案的 C# 重構任務，包含層級遍歷邏輯修正、查詢遷移至統計表、API 整合等。每次修改後自動執行 dotnet build 驗證零錯誤，確保重構安全可控。
    tools:
      - Claude Code
      - .NET
    outcome: 多次重構皆達成 Fully Achieved，零重大回滾事件，build 驗證流程沉澱為標準作業
---
