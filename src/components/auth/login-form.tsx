"use client"

import { useState } from 'react'
import Link from 'next/link'
import { signIn, signInWithGoogle, signInWithLineIdToken, signInWithLineOAuth } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/lib/i18n/context'
import { getLiffIdToken } from '@/lib/liff/client'

interface LoginFormProps {
  nextPath?: string;
}

export function LoginForm({ nextPath = '/dashboard' }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [lineLoading, setLineLoading] = useState(false)
  const { t } = useTranslation()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleGoogleSignIn(formData: FormData) {
    const result = await signInWithGoogle(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  async function handleLineSignIn() {
    setLineLoading(true)
    setError(null)

    async function startLineOAuthFallback() {
      const oauthResult = await signInWithLineOAuth(nextPath)
      if (oauthResult?.error) {
        setError(t('auth.lineUnavailable'))
        setLineLoading(false)
      }
    }

    try {
      const idToken = await getLiffIdToken()
      if (!idToken) {
        setLineLoading(false)
        return
      }

      const result = await signInWithLineIdToken(idToken, nextPath)
      if (result?.error) {
        await startLineOAuthFallback()
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'LIFF_ID_TOKEN_NOT_AVAILABLE') {
        setError(t('auth.lineScopeHint'))
        setLineLoading(false)
        return
      }

      await startLineOAuthFallback()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t('auth.login')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" name="email" type="email" required placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" disabled={loading || lineLoading}>
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            {t('auth.or')}
          </span>
        </div>

        <form action={handleGoogleSignIn}>
          <input type="hidden" name="next" value={nextPath} />
          <Button variant="outline" className="w-full" type="submit" disabled={loading || lineLoading}>
            {t('auth.googleLogin')}
          </Button>
        </form>

        <form action={handleLineSignIn}>
          <Button type="submit" className="w-full bg-[#06C755] text-white hover:bg-[#05ad4b]" disabled={loading || lineLoading}>
            {lineLoading ? t('auth.lineConnecting') : t('auth.lineLogin')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
        <Link href={`/reset-password?next=${encodeURIComponent(nextPath)}`} className="hover:text-foreground transition-colors">
          {t('auth.forgotPassword')}
        </Link>
        <div>
          {t('auth.noAccount')}{' '}
          <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="text-primary hover:underline">
            {t('auth.signup')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
