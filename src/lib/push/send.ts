import { sendNotification, setVapidDetails, WebPushError } from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';

type PushRow = {
  endpoint: string;
  keys: { p256dh?: string; auth?: string } | null;
  user_id: string;
};

export async function notifyPartnerTaskCompleted(input: {
  familyId: string;
  actorId: string;
  taskTitle: string;
}) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  try {
    const admin = createAdminClient();
    const { data: members } = await admin
      .from('profiles')
      .select('id')
      .eq('family_id', input.familyId)
      .neq('id', input.actorId);

    const recipientIds = (members ?? []).map((member) => member.id);
    if (recipientIds.length === 0) return;

    const { data: settings } = await admin
      .from('notification_settings')
      .select('user_id, partner_activity_enabled')
      .in('user_id', recipientIds);

    const disabled = new Set(
      (settings ?? [])
        .filter((setting) => setting.partner_activity_enabled === false)
        .map((setting) => setting.user_id),
    );
    const enabledIds = recipientIds.filter((id) => !disabled.has(id));
    if (enabledIds.length === 0) return;

    const { data: subscriptions } = await admin
      .from('push_subscriptions')
      .select('endpoint, keys, user_id')
      .in('user_id', enabledIds);

    setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:notifications@localhost',
      publicKey,
      privateKey,
    );

    const payload = JSON.stringify({
      title: 'Sprout',
      body: input.taskTitle.slice(0, 120),
      url: '/dashboard',
    });

    await Promise.all(
      ((subscriptions ?? []) as PushRow[]).map(async (subscription) => {
        if (!subscription.keys?.p256dh || !subscription.keys.auth) return;
        try {
          await sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
              },
            },
            payload,
          );
        } catch (error) {
          const status = error instanceof WebPushError ? error.statusCode : 0;
          if (status === 404 || status === 410) {
            await admin.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint);
          } else {
            console.error('[push] delivery failed', status || (error instanceof Error ? error.message : error));
          }
        }
      }),
    );
  } catch (error) {
    console.error('[push]', error instanceof Error ? error.message : error);
  }
}
