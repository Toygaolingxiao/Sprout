"use client"

import { useState } from 'react'
import Link from 'next/link'
import { signUp, signInWithGoogle } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/lib/i18n/context'
import { GoogleIcon } from '@/components/auth/google-icon'

interface SignupFormProps {
  nextPath?: string;
}

export function SignupForm({ nextPath = '/dashboard' }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [lineLoading, setLineLoading] = useState(false)
  const { t } = useTranslation()

  function localizeError(message: string) {
    if (message === 'auth.emailExists') return t('auth.emailExists')
    if (message === 'auth.oauthCallbackFailed') return t('auth.oauthCallbackFailed')
    if (message === 'auth.oauthProviderUnsupported') return t('auth.oauthProviderUnsupported')
    if (message === 'auth.oauthAccessDenied') return t('auth.oauthAccessDenied')
    if (message === 'settings.providerUnsupportedGoogle') return t('auth.oauthProviderUnsupported')
    if (message === 'settings.providerOperationFailed') return t('auth.oauthCallbackFailed')
    if (message === 'auth.networkError') return t('auth.networkError')
    return message
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const result = await signUp(formData)
      if (result?.error) {
        setError(localizeError(result.error))
      }
      if (result?.success) {
        setSuccess(result.success === 'auth.signupEmailSent' ? t('auth.signupEmailSent') : result.success)
      }
    } catch {
      setError(t('auth.networkError'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignUp(formData: FormData) {
    setError(null)
    setSuccess(null)
    try {
      const result = await signInWithGoogle(formData)
      if (result?.error) {
        setError(localizeError(result.error))
      }
    } catch {
      setError(t('auth.networkError'))
    }
  }

  async function handleLineSignUp() {
    setLineLoading(true)
    setError(null)
    setSuccess(null)

    const target = `/auth/line?next=${encodeURIComponent(nextPath)}`
    window.location.assign(target)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t('auth.signup')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && (
          <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <div className="space-y-2">
            <Label htmlFor="nickname">{t('auth.nickname')}</Label>
            <Input id="nickname" name="nickname" required placeholder={t('auth.nicknamePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" name="email" type="email" required placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" name="password" type="password" required minLength={8} placeholder={t('auth.passwordHint')} />
          </div>
          <Button type="submit" className="w-full" disabled={loading || lineLoading}>
            {loading ? t('auth.registering') : t('auth.createAccount')}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {t('auth.termsConsent1')}
            <Link href="/terms" className="text-primary hover:underline">{t('auth.termsLink')}</Link>
            {t('auth.termsConsent2')}
            <Link href="/privacy" className="text-primary hover:underline">{t('auth.privacyLink')}</Link>
            {t('auth.termsConsent3')}
          </p>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            {t('auth.or')}
          </span>
        </div>

        <form action={handleGoogleSignUp}>
          <input type="hidden" name="next" value={nextPath} />
          <Button
            variant="outline"
            className="w-full border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa]"
            type="submit"
            disabled={loading || lineLoading}
          >
            <GoogleIcon className="size-4" />
            {t('auth.googleSignup')}
          </Button>
        </form>

        <form action={handleLineSignUp}>
          <Button type="submit" className="w-full bg-[#06C755] text-white hover:bg-[#05ad4b]" disabled={loading || lineLoading}>
            {lineLoading ? t('auth.lineConnecting') : t('auth.lineSignup')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <div>
          {t('auth.hasAccount')}{' '}
          <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-primary hover:underline">
            {t('auth.login')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
