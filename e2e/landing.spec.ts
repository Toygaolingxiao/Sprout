import { test, expect } from '@playwright/test';

test.describe('ランディングページ', () => {
  test('未ログインでLPが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('ふたりで育てる');
    await expect(page.getByRole('link', { name: '無料で始める' }).first()).toBeVisible();
  });

  test('4つのステージカードが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h3:has-text("妊活")')).toBeVisible();
    await expect(page.locator('h3:has-text("妊娠")')).toBeVisible();
    await expect(page.locator('h3:has-text("産後")')).toBeVisible();
    await expect(page.locator('h3:has-text("育児")')).toBeVisible();
  });

  test('「無料で始める」リンクのhrefが正しい', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: '無料で始める' }).first();
    await expect(link).toHaveAttribute('href', '/signup');
  });

  test('ヘッダーにログインリンクがある', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('header a[href="/login"]');
    await expect(loginLink).toBeVisible();
  });

  test('フッターに利用規約・プライバシーポリシーのリンクがある', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
  });
});
