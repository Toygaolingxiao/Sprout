'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/context';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) output[index] = raw.charCodeAt(index);
  return output;
}

export function NotificationSection({ vapidPublicKey }: { vapidPublicKey: string }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const supported = typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window;

  async function enable() {
    if (!supported) {
      setMessage(t('notify.unsupported'));
      return;
    }
    if (!vapidPublicKey) {
      setMessage(t('notify.unconfigured'));
      return;
    }

    setPending(true);
    setMessage('');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setMessage(t('notify.denied'));
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      const json = subscription.toJSON();
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      });
      if (!response.ok) throw new Error('subscribe failed');
      setMessage(t('notify.saved'));
    } catch (error) {
      console.error('[notify]', error);
      setMessage(t('notify.error'));
    } finally {
      setPending(false);
    }
  }

  async function disable() {
    if (!supported) return;
    setPending(true);
    setMessage('');
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      const endpoint = subscription?.endpoint;
      await subscription?.unsubscribe();
      const response = await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      });
      if (!response.ok) throw new Error('unsubscribe failed');
      setMessage(t('notify.removed'));
    } catch (error) {
      console.error('[notify]', error);
      setMessage(t('notify.error'));
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('notify.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('notify.description')}</p>
        {!supported && <p className="text-sm text-muted-foreground">{t('notify.unsupported')}</p>}
        {supported && !vapidPublicKey && (
          <p className="text-sm text-muted-foreground">{t('notify.unconfigured')}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={enable} disabled={pending || !supported || !vapidPublicKey}>
            {pending ? t('notify.working') : t('notify.enable')}
          </Button>
          <Button type="button" variant="outline" onClick={disable} disabled={pending || !supported}>
            {t('notify.disable')}
          </Button>
        </div>
        {message && <p className="text-sm">{message}</p>}
      </CardContent>
    </Card>
  );
}
