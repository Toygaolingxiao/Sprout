"use client";

import { useState, useTransition } from 'react';
import { updateProfile } from '@/lib/actions/profile';
import { STAGES } from '@/data/seed/stages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Profile } from '@/types';

interface ProfileSectionProps {
  profile: Profile;
}

export function ProfileSection({ profile }: ProfileSectionProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    // 既存のスケジュール値を維持
    if (!formData.has('expected_due_date')) {
      formData.set('expected_due_date', profile.expected_due_date ?? '');
    }
    if (!formData.has('expected_pregnancy_date')) {
      formData.set('expected_pregnancy_date', profile.expected_pregnancy_date ?? '');
    }

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('プロフィールを保存しました');
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">👤 プロフィール</CardTitle>
      </CardHeader>
      <CardContent>
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
          <Button type="submit" size="sm" disabled={isPending} className="w-full">
            {isPending ? '保存中...' : '保存'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
