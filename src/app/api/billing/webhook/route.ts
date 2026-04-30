import type Stripe from 'stripe';
import { getStripeServerClient } from '@/lib/billing/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function mapTierFromSubscriptionStatus(status: Stripe.Subscription.Status): 'free' | 'pro' {
  if (status === 'active' || status === 'trialing' || status === 'past_due') {
    return 'pro';
  }
  return 'free';
}

async function updateProfileByUserId(input: {
  userId: string;
  tier: 'free' | 'pro';
  customerId?: string | null;
  subscriptionId?: string | null;
  expiresAt?: string | null;
}) {
  const supabase = createAdminClient();
  const payload: Database['public']['Tables']['profiles']['Update'] = {
    subscription_tier: input.tier,
    subscription_updated_at: new Date().toISOString(),
  };

  if (input.customerId !== undefined) payload.stripe_customer_id = input.customerId;
  if (input.subscriptionId !== undefined) payload.stripe_subscription_id = input.subscriptionId;
  if (input.expiresAt !== undefined) payload.subscription_expires_at = input.expiresAt;

  await supabase
    .from('profiles')
    .update(payload)
    .eq('id', input.userId);
}

async function updateProfileByCustomerId(input: {
  customerId: string;
  tier: 'free' | 'pro';
  subscriptionId?: string | null;
  expiresAt?: string | null;
}) {
  const supabase = createAdminClient();
  const payload: Database['public']['Tables']['profiles']['Update'] = {
    subscription_tier: input.tier,
    subscription_updated_at: new Date().toISOString(),
  };

  if (input.subscriptionId !== undefined) payload.stripe_subscription_id = input.subscriptionId;
  if (input.expiresAt !== undefined) payload.subscription_expires_at = input.expiresAt;

  await supabase
    .from('profiles')
    .update(payload)
    .eq('stripe_customer_id', input.customerId);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('STRIPE_WEBHOOK_SECRET is not configured', { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  const stripe = getStripeServerClient();
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return new Response('Invalid webhook signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = typeof session.customer === 'string' ? session.customer : null;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
        const userId = session.client_reference_id ?? session.metadata?.user_id ?? null;

        if (userId) {
          await updateProfileByUserId({
            userId,
            tier: 'pro',
            customerId,
            subscriptionId,
          });
        } else if (customerId) {
          await updateProfileByCustomerId({
            customerId,
            tier: 'pro',
            subscriptionId,
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : null;
        const currentPeriodEnd = (subscription as { current_period_end?: number }).current_period_end;
        if (!customerId) break;

        await updateProfileByCustomerId({
          customerId,
          tier: mapTierFromSubscriptionStatus(subscription.status),
          subscriptionId: subscription.id,
          expiresAt: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000).toISOString()
            : null,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : null;
        const currentPeriodEnd = (subscription as { current_period_end?: number }).current_period_end;
        if (!customerId) break;

        await updateProfileByCustomerId({
          customerId,
          tier: 'free',
          subscriptionId: subscription.id,
          expiresAt: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000).toISOString()
            : null,
        });
        break;
      }

      default:
        break;
    }
  } catch {
    return new Response('Webhook processing failed', { status: 500 });
  }

  return new Response('ok', { status: 200 });
}
