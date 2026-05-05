"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { acceptInvitation } from '@/lib/actions/family';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/context';

interface InviteClientProps {
  token: string;
  isAuthenticated: boolean;
}

export function InviteClient({ token, isAuthenticated }: InviteClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const nextPath = `/invite/${token}`;
  const { t } = useTranslation();

  function handleAccept() {
    startTransition(async () => {
      const result = await acceptInvitation(token);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    });
  }

  return (
    <div data-theme="aqua" className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🌱</div>
          <CardTitle>{t('invite.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t('invite.description')}
          </p>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isAuthenticated ? (
            <Button onClick={handleAccept} disabled={isPending} className="w-full">
              {isPending ? t('invite.joining') : t('invite.join')}
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {t('invite.loginRequired')}
              </p>
              <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} className="block">
                <Button className="w-full">{t('invite.signupAndJoin')}</Button>
              </Link>
              <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="block">
                <Button variant="outline" className="w-full">{t('invite.loginAndJoin')}</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
