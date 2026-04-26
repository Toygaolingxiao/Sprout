"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signIn, signInWithGoogle, signInWithLineIdToken } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/lib/i18n/context'
import { GoogleIcon } from '@/components/auth/google-icon'
import { getLiffIdTokenWithOptions } from '@/lib/liff/client'

interface LoginFormProps {
  nextPath?: string;
  autoLiff?: boolean;
  initialErrorCode?: string | null;
}

export function LoginForm({ nextPath = '/dashboard', autoLiff = false, initialErrorCode = null }: LoginFormProps) {
  const lineAutoFallbackKey = 'sprout_line_auto_fallback_done'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [lineLoading, setLineLoading] = useState(false)
  const { t } = useTranslation()

  function localizeError(message: string) {
    if (message === 'auth.invalidCredentials') return t('auth.invalidCredentials')
    if (message === 'line_oauth_failed') return t('auth.lineUnavailable')
    if (message === 'line_provider_unsupported') return t('auth.lineProviderUnsupported')
    if (message === 'line_oauth_config_invalid') return t('auth.lineOAuthConfigInvalid')
    if (message === 'line_redirect_mismatch') return t('auth.lineRedirectMismatch')
    if (message === 'auth_callback_failed') return t('auth.lineCallbackFailed')
    if (message === 'supabase_unreachable') return t('auth.supabaseUnavailable')
    if (message === 'supabase_config_invalid') return t('auth.supabaseConfigInvalid')
    if (message === 'auth.emailExists') return t('auth.emailExists')
    if (message === 'auth.networkError') return t('auth.networkError')
    return message
  }

  useEffect(() => {
    if (!initialErrorCode) return
    setError(localizeError(initialErrorCode))
  }, [initialErrorCode, t])

  useEffect(() => {
    if (!autoLiff) return

    let cancelled = false

    async function runAutoLiffLogin() {
      setLineLoading(true)
      setError(null)

      try {
        const idToken = await getLiffIdTokenWithOptions({ autoLogin: false })
        if (!idToken) {
          const alreadyFallbackTried = sessionStorage.getItem(lineAutoFallbackKey) === '1'
          if (alreadyFallbackTried) {
            if (!cancelled) {
              setLineLoading(false)
              setError(t('auth.lineUnavailable'))
            }
            return
          }

          sessionStorage.setItem(lineAutoFallbackKey, '1')
          window.location.assign(`/auth/line?next=${encodeURIComponent(nextPath)}`)
          return
        }

        const result = await signInWithLineIdToken(idToken, nextPath)
        if (result?.success && !cancelled) {
          sessionStorage.removeItem(lineAutoFallbackKey)
          window.location.assign(result.nextPath ?? nextPath)
          return
        }

        if (result?.error && !cancelled) {
          const alreadyFallbackTried = sessionStorage.getItem(lineAutoFallbackKey) === '1'
          if (alreadyFallbackTried) {
            setLineLoading(false)
            setError(localizeError(result.error))
            return
          }

          sessionStorage.setItem(lineAutoFallbackKey, '1')
          window.location.assign(`/auth/line?next=${encodeURIComponent(nextPath)}`)
        }
      } catch {
        if (!cancelled) {
          const alreadyFallbackTried = sessionStorage.getItem(lineAutoFallbackKey) === '1'
          if (alreadyFallbackTried) {
            setLineLoading(false)
            setError(t('auth.lineUnavailable'))
            return
          }

          sessionStorage.setItem(lineAutoFallbackKey, '1')
          window.location.assign(`/auth/line?next=${encodeURIComponent(nextPath)}`)
        }
      }
    }

    void runAutoLiffLogin()

    return () => {
      cancelled = true
    }
  }, [autoLiff, nextPath, t])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      const result = await signIn(formData)
      if (result?.error) {
        setError(localizeError(result.error))
      }
    } catch {
      setError(t('auth.networkError'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn(formData: FormData) {
    setError(null)
    try {
      const result = await signInWithGoogle(formData)
      if (result?.error) {
        setError(localizeError(result.error))
      }
    } catch {
      setError(t('auth.networkError'))
    }
  }

  async function handleLineSignIn() {
    setLineLoading(true)
    setError(null)

    const target = `/auth/line?next=${encodeURIComponent(nextPath)}`
    window.location.assign(target)
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
          <Button
            variant="outline"
            className="w-full border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa]"
            type="submit"
            disabled={loading || lineLoading}
          >
            <GoogleIcon className="size-4" />
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
