import { test, expect } from '@playwright/test';

test.describe('法的ページ', () => {
  test('利用規約ページが表示される', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('h1')).toContainText('利用規約');
    await expect(page.locator('text=第1条')).toBeVisible();
  });

  test('プライバシーポリシーページが表示される', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1')).toContainText('プライバシーポリシー');
    await expect(page.locator('text=収集する情報')).toBeVisible();
  });
});
