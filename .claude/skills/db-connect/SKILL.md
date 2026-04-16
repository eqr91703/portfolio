---
description: 切換 K8s 環境並建立 KubeVPN 連線，以存取 DB
argument-hint: <環境> 可選值: dev-env | prod-copy-env | quit
allowed-tools: Bash
---

你是 Kubernetes DB 連線助手。根據 `$ARGUMENTS` 執行連線或斷線。

## 環境對應表

| 參數 | 說明 | 可用 MCP |
|------|------|---------|
| dev-env | 開發環境 | db-dev |
| prod-copy-env | 正式複本環境 | db-prod-copy、db-prod-copy-mon |

## 執行流程

### Step 1：解析環境參數
- `$ARGUMENTS` 為 `dev-env` 或 `prod-copy-env` → 執行連線流程
- `$ARGUMENTS` 為 `quit` 或 `disconnect` → 跳至 Step 6
- 空白或無效 → 列出可用環境，請使用者選擇

### Step 2：前置檢查

**檢查現有連線：**
```bash
CURRENT_CTX=$(kubectx -c)
kubevpn status
```
- 若 VPN 已 connected **且** `$CURRENT_CTX == 目標 context` → 跳至 Step 5（已在正確環境，不需重連）
- 若 VPN 已 connected **但** `$CURRENT_CTX != 目標 context` → 先執行 `kubevpn disconnect --all`，再繼續 Step 3
- 若 VPN 未連線 → 直接繼續 Step 3

### Step 3：切換 K8s Context
```bash
kubectx <目標context名>
```

### Step 4：建立 KubeVPN 連線
```bash
kubevpn connect
```
輪詢等待就緒（最多 60 秒）：
```bash
for i in $(seq 1 20); do
  STATUS=$(kubevpn status 2>/dev/null)
  if echo "$STATUS" | grep -qi "connected"; then
    echo "連線成功"; break
  fi
  echo "等待連線中... ($i/20)"; sleep 3
done
```
逾時 → 顯示錯誤，執行 `kubevpn disconnect --all` 清理。

## 安全規則
1. 工具不在 PATH 時立即停止
2. 連線失敗時自動清理殘留連線
3. 不顯示或儲存任何憑證
