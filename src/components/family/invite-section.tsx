'use client';

import { useState, useTransition } from 'react';
import { createInvitation } from '@/lib/actions/family';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InviteSection() {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  function handleCreate() {
    startTransition(async () => {
      setError(null);
      const result = await createInvitation();
      if (result?.error) {
        setError(result.error);
      } else if (result?.inviteUrl) {
        setInviteUrl(result.inviteUrl);
      }
    });
  }

  async function handleCopy() {
    if (inviteUrl) {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">パートナーを招待</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          招待リンクを生成して、パートナーに共有しましょう。リンクは7日間有効です。
        </p>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {inviteUrl ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input value={inviteUrl} readOnly className="text-xs" />
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? '✓ コピー済' : 'コピー'}
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? '生成中...' : '招待リンクを生成'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
