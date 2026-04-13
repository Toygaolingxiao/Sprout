import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/actions/profile';
import { ProfileForm } from '@/components/settings/profile-form';

export default async function ProfileSettingsPage() {
  const profile = await getProfile();
  if (!profile) redirect('/login');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">プロフィール設定</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
