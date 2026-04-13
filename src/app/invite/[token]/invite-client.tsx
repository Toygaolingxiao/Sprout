'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { acceptInvitation } from '@/lib/actions/family';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InviteClientProps {
  token: string;
}

export function InviteClient({ token }: InviteClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🌱</div>
          <CardTitle>家族グループへの招待</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            パートナーがあなたをSproutの家族グループに招待しました。
            参加すると、チェックリストを共有できるようになります。
          </p>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={handleAccept} disabled={isPending} className="w-full">
            {isPending ? '参加中...' : '家族グループに参加'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
