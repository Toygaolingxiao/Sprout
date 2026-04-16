"use client";

import { useTransition } from 'react';
import { updateProfile } from '@/lib/actions/profile';
import { STAGES } from '@/data/seed/stages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';
import type { Profile } from '@/types';

interface ProfileSectionProps {
  profile: Profile;
}

export function ProfileSection({ profile }: ProfileSectionProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  function handleSubmit(formData: FormData) {
    // 既存のスケジュール値を維持
    if (!formData.has('expected_due_date')) {
      formData.set('expected_due_date', profile.expected_due_date ?? '');
    }
    if (!formData.has('expected_pregnancy_date')) {
      formData.set('expected_pregnancy_date', profile.expected_pregnancy_date ?? '');
    }
    if (!formData.has('baby_gender')) {
      formData.set('baby_gender', profile.baby_gender ?? 'unknown');
    }

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('settings.profileSaved'));
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('settings.profile')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">{t('settings.nickname')}</Label>
            <Input
              id="nickname"
              name="nickname"
              defaultValue={profile.nickname}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_stage">{t('settings.lifeStage')}</Label>
            <select
              id="current_stage"
              name="current_stage"
              aria-label={t('settings.lifeStageSelect')}
              defaultValue={profile.current_stage}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {t(`stage.${s.id}` as Parameters<typeof t>[0])}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baby_gender">{t('settings.babyGender')}</Label>
            <select
              id="baby_gender"
              name="baby_gender"
              aria-label={t('settings.babyGenderSelect')}
              defaultValue={profile.baby_gender ?? 'unknown'}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="unknown">{t('settings.babyGenderUnknown')}</option>
              <option value="female">{t('settings.babyGenderFemale')}</option>
              <option value="male">{t('settings.babyGenderMale')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_gender">{t('settings.userGender')}</Label>
            <select
              id="user_gender"
              name="user_gender"
              aria-label={t('settings.userGenderSelect')}
              defaultValue={profile.user_gender ?? 'unknown'}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="unknown">{t('settings.userGenderUnknown')}</option>
              <option value="female">{t('settings.userGenderFemale')}</option>
              <option value="male">{t('settings.userGenderMale')}</option>
              <option value="other">{t('settings.userGenderOther')}</option>
            </select>
          </div>
          <Button type="submit" size="sm" disabled={isPending} className="w-full">
            {isPending ? t('settings.saving') : t('settings.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
