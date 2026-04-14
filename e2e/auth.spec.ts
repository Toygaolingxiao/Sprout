import { test, expect } from '@playwright/test';

test.describe('認証ページ', () => {
  test('ログインページが表示される', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=ログイン').first()).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('サインアップページが表示される', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('text=アカウント作成').first()).toBeVisible();
    await expect(page.locator('input[name="nickname"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('サインアップに利用規約リンクがある', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('a[href="/terms"]')).toBeVisible();
    await expect(page.locator('a[href="/privacy"]')).toBeVisible();
  });

  test('空のフォームはsubmitできない', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('ログインにサインアップへのリンクがある', async ({ page }) => {
    await page.goto('/login');
    const signupLink = page.locator('a[href="/signup"]');
    await expect(signupLink).toBeVisible();
  });
});
