"use client"

import { useState } from 'react'
import Link from 'next/link'
import { signUp, signInWithGoogle } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleGoogleSignUp() {
    const result = await signInWithGoogle()
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">新規登録</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">ニックネーム</Label>
            <Input id="nickname" name="nickname" required placeholder="例: たろう" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" required placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" name="password" type="password" required minLength={8} placeholder="8文字以上" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '登録中...' : 'アカウント作成'}
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            または
          </span>
        </div>

        <form action={handleGoogleSignUp}>
          <Button variant="outline" className="w-full" type="submit">
            Googleで登録
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <div>
          既にアカウントをお持ちの方は{' '}
          <Link href="/login" className="text-primary hover:underline">
            ログイン
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
