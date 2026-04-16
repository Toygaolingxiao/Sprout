"use client";

import { useState, useTransition } from 'react';
import { updatePassword } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';

export function ChangePasswordSection() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  function handleSubmit(formData: FormData) {
    const pw = formData.get('new_password') as string;
    const confirm = formData.get('confirm_password') as string;

    if (pw.length < 8) {
      toast.error(t('settings.passwordTooShort'));
      return;
    }
    if (pw !== confirm) {
      toast.error(t('settings.passwordMismatch'));
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('settings.passwordChanged'));
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(true)}>
        {t('settings.changePassword')}
      </Button>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="new_password">{t('settings.newPassword')}</Label>
        <Input
          id="new_password"
          name="new_password"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm_password">{t('settings.confirmPassword')}</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>
          {t('checklist.cancel')}
        </Button>
        <Button type="submit" size="sm" className="flex-1" disabled={isPending}>
          {isPending ? t('settings.saving') : t('settings.save')}
        </Button>
      </div>
    </form>
  );
}
