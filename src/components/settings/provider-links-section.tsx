"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProviderLink, unlinkProvider } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';

interface ProviderLinksSectionProps {
  googleLinked: boolean;
  lineLinked: boolean;
  linkedIdentityCount: number;
}

type ProviderKey = 'google' | 'line';

export function ProviderLinksSection({ googleLinked, lineLinked, linkedIdentityCount }: ProviderLinksSectionProps) {
    const hasAnyLinked = googleLinked || lineLinked;

  const [isPending, startTransition] = useTransition();
  const [pendingProvider, setPendingProvider] = useState<ProviderKey | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  function localizeError(message: string) {
    if (message === 'auth.networkError') return t('auth.networkError');
    if (message === 'settings.providerManualLinkingRequired') return t('settings.providerManualLinkingRequired');
    if (message === 'settings.providerUnsupported') return t('settings.providerUnsupported');
    if (message === 'settings.providerNotLinked') return t('settings.providerNotLinked');
    if (message === 'settings.providerUnlinkNeedAnother') return t('settings.providerUnlinkNeedAnother');
    if (message === 'settings.providerOperationFailed') return t('settings.providerOperationFailed');
    return message;
  }

  function providerLabel(provider: ProviderKey) {
    return provider === 'google' ? t('settings.providerGoogle') : t('settings.providerLine');
  }

  function handleLink(provider: ProviderKey) {
    startTransition(async () => {
      setPendingProvider(provider);

      const formData = new FormData();
      formData.set('provider', provider);
      formData.set('next', '/settings');

      const result = await createProviderLink(formData);
      if (result?.error) {
        toast.error(localizeError(result.error));
        setPendingProvider(null);
        return;
      }

      if (result?.url) {
        window.location.assign(result.url);
        return;
      }

      toast.error(t('settings.providerOperationFailed'));
      setPendingProvider(null);
    });
  }

  function handleUnlink(provider: ProviderKey) {
    startTransition(async () => {
      setPendingProvider(provider);

      const formData = new FormData();
      formData.set('provider', provider);

      const result = await unlinkProvider(formData);
      if (result?.error) {
        toast.error(localizeError(result.error));
      } else {
        toast.success(t('settings.providerDisconnected', { provider: providerLabel(provider) }));
        router.refresh();
      }

      setPendingProvider(null);
    });
  }

  function ProviderRow({ provider, linked }: { provider: ProviderKey; linked: boolean }) {
    const isCurrentPending = isPending && pendingProvider === provider;
    const isUnlinkDisabled = linked && linkedIdentityCount <= 1;

    return (
      <div className="flex items-center justify-between rounded-lg border px-3 py-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">{providerLabel(provider)}</p>
          <p className="text-xs text-muted-foreground">
            {linked ? t('settings.providerConnected') : t('settings.providerNotConnected')}
          </p>
        </div>

        {linked ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isCurrentPending || isUnlinkDisabled}
            onClick={() => handleUnlink(provider)}
          >
            {isCurrentPending ? t('settings.saving') : t('settings.providerDisconnect')}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={isCurrentPending}
            onClick={() => handleLink(provider)}
          >
            {isCurrentPending ? t('settings.saving') : t('settings.providerConnect')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">{t('settings.providerLinks')}</p>
        <p className="text-xs text-muted-foreground">{t('settings.providerLinksDesc')}</p>
      </div>

      <ProviderRow provider="line" linked={lineLinked} />
      <ProviderRow provider="google" linked={googleLinked} />

      {hasAnyLinked && linkedIdentityCount <= 1 && (
        <p className="text-xs text-muted-foreground">{t('settings.providerUnlinkNeedAnother')}</p>
      )}
    </div>
  );
}
