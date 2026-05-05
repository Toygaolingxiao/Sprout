import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { WhatsNew } from '@/components/whats-new';
import { HeaderAdBanner } from '@/components/ads/header-ad-banner';
import { getProfile } from '@/lib/actions/profile';
import { normalizeTier } from '@/lib/billing/plans';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  let subscriptionTier = normalizeTier(undefined);
  try {
    const profile = await getProfile();
    subscriptionTier = normalizeTier((profile as { subscription_tier?: string } | null)?.subscription_tier);
  } catch {
    subscriptionTier = 'free';
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <HeaderAdBanner subscriptionTier={subscriptionTier} />
      <main className="flex-1 w-full px-4 py-3 sm:py-6 sm:pb-6 max-w-lg mx-auto" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
        {children}
      </main>
      <WhatsNew />
      <BottomNav />
    </div>
  );
}
