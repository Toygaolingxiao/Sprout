import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { APP_VERSION, RELEASE_NOTES } from '@/data/release-notes';
import { signOut } from '@/lib/actions/auth';
import { getProfile } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import { ChangePasswordSection } from '@/components/settings/change-password-section';
import { ChangeEmailSection } from '@/components/settings/change-email-section';
import { DeleteAccountSection } from '@/components/settings/delete-account-section';
import { ProviderLinksSection } from '@/components/settings/provider-links-section';
import { TemplateManagementSection } from '@/components/settings/template-management-section';
import { LanguageSwitcher } from '@/components/settings/language-switcher';
import { ProfileSection } from '@/components/settings/profile-section';
import { ScheduleSection } from '@/components/settings/schedule-section';
import { createClient } from '@/lib/supabase/server';
import { getLocale } from '@/lib/i18n/server';
import { serverT } from '@/lib/i18n/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '設定 | Sprout',
};

interface SettingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
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
  const linkStatus = typeof params.link_status === 'string' ? params.link_status : null;
  const linkProvider = typeof params.link_provider === 'string' ? params.link_provider : null;
  const linkError = typeof params.link_error === 'string' ? params.link_error : null;
  const currentEmail = user?.email ?? null;
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);
  const compactReleaseNotes = RELEASE_NOTES.slice(0, 5).map((note) => ({
    ...note,
    items: note.items
      .map((item) => item.replace(/\^+$/g, '').trim())
      .filter(Boolean)
      .slice(0, 2),
  }));

  const sectionLinks = [
    { id: 'profile-schedule', label: t('settings.quickProfileSchedule') },
    { id: 'display', label: t('settings.quickDisplay') },
    { id: 'template-data', label: t('settings.quickTemplateData') },
    { id: 'app-info', label: t('settings.quickAppInfo') },
    { id: 'account', label: t('settings.quickAccount') },
    { id: 'danger-zone', label: t('settings.quickDanger') },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('settings.pageSummary')}</p>
      </div>

      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2 px-1">
          {sectionLinks.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex h-8 items-center rounded-full border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>

      <section id="profile-schedule" className="scroll-mt-24 space-y-4">
        <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-emerald-500/10 px-4 py-3">
          <p className="text-sm text-muted-foreground">{t('settings.profileScheduleDesc')}</p>
        </div>
        {profile && <ProfileSection profile={profile} />}
        {profile && <ScheduleSection profile={profile} />}
      </section>

      <section id="display" className="scroll-mt-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.displayTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('settings.language')}</p>
            <LanguageSwitcher />
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('settings.appearance')}</p>
            <ThemeSwitcher />
          </div>
        </CardContent>
      </Card>
      </section>

      <section id="template-data" className="scroll-mt-24">
        {profile && <TemplateManagementSection defaultStage={profile.current_stage} />}
      </section>

      <section id="app-info" className="scroll-mt-24">
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
          <details className="rounded-lg border px-3 py-2">
            <summary className="cursor-pointer text-muted-foreground text-sm">
              {t('settings.releaseNotesBrief')}
            </summary>
            <p className="mt-2 text-xs text-muted-foreground">
              {t('settings.releaseNotesBriefHint', { count: compactReleaseNotes.length })}
            </p>
            <div className="mt-2 space-y-2">
              {compactReleaseNotes.map((note) => (
                <div key={note.version} className="rounded-md bg-muted/50 px-2 py-1.5">
                  <p className="text-xs font-medium">
                    v{note.version}
                    <span className="ml-1 text-muted-foreground">({note.date})</span>
                  </p>
                  <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
                    {note.items.map((item) => (
                      <li key={`${note.version}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
          <p className="text-xs text-muted-foreground">
            {t('settings.tagline')}
          </p>
        </CardContent>
      </Card>
      </section>

      <section id="account" className="scroll-mt-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.account')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProviderLinksSection
            googleLinked={googleLinked}
            lineLinked={lineLinked}
            linkedIdentityCount={linkedIdentityCount}
            lineProviderAlias={lineProvider}
            initialLinkStatus={linkStatus}
            initialLinkProvider={linkProvider}
            initialLinkError={linkError}
          />
          <ChangeEmailSection currentEmail={currentEmail} />
          <ChangePasswordSection />
          <Separator className="my-2" />
          <form action={signOut}>
            <Button variant="outline" size="sm" className="w-full" type="submit">
              {t('nav.logout')}
            </Button>
          </form>
        </CardContent>
      </Card>
      </section>

      <section id="danger-zone" className="scroll-mt-24">
      <Card className="border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-destructive">{t('settings.dangerZone')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">{t('settings.dangerZoneDesc')}</p>
          <DeleteAccountSection />
        </CardContent>
      </Card>
      </section>
    </div>
  );
}
