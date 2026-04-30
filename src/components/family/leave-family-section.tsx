"use client";

import { useState, useTransition } from 'react';
import { leaveFamily } from '@/lib/actions/family';
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

const CONFIRM_WORD = 'LEAVE';

interface LeaveFamilySectionProps {
  memberCount: number;
}

export function LeaveFamilySection({ memberCount }: LeaveFamilySectionProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  function localizeError(message: string) {
    if (message === 'family.leaveMigrationRequired') return t('family.leaveMigrationRequired');
    if (message === 'family.leaveNoFamily') return t('family.leaveNoFamily');
    if (message === 'family.leaveNeedRelogin') return t('family.leaveNeedRelogin');
    if (message === 'family.leaveFailed') return t('family.leaveFailed');
    if (message === 'auth.networkError') return t('auth.networkError');
    return message;
  }

  function handleLeave() {
    if (confirmText.trim().toUpperCase() !== CONFIRM_WORD) {
      toast.error(t('family.leaveConfirmMismatch'));
      return;
    }

    startTransition(async () => {
      const result = await leaveFamily();
      if (result?.error) {
        toast.error(localizeError(result.error));
        return;
      }

      toast.success(t('family.leaveSuccess'));
      window.location.assign('/dashboard');
    });
  }

  return (
    <>
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
        <p className="text-sm font-medium text-destructive">{t('family.leaveTitle')}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {memberCount > 1 ? t('family.leaveHintWithMembers') : t('family.leaveHintLastMember')}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => setOpen(true)}
        >
          {t('family.leaveAction')}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('family.leaveDialogTitle')}</DialogTitle>
            <DialogDescription>{t('family.leaveDialogDescription')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="leave-family-confirm">{t('family.leaveConfirmLabel')}</Label>
            <Input
              id="leave-family-confirm"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={t('family.leaveConfirmPlaceholder')}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">{t('family.leaveConfirmHint')}</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              {t('checklist.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={handleLeave} disabled={isPending}>
              {isPending ? t('family.leaving') : t('family.leaveExecute')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
