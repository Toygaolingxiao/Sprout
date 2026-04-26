"use client";

import { useState, useTransition } from 'react';
import { deleteAccount } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const CONFIRM_WORD = 'DELETE';

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  function localizeError(message: string) {
    if (message === 'settings.accountDeleteMigrationRequired') return t('settings.accountDeleteMigrationRequired');
    if (message === 'settings.accountDeleteDataConflict') return t('settings.accountDeleteDataConflict');
    if (message === 'settings.accountDeleteNeedRelogin') return t('settings.accountDeleteNeedRelogin');
    if (message === 'settings.accountDeleteFailed') return t('settings.accountDeleteFailed');
    if (message === 'auth.networkError') return t('auth.networkError');
    return message;
  }

  function handleDelete() {
    if (confirmText.trim().toUpperCase() !== CONFIRM_WORD) {
      toast.error(t('settings.accountDeleteConfirmMismatch'));
      return;
    }

    startTransition(async () => {
      const result = await deleteAccount();
      if (result?.error) {
        toast.error(localizeError(result.error));
        return;
      }

      toast.success(t('settings.accountDeleted'));
      window.location.assign('/login');
    });
  }

  return (
    <>
      <Button variant="destructive" size="sm" className="w-full" onClick={() => setOpen(true)}>
        {t('settings.deleteAccount')}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.deleteAccountTitle')}</DialogTitle>
            <DialogDescription>{t('settings.deleteAccountDescription')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="delete-account-confirm">{t('settings.deleteAccountConfirmLabel')}</Label>
            <Input
              id="delete-account-confirm"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={t('settings.deleteAccountConfirmPlaceholder')}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">{t('settings.deleteAccountConfirmHint')}</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              {t('checklist.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? t('settings.accountDeleting') : t('settings.deleteAccountExecute')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
