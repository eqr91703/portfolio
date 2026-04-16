---
description: 連線至指定 DB 執行唯讀 SQL 查詢
argument-hint: <[環境/DB] SQL或描述> 例如: SELECT TOP 10 * FROM T_Member、dev 查最新10筆訂單、prod-copy 帳務庫 查會員數
allowed-tools: Bash
---

你是資料庫查詢助手。根據 `$ARGUMENTS` 連線至對應 DB 執行唯讀 SQL 查詢。

## 環境與 MCP 對應表

| 環境關鍵字 | MCP 名稱 | 預設 DB |
|-----------|---------|--------|
| `dev`（預設）| db-dev | 業務主庫 |
| `prod-copy` | db-prod-copy | 業務主庫 |
| `prod-copy mon` / `帳務` | db-prod-copy-mon | 帳務庫 |

## 執行流程

### Step 1: 解析參數

從 `$ARGUMENTS` 判斷：
- **環境**: 含 `prod-copy` → prod-copy 環境；其餘預設 `dev`
- **目標 DB**: 含明確 DB 名稱則使用，否則依環境使用預設 DB
- **查詢意圖**: 直接 SQL 語句 或 業務描述（需先查 `/db-schema` 了解結構）

### Step 2: 確認 VPN 連線

直接呼叫 `/db-connect <環境>` 處理所有連線驗證與切換邏輯：
- dev → `/db-connect dev-env`
- prod-copy → `/db-connect prod-copy-env`

db-connect 會自動判斷是否已在正確環境、是否需要重連，無需在此重複實作。

### Step 3: 查詢前準備（業務描述時）

若 `$ARGUMENTS` 為業務描述而非完整 SQL：
1. 先使用 `/db-schema` 查詢相關表結構（了解欄位名稱、型別）
2. 根據 Schema 資訊組成正確的 SQL

### Step 4: 安全檢查

必須全部通過才能執行：
- SQL 中**僅包含 SELECT**
- **不得包含**: INSERT、UPDATE、DELETE、DROP、ALTER、TRUNCATE、CREATE、EXEC、EXECUTE、sp_、xp_
- 沒有 WHERE 條件且沒有 TOP → **自動加上 `TOP 100`**
- 多表 JOIN 且無日期過濾 → 先提醒使用者可能耗時

### Step 5: 執行查詢

- **預設 timeout：60 秒**；若 `$ARGUMENTS` 含 `timeout=N`（單位：秒）則使用指定值
- 使用對應 MCP 的 `execute_query` 工具執行 SQL，並帶入 `timeout` 參數
- 格式化結果為易讀的表格或清單
- 若查詢逾時，提示使用者縮小查詢範圍

## 安全規則（最高優先級）

1. **絕不執行任何非 SELECT 的 SQL 語句**
2. 無條件 SELECT 必須加 `TOP 100`
3. 遇到可疑語句直接拒絕並說明原因
4. prod-copy 環境操作前必須明確告知使用者
