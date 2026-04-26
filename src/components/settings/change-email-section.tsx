"use client";

import { useState, useTransition } from 'react';
import { updateEmail } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';

interface ChangeEmailSectionProps {
  currentEmail?: string | null;
}

export function ChangeEmailSection({ currentEmail }: ChangeEmailSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  function localizeError(message: string) {
    if (message === 'settings.emailRequired') return t('settings.emailRequired');
    if (message === 'auth.emailExists') return t('auth.emailExists');
    if (message === 'auth.networkError') return t('auth.networkError');
    return message;
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateEmail(formData);
      if (result?.error) {
        toast.error(localizeError(result.error));
      } else {
        toast.success(t('settings.emailUpdated'));
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <div className="space-y-2">
        <div className="rounded-lg border px-3 py-2 text-xs text-muted-foreground">
          {currentEmail ? `${t('settings.currentEmail')}: ${currentEmail}` : t('settings.noEmail')}
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(true)}>
          {currentEmail ? t('settings.changeEmail') : t('settings.addEmail')}
        </Button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="email">{t('settings.emailAddress')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={currentEmail ?? ''}
          placeholder="email@example.com"
        />
        <p className="text-xs text-muted-foreground">{t('settings.emailUpdateHint')}</p>
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
