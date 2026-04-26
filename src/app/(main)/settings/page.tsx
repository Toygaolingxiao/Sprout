import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { APP_VERSION } from '@/data/release-notes';
import { signOut } from '@/lib/actions/auth';
import { getProfile } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { ChangePasswordSection } from '@/components/settings/change-password-section';
import { ChangeEmailSection } from '@/components/settings/change-email-section';
import { ProviderLinksSection } from '@/components/settings/provider-links-section';
import { TemplateManagementSection } from '@/components/settings/template-management-section';
import { LanguageSwitcher } from '@/components/settings/language-switcher';
import { createClient } from '@/lib/supabase/server';
import { getLocale } from '@/lib/i18n/server';
import { serverT } from '@/lib/i18n/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '設定 | Sprout',
};

export default async function SettingsPage() {
  const profile = await getProfile();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: identitiesData } = await supabase.auth.getUserIdentities();

  type IdentityLike = { provider?: string | null };

  const fromEndpoint = (identitiesData?.identities ?? []) as IdentityLike[];
  const fromUser = Array.isArray((user as { identities?: IdentityLike[] } | null)?.identities)
    ? ((user as { identities?: IdentityLike[] }).identities ?? [])
    : [];

  const identities = fromEndpoint.length > 0 ? fromEndpoint : fromUser;
  const providers = new Set(
    identities
      .map((identity) => identity.provider?.toLowerCase())
      .filter((provider): provider is string => Boolean(provider)),
  );

  const metadataProvidersRaw = ((user as { app_metadata?: { providers?: unknown } } | null)?.app_metadata?.providers ?? []) as unknown;
  const metadataProviders = new Set(
    Array.isArray(metadataProvidersRaw)
      ? metadataProvidersRaw
          .filter((value): value is string => typeof value === 'string')
          .map((value) => value.toLowerCase())
      : [],
  );

  const lineProvider = process.env.SUPABASE_LINE_PROVIDER || 'line';
  const normalizedLineProvider = lineProvider.toLowerCase();

  const hasProvider = (aliases: string[]) => {
    const normalizedAliases = aliases.map((alias) => alias.toLowerCase());

    return normalizedAliases.some((alias) => {
      if (providers.has(alias) || metadataProviders.has(alias)) return true;

      for (const provider of providers) {
        if (provider.endsWith(`:${alias}`) || provider.includes(alias)) return true;
      }
      for (const provider of metadataProviders) {
        if (provider.endsWith(`:${alias}`) || provider.includes(alias)) return true;
      }

      return false;
    });
  };

  const googleLinked = hasProvider(['google']);
  const lineLinked = hasProvider(['line', 'custom:line', normalizedLineProvider]);
  const linkedIdentityCount = identities.length;
  const currentEmail = user?.email ?? null;
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

      {/* Language */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.language')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageSwitcher />
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.appearance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSwitcher />
        </CardContent>
      </Card>

      {/* Template tools */}
      {profile && <TemplateManagementSection defaultStage={profile.current_stage} />}

      {/* App info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.appInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('settings.version')}</span>
            <span className="font-mono text-xs">{APP_VERSION}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <span className="text-muted-foreground">{t('settings.manual')}</span>
            <Link href="/manual" className="text-primary text-xs font-medium hover:underline">
              {t('settings.openManual')}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('settings.tagline')}
          </p>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.account')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProviderLinksSection
            googleLinked={googleLinked}
            lineLinked={lineLinked}
            linkedIdentityCount={linkedIdentityCount}
          />
          <ChangeEmailSection currentEmail={currentEmail} />
          <ChangePasswordSection />
          <form action={signOut}>
            <Button variant="outline" size="sm" className="w-full" type="submit">
              {t('nav.logout')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
