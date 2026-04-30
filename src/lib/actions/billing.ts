"use server";

import { headers } from 'next/headers';
import { getStripeServerClient } from '@/lib/billing/stripe';
import { normalizeTier } from '@/lib/billing/plans';
import { createClient, getAuthUser } from '@/lib/supabase/server';

function isBillingEnabled() {
  return process.env.BILLING_ENABLED === '1';
}

async function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const headerStore = await headers();
  const host = headerStore.get('host') ?? 'localhost:3000';
  const proto = headerStore.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

export async function createCheckoutSession() {
  if (!isBillingEnabled()) {
    return { error: 'billing.disabled' };
  }

  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY;
  if (!priceId) {
    return { error: 'billing.priceNotConfigured' };
  }

  const user = await getAuthUser();
  if (!user) {
    return { error: 'billing.authRequired' };
  }

  try {
    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, nickname, subscription_tier, stripe_customer_id')
      .eq('id', user.id)
      .single() as {
      data: {
        id: string;
        nickname: string;
        subscription_tier: string | null;
        stripe_customer_id: string | null;
      } | null;
      error: { message: string } | null;
    };

    if (profileError || !profile) {
      return { error: 'billing.profileRequired' };
    }

    if (normalizeTier(profile.subscription_tier) === 'pro') {
      return { error: 'billing.alreadyPro' };
    }

    const stripe = getStripeServerClient();
    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: profile.nickname || undefined,
        metadata: {
          user_id: user.id,
        },
      });

      customerId = customer.id;
      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
        })
        .eq('id', user.id);
    }

    const siteUrl = await getSiteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
      },
      success_url: `${siteUrl}/settings?billing=success`,
      cancel_url: `${siteUrl}/settings?billing=cancel`,
    });

    if (!session.url) {
      return { error: 'billing.checkoutFailed' };
    }

    return { url: session.url };
  } catch {
    return { error: 'billing.checkoutFailed' };
  }
}

export async function createBillingPortalSession() {
  if (!isBillingEnabled()) {
    return { error: 'billing.disabled' };
  }

  const user = await getAuthUser();
  if (!user) {
    return { error: 'billing.authRequired' };
  }

  try {
    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, stripe_customer_id')
      .eq('id', user.id)
      .single() as {
      data: {
        id: string;
        stripe_customer_id: string | null;
      } | null;
      error: { message: string } | null;
    };

    if (profileError || !profile) {
      return { error: 'billing.profileRequired' };
    }

    if (!profile.stripe_customer_id) {
      return { error: 'billing.noCustomer' };
    }

    const stripe = getStripeServerClient();
    const siteUrl = await getSiteUrl();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/settings`,
    });

    if (!session.url) {
      return { error: 'billing.portalFailed' };
    }

    return { url: session.url };
  } catch {
    return { error: 'billing.portalFailed' };
  }
}
