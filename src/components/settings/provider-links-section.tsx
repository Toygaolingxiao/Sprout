"use client";

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProviderLink, unlinkProvider } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

interface ProviderLinksSectionProps {
  googleLinked: boolean;
  lineLinked: boolean;
  linkedIdentityCount: number;
  lineProviderAlias: string;
  initialLinkStatus?: string | null;
  initialLinkProvider?: string | null;
  initialLinkError?: string | null;
}

type ProviderKey = 'google' | 'line';
type IdentityLike = { provider?: string | null };

function hasAnyProviderAlias(providerSet: Set<string>, aliases: string[]) {
  const normalizedAliases = aliases.map((alias) => alias.toLowerCase());

  return normalizedAliases.some((alias) => {
    if (providerSet.has(alias)) return true;

    for (const provider of providerSet) {
      if (provider.endsWith(`:${alias}`) || provider.includes(alias)) return true;
    }

    return false;
  });
}

export function ProviderLinksSection({
  googleLinked,
  lineLinked,
  linkedIdentityCount,
  lineProviderAlias,
  initialLinkStatus = null,
  initialLinkProvider = null,
  initialLinkError = null,
}: ProviderLinksSectionProps) {
  const [googleLinkedState, setGoogleLinkedState] = useState(googleLinked);
  const [lineLinkedState, setLineLinkedState] = useState(lineLinked);
  const [linkedIdentityCountState, setLinkedIdentityCountState] = useState(linkedIdentityCount);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [handledInitialStatus, setHandledInitialStatus] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [pendingProvider, setPendingProvider] = useState<ProviderKey | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  const hasAnyLinked = googleLinkedState || lineLinkedState;

  function localizeError(message: string) {
    if (message === 'auth.networkError') return t('auth.networkError');
    if (message === 'settings.providerManualLinkingRequired') return t('settings.providerManualLinkingRequired');
    if (message === 'settings.providerUnsupported') return t('settings.providerUnsupported');
    if (message === 'settings.providerUnsupportedGoogle') return t('settings.providerUnsupportedGoogle');
    if (message === 'settings.providerUnsupportedLine') return t('settings.providerUnsupportedLine');
    if (message === 'settings.providerLineConfigInvalid') return t('settings.providerLineConfigInvalid');
    if (message === 'settings.providerLineRedirectMismatch') return t('settings.providerLineRedirectMismatch');
    if (message === 'settings.providerLineAccessDenied') return t('settings.providerLineAccessDenied');
    if (message.startsWith('settings.providerLineTroubleshooting')) {
      const [, rawHint] = message.split(':', 2);
      const hint = rawHint?.trim();
      const base = t('settings.providerLineTroubleshooting');
      return hint ? `${base} (code: ${hint})` : base;
    }
    if (message === 'settings.providerNotLinked') return t('settings.providerNotLinked');
    if (message === 'settings.providerAlreadyLinked') return t('settings.providerAlreadyLinked');
    if (message === 'settings.providerUnlinkNeedAnother') return t('settings.providerUnlinkNeedAnother');
    if (message === 'settings.providerOperationFailed') return t('settings.providerOperationFailed');
    return message;
  }

  function providerLabel(provider: ProviderKey) {
    return provider === 'google' ? t('settings.providerGoogle') : t('settings.providerLine');
  }

  useEffect(() => {
    let cancelled = false;

    async function refreshProviderStatus() {
      try {
        const supabase = createClient();

        const [{ data: identitiesData }, { data: userData }] = await Promise.all([
          supabase.auth.getUserIdentities(),
          supabase.auth.getUser(),
        ]);

        if (cancelled) return;

        const fromEndpoint = (identitiesData?.identities ?? []) as IdentityLike[];
        const user = userData.user as ({ identities?: IdentityLike[]; app_metadata?: { providers?: unknown } } | null);
        const fromUser = Array.isArray(user?.identities) ? (user?.identities ?? []) : [];
        const metadataProviders = Array.isArray(user?.app_metadata?.providers)
          ? user!.app_metadata!.providers.filter((value): value is string => typeof value === 'string')
          : [];

        const providers = new Set<string>();
        for (const identity of [...fromEndpoint, ...fromUser]) {
          const provider = identity.provider?.toLowerCase();
          if (provider) providers.add(provider);
        }
        for (const provider of metadataProviders) {
          providers.add(provider.toLowerCase());
        }

        setGoogleLinkedState(hasAnyProviderAlias(providers, ['google']));
        setLineLinkedState(hasAnyProviderAlias(providers, ['line', 'custom:line', lineProviderAlias]));
        setLinkedIdentityCountState(fromEndpoint.length > 0 ? fromEndpoint.length : fromUser.length);
      } finally {
        if (!cancelled) {
          setStatusLoaded(true);
        }
      }
    }

    void refreshProviderStatus();

    return () => {
      cancelled = true;
    };
  }, [lineProviderAlias]);

  useEffect(() => {
    if (handledInitialStatus) return;
    if (!statusLoaded) return;
    if (!initialLinkStatus || !initialLinkProvider) return;

    const provider = initialLinkProvider === 'google' ? 'google' : initialLinkProvider === 'line' ? 'line' : null;
    if (!provider) return;

    if (initialLinkStatus === 'linked') {
      toast.success(t('settings.providerConnectedNow', { provider: providerLabel(provider) }));
      setHandledInitialStatus(true);
      router.replace('/settings');
      return;
    }

    if (initialLinkStatus === 'failed') {
      const linkedNow = provider === 'google' ? googleLinkedState : lineLinkedState;
      if (linkedNow) {
        toast.success(t('settings.providerConnectedNow', { provider: providerLabel(provider) }));
      } else {
        toast.error(initialLinkError ? localizeError(initialLinkError) : t('settings.providerOperationFailed'));
      }
      setHandledInitialStatus(true);
      router.replace('/settings');
    }
  }, [
    handledInitialStatus,
    statusLoaded,
    initialLinkStatus,
    initialLinkProvider,
    initialLinkError,
    googleLinkedState,
    lineLinkedState,
    localizeError,
    t,
    router,
  ]);

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

      if (result?.alreadyLinked) {
        toast.success(t('settings.providerAlreadyLinked', { provider: providerLabel(provider) }));
        setPendingProvider(null);
        router.refresh();
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
    const isUnlinkDisabled = linked && linkedIdentityCountState <= 1;

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

      <ProviderRow provider="line" linked={lineLinkedState} />
      <ProviderRow provider="google" linked={googleLinkedState} />

      {hasAnyLinked && linkedIdentityCountState <= 1 && (
        <p className="text-xs text-muted-foreground">{t('settings.providerUnlinkNeedAnother')}</p>
      )}
    </div>
  );
}
