import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 在跑測試前先啟動 next start（需先執行 npm run build）
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  //   reuseExistingServer: true,
  // },
});
