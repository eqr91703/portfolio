import { test, expect } from '@playwright/test';

// ─── 首頁 ──────────────────────────────────────────────────────────────────────
test('首頁：正確渲染標題與 CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('王之豪');
  // 三個 CTA 按鈕
  await expect(page.getByRole('link', { name: /查看履歷/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /AI 實踐展示/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /聯絡我/ })).toBeVisible();
});

test('首頁：AWS 卡片顯示 SAA 驗證連結', async ({ page }) => {
  await page.goto('/');
  const certLink = page.getByRole('link', { name: /驗證 SAA 認證/ });
  await expect(certLink).toBeVisible();
  await expect(certLink).toHaveAttribute(
    'href',
    'https://cp.certmetrics.com/amazon/zh-Hant/public/verify/credential/SJEQXEQCTBE118GK'
  );
});

// ─── 履歷頁 ────────────────────────────────────────────────────────────────────
test('履歷頁：正確渲染工作經歷與下載按鈕', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('h1')).toContainText('履歷');
  // 下載 PDF + 下載 MD
  await expect(page.getByRole('link', { name: /下載 PDF/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /下載 MD/ })).toBeVisible();
  // 工作經歷存在
  await expect(page.getByText('優玩科技')).toBeVisible();
});

test('履歷頁：SAA 證照連結正確', async ({ page }) => {
  await page.goto('/cv');
  const certLink = page.getByRole('link', {
    name: /AWS Certified Solutions Architect/,
  });
  await expect(certLink).toBeVisible();
  await expect(certLink).toHaveAttribute(
    'href',
    'https://cp.certmetrics.com/amazon/zh-Hant/public/verify/credential/SJEQXEQCTBE118GK'
  );
});

// ─── AI 實踐展示頁 ─────────────────────────────────────────────────────────────
test('AI 實踐展示頁：正確渲染並顯示互動展示', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('h1')).toContainText('AI 實踐展示');
  // AiShowcase 應在最上方（標題下）
  await expect(page.getByText('AI 問答')).toBeVisible();
  await expect(page.getByText('職缺匹配')).toBeVisible();
});

test('AI 實踐展示頁：顯示量化成果', async ({ page }) => {
  await page.goto('/projects');
  // 確認量化數字存在
  await expect(page.getByText(/60%|2–4 小時|574 份|5 天/)).toBeVisible();
});

test('AI 實踐展示頁：Insights 優勢摘要顯示', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByText(/68%/)).toBeVisible();
  await expect(page.getByText(/Fully Achieved/)).toBeVisible();
});

// ─── 導覽列 ────────────────────────────────────────────────────────────────────
test('側欄導覽：三個連結正確', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /首頁/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /履歷/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /AI 實踐展示/ })).toBeVisible();
});

// ─── 英文版 ────────────────────────────────────────────────────────────────────
test('英文版首頁：正確渲染', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText('Chih-Hao Wang');
  await expect(page.getByRole('link', { name: /Contact Me/ })).toBeVisible();
});

test('英文版 AI 實踐頁：標題 AI in Practice', async ({ page }) => {
  await page.goto('/en/projects');
  await expect(page.locator('h1')).toContainText('AI in Practice');
});
