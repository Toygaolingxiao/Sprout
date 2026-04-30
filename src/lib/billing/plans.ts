import type { SubscriptionTier } from '@/types';

export type PaidFeature = 'delete_all_custom_tasks';

const featureRequirements: Record<PaidFeature, SubscriptionTier> = {
  delete_all_custom_tasks: 'pro',
};

export function canUseFeature(tier: SubscriptionTier, feature: PaidFeature): boolean {
  const required = featureRequirements[feature];
  return required === 'free' || tier === required;
}

export function normalizeTier(value: string | null | undefined): SubscriptionTier {
  return value === 'pro' ? 'pro' : 'free';
}
