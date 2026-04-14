"use client";

import { useState, useEffect } from 'react';
import { APP_VERSION, RELEASE_NOTES } from '@/data/release-notes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/context';

export function WhatsNew() {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const seen = localStorage.getItem('sprout-seen-version');
    if (seen !== APP_VERSION) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem('sprout-seen-version', APP_VERSION);
    setShow(false);
  }

  if (!show) return null;

  const latest = RELEASE_NOTES[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <Card className="w-full max-w-sm animate-in fade-in zoom-in-95 shadow-xl">
        <CardHeader className="pb-3 text-center">
          <span className="text-3xl mb-1">🌱</span>
          <CardTitle className="text-lg">{t('whatsNew.title')}</CardTitle>
          <Badge variant="secondary" className="mx-auto mt-1">
            v{latest.version}（{latest.date}）
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-1.5 text-sm">
            {latest.items.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ul>
          <Button onClick={dismiss} className="w-full mt-3">
            {t('whatsNew.start')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
