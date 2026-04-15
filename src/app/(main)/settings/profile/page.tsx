import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/actions/profile';
import { ProfileForm } from '@/components/settings/profile-form';
import { getLocale, serverT } from '@/lib/i18n/server';

export default async function ProfileSettingsPage() {
  const profile = await getProfile();
  if (!profile) redirect('/login');
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1]) => serverT(locale, key);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('settings.profileSettings')}</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
