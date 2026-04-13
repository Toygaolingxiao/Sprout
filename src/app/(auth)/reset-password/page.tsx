'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">パスワードリセット</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" required placeholder="email@example.com" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '送信中...' : 'リセットメールを送信'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          ログイン画面に戻る
        </Link>
      </CardFooter>
    </Card>
  );
}
