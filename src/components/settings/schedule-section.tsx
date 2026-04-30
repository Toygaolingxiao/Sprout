"use client";

import { useState, useTransition } from 'react';
import { updateProfile } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';
import type { Profile } from '@/types';

interface ScheduleSectionProps {
  profile: Profile;
}

export function ScheduleSection({ profile }: ScheduleSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [pregnancyDate, setPregnancyDate] = useState(profile.expected_pregnancy_date ?? '');
  const [dueDate, setDueDate] = useState(profile.expected_due_date ?? '');
  const [resetTarget, setResetTarget] = useState<'pregnancy' | 'due' | null>(null);
  const { locale, t } = useTranslation();

  const dateInputLang = locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US';

  const resetLabel = resetTarget === 'pregnancy'
    ? t('settings.pregnancyDate')
    : t('settings.dueDate');

  function handleSubmit(formData: FormData) {
    // 既存のプロフィール値を維持
    formData.set('nickname', profile.nickname);
    formData.set('current_stage', profile.current_stage);
    formData.set('expected_pregnancy_date', pregnancyDate);
    formData.set('expected_due_date', dueDate);
    formData.set('baby_gender', profile.baby_gender ?? 'unknown');
    formData.set('user_gender', profile.user_gender ?? 'unknown');

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('settings.scheduleSaved'));
      }
    });
  }

  function handleConfirmReset() {
    if (resetTarget === 'pregnancy') {
      setPregnancyDate('');
    }

    if (resetTarget === 'due') {
      setDueDate('');
    }

    setResetTarget(null);
  }

  return (
    <>
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
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="expected_pregnancy_date">{t('settings.pregnancyDate')}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={t('settings.resetDateAria', { label: t('settings.pregnancyDate') })}
                  onClick={() => setResetTarget('pregnancy')}
                  disabled={isPending || pregnancyDate.length === 0}
                >
                  {t('settings.resetDate')}
                </Button>
              </div>
              <Input
                id="expected_pregnancy_date"
                name="expected_pregnancy_date"
                type="date"
                lang={dateInputLang}
                value={pregnancyDate}
                onChange={(event: { target: { value: string } }) => setPregnancyDate(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t('settings.pregnancyHint')}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="expected_due_date">{t('settings.dueDate')}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={t('settings.resetDateAria', { label: t('settings.dueDate') })}
                  onClick={() => setResetTarget('due')}
                  disabled={isPending || dueDate.length === 0}
                >
                  {t('settings.resetDate')}
                </Button>
              </div>
              <Input
                id="expected_due_date"
                name="expected_due_date"
                type="date"
                lang={dateInputLang}
                value={dueDate}
                onChange={(event: { target: { value: string } }) => setDueDate(event.target.value)}
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

      <Dialog open={resetTarget !== null} onOpenChange={(open: boolean) => !open && setResetTarget(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t('settings.resetDateTitle')}</DialogTitle>
            <DialogDescription>
              {t('settings.resetDateDescription', { label: resetLabel })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetTarget(null)}>
              {t('checklist.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleConfirmReset}>
              {t('settings.resetDateConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
