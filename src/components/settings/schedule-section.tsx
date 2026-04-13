"use client";

import { useState, useTransition } from 'react';
import { updateProfile } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Profile } from '@/types';

interface ScheduleSectionProps {
  profile: Profile;
}

export function ScheduleSection({ profile }: ScheduleSectionProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    // 既存のプロフィール値を維持
    formData.set('nickname', profile.nickname);
    formData.set('current_stage', profile.current_stage);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('スケジュールを保存しました');
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">📅 スケジュール設定</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          設定した日付をもとに、各タスクの推奨時期が自動計算されます
        </p>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expected_pregnancy_date">妊娠予定時期</Label>
            <Input
              id="expected_pregnancy_date"
              name="expected_pregnancy_date"
              type="date"
              defaultValue={profile.expected_pregnancy_date ?? ''}
            />
            <p className="text-xs text-muted-foreground">
              妊活中の方：妊娠を目指す時期の目安
            </p>
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
              妊娠がわかったら：医師から告げられた予定日
            </p>
          </div>
          <Button type="submit" size="sm" disabled={isPending} className="w-full">
            {isPending ? '保存中...' : '保存'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
