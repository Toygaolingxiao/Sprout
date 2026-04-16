import { test, expect } from '@playwright/test';

test.describe('日付リセット導線', () => {
  test('家族画面で日付要約を確認し、設定画面からリセットできる', async ({ page }) => {
    const email = `sprout-reset-${Date.now()}@example.com`;
    const password = 'password123';

    await page.goto('/signup');
    await page.locator('input[name="nickname"]').fill('E2E User');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'アカウント作成' }).click();

    await page.waitForURL('**/dashboard');

    await page.goto('/settings');
    await page.locator('input[name="expected_pregnancy_date"]').fill('2026-08-01');
    await page.locator('input[name="expected_due_date"]').fill('2027-04-20');
    await page.getByRole('button', { name: '保存' }).last().click();
    await expect(page.getByText('スケジュールを保存しました')).toBeVisible();

    await page.goto('/family');
    await expect(page.getByText('家族のスケジュール')).toBeVisible();
    await expect(page.getByText('2026-08-01')).toBeVisible();
    await expect(page.getByText('2027-04-20')).toBeVisible();

    await page.getByRole('link', { name: '設定でスケジュールを編集' }).click();
    await page.getByRole('button', { name: '妊娠予定時期をリセット' }).click();
    await expect(page.getByText('日付を空欄に戻しますか？')).toBeVisible();
    await page.getByRole('button', { name: '空欄に戻す' }).click();
    await page.getByRole('button', { name: '保存' }).last().click();
    await expect(page.getByText('スケジュールを保存しました')).toBeVisible();

    await page.goto('/family');
    const scheduleCard = page.getByTestId('family-schedule-card');
    await expect(scheduleCard.getByText('未設定')).toBeVisible();
    await expect(page.getByText('2027-04-20')).toBeVisible();
  });
});