import { test, expect } from '@playwright/test';

test.describe('公開前の公開面', () => {
  test('特定商取引法のページが表示される', async ({ page }) => {
    await page.goto('/tokusho');
    await expect(page.locator('h1')).toContainText('特定商取引法に基づく表記');
    await expect(page.getByText('現在、有料プランは販売していません。')).toBeVisible();
    await expect(page.getByText('未掲載').first()).toBeVisible();
  });

  test('ランディングページから特商法ページへ進める', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '特定商取引法に基づく表記' }).click();
    await expect(page).toHaveURL(/\/tokusho$/);
    await expect(page.locator('h1')).toContainText('特定商取引法');
  });

  test('シードAPIは秘密なしでは拒否する', async ({ request }) => {
    const response = await request.post('/api/seed');
    expect(response.status()).toBe(401);
  });

  test('オフライン用の静的ファイルを取得できる', async ({ request }) => {
    const offline = await request.get('/offline.html');
    expect(offline.status()).toBe(200);
    expect(await offline.text()).toContain('オフラインです');

    const worker = await request.get('/sw.js');
    expect(worker.status()).toBe(200);
    expect(worker.headers()['content-type']).toContain('javascript');
  });
});
