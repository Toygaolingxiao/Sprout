import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/security/rate-limit';

type SubscriptionBody = {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
};

function subscriptionFrom(body: SubscriptionBody) {
  const endpoint = typeof body.endpoint === 'string' ? body.endpoint : '';
  const p256dh = typeof body.keys?.p256dh === 'string' ? body.keys.p256dh : '';
  const auth = typeof body.keys?.auth === 'string' ? body.keys.auth : '';
  if (!endpoint.startsWith('https://') || !p256dh || !auth) return null;
  return { endpoint, keys: { p256dh, auth } };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!rateLimit(`push:${user.id}`, 20, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: SubscriptionBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
  }

  const subscription = subscriptionFrom(body);
  if (!subscription) return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    },
    { onConflict: 'user_id,endpoint' },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('notification_settings').upsert(
    { user_id: user.id, partner_activity_enabled: true },
    { onConflict: 'user_id' },
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let endpoint = '';
  try {
    const body = await request.json() as { endpoint?: unknown };
    endpoint = typeof body.endpoint === 'string' ? body.endpoint : '';
  } catch {
    endpoint = '';
  }

  let query = supabase.from('push_subscriptions').delete().eq('user_id', user.id);
  if (endpoint) query = query.eq('endpoint', endpoint);
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
