"use client";

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { submitFeedbackComment } from '@/lib/actions/feedback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/lib/i18n/context';

export function FeedbackSection() {
  const { t, locale } = useTranslation();
  const [comment, setComment] = useState('');
  const [consentToPublish, setConsentToPublish] = useState(true);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await submitFeedbackComment({
        comment,
        consentToPublish,
        locale,
      });

      if (result?.error) {
        toast.error(t(result.error as Parameters<typeof t>[0]));
        return;
      }

      setComment('');
      setConsentToPublish(true);
      toast.success(consentToPublish ? t('feedback.submitSuccessPublish') : t('feedback.submitSuccessPrivate'));
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('feedback.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('feedback.desc')}</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="feedback-comment">{t('feedback.commentLabel')}</Label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={t('feedback.commentPlaceholder')}
              className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              maxLength={400}
              required
            />
            <p className="text-xs text-muted-foreground">{comment.trim().length}/400</p>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <Checkbox
              checked={consentToPublish}
              onCheckedChange={(checked) => setConsentToPublish(checked === true)}
              disabled={isPending}
            />
            <span>{t('feedback.publishConsent')}</span>
          </label>

          <p className="text-xs text-muted-foreground">{t('feedback.publishHint')}</p>

          <Button type="submit" className="w-full" size="sm" disabled={isPending}>
            {isPending ? t('feedback.submitting') : t('feedback.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
