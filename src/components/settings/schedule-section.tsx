"use client";

import { useState, useTransition } from 'react';
import { updateProfile } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';
import type { Profile } from '@/types';

interface ScheduleSectionProps {
  profile: Profile;
}

export function ScheduleSection({ profile }: ScheduleSectionProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  function handleSubmit(formData: FormData) {
    // 既存のプロフィール値を維持
    formData.set('nickname', profile.nickname);
    formData.set('current_stage', profile.current_stage);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('settings.scheduleSaved'));
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('settings.schedule')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          {t('settings.scheduleDesc')}
        </p>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expected_pregnancy_date">{t('settings.pregnancyDate')}</Label>
            <Input
              id="expected_pregnancy_date"
              name="expected_pregnancy_date"
              type="date"
              defaultValue={profile.expected_pregnancy_date ?? ''}
            />
            <p className="text-xs text-muted-foreground">
              {t('settings.pregnancyHint')}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected_due_date">{t('settings.dueDate')}</Label>
            <Input
              id="expected_due_date"
              name="expected_due_date"
              type="date"
              defaultValue={profile.expected_due_date ?? ''}
            />
            <p className="text-xs text-muted-foreground">
              {t('settings.dueDateHint')}
            </p>
          </div>
          <Button type="submit" size="sm" disabled={isPending} className="w-full">
            {isPending ? t('settings.saving') : t('settings.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
