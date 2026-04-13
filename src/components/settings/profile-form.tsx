"use client";

import { useState, useTransition } from 'react';
import { updateProfile } from '@/lib/actions/profile';
import { STAGES } from '@/data/seed/stages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Profile } from '@/types';

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result?.success) {
        setMessage({ type: 'success', text: result.success });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">プロフィール編集</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {message.text}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">ニックネーム</Label>
            <Input
              id="nickname"
              name="nickname"
              defaultValue={profile.nickname}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_stage">ライフステージ</Label>
            <select
              id="current_stage"
              name="current_stage"
              aria-label="ライフステージを選択"
              defaultValue={profile.current_stage}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected_due_date">出産予定日</Label>
            <Input
              id="expected_due_date"
              name="expected_due_date"
              type="date"
              defaultValue={profile.expected_due_date ?? ''}
            />
            <p className="text-xs text-muted-foreground">
              設定するとタスクの推奨時期が自動計算されます
            </p>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? '保存中...' : '保存'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
